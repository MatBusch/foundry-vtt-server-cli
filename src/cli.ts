#!/usr/bin/env node

import * as dotenv from 'dotenv';
import * as awsService from './aws-service';

// Load environment variables
const result = dotenv.config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}

console.log("DISCORD_TOKEN length:", process.env.DISCORD_TOKEN?.length || 0);
console.log("First few characters:", process.env.DISCORD_TOKEN?.substring(0, 5) || "not found");
// Check required environment variables
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'EC2_INSTANCE_ID'
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

// Process command-line arguments
const command = process.argv[2]?.toLowerCase();

async function run() {
  if (!command) {
    showHelp();
    process.exit(1);
  }

  try {
    switch (command) {
      case 'start':
        const startResult = await awsService.startInstance(instanceId, ec2Client);
        if (startResult.success) {
          console.log(`Starting instance ${instanceId}...`);
        } else {
          console.error(`Failed to start instance: ${startResult.message}`);
          process.exit(1);
        }
        break;

      case 'stop':
        const stopResult = await awsService.stopInstance(instanceId, ec2Client);
        if (stopResult.success) {
          console.log(`Stopping instance ${instanceId}...`);
        } else {
          console.error(`Failed to stop instance: ${stopResult.message}`);
          process.exit(1);
        }
        break;

      case 'status':
        const statusResult = await awsService.getInstanceStatus(instanceId, ec2Client);
        if (statusResult.success) {
          console.log(statusResult.message);
        } else {
          console.error(`Failed to get instance status: ${statusResult.message}`);
          process.exit(1);
        }
        break;

      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Foundry VTT Server CLI

Usage:
  pnpm cli <command>

Commands:
  start   - Start the EC2 instance
  stop    - Stop the EC2 instance
  status  - Check the status of the EC2 instance
  `);
}

run(); 