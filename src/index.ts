import { Client, GatewayIntentBits, Events, Partials, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import * as awsService from './aws-service';


// Load environment variables
const result = dotenv.config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}

console.log("DISCORD_TOKEN: found dawg ");

// Check required environment variables
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'EC2_INSTANCE_ID',
  'DISCORD_TOKEN',
  'AUTHORIZED_USER_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize AWS service
const ec2Client = awsService.createEC2Client(process.env.AWS_REGION!);
const instanceId = process.env.EC2_INSTANCE_ID!;

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// User authorization check
const isAuthorized = (userId: string): boolean => {
  return userId === process.env.AUTHORIZED_USER_ID;
};

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
  console.log(`Bot ID: ${readyClient.user.id}`);
  console.log(`Serving ${readyClient.guilds.cache.size} servers`);
  readyClient.guilds.cache.forEach(guild => {
    console.log(`Connected to server: ${guild.name} (${guild.id})`);
    console.log(`Available channels: ${guild.channels.cache.map(c => c.name).join(', ')}`);
  });
  console.log('Foundry VTT Server Bot is now online!');
});

client.on('raw', packet => {
  console.log(`Received raw event: ${packet.t}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
  // Log all messages for debugging
  console.log(`Message received: ${message.content} from ${message.author.tag} (${message.author.id})`);
  
  // Ignore bot messages and messages not starting with !
  if (message.author.bot || !message.content.startsWith('!')) {
    console.log('Ignored message: bot message or doesn\'t start with !');
    return;
  }

  // Authorization check
  if (!isAuthorized(message.author.id)) {
    console.log(`User ${message.author.id} not authorized. Expected: ${process.env.AUTHORIZED_USER_ID}`);
    return message.reply("You're not authorized to control the Foundry VTT server.");
  }

  const command = message.content.toLowerCase().split(' ')[0].slice(1);

  try {
    switch (command) {
      case 'start':
        const startResult = await awsService.startInstance(instanceId, ec2Client);
        if (startResult.success) {
          message.reply('Starting Foundry VTT server...');
        } else {
          message.reply(`Failed to start server: ${startResult.message}`);
        }
        break;
      case 'stop':
        const stopResult = await awsService.stopInstance(instanceId, ec2Client);
        if (stopResult.success) {
          message.reply('Stopping Foundry VTT server...');
        } else {
          message.reply(`Failed to stop server: ${stopResult.message}`);
        }
        break;
      case 'status':
        const statusResult = await awsService.getInstanceStatus(instanceId, ec2Client);
        if (statusResult.success) {
          message.reply(statusResult.message);
        } else {
          message.reply(`Failed to get server status: ${statusResult.message}`);
        }
        break;
      case 'help':
        message.reply(
          '**Available commands:**\n' +
          '`!start` - Start the Foundry VTT server\n' +
          '`!stop` - Stop the Foundry VTT server\n' +
          '`!status` - Check server status\n' +
          '`!help` - Show this help message'
        );
        break;
      default:
        message.reply('Unknown command. Try `!help` for available commands.');
    }
  } catch (error) {
    console.error('Error:', error);
    message.reply(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Add this near the other event handlers
client.on('messageCreate', message => {
  console.log('RAW MESSAGE RECEIVED:', {
    content: message.content,
    author: message.author.tag,
    channelId: message.channelId,
    channelType: message.channel.type
  });
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
