# Foundry VTT Server Bot

A Discord bot and CLI tool to manage your Foundry VTT EC2 instance on AWS. This tool allows you to start, stop, and check the status of your EC2 instance using either Discord commands or a command-line interface.

## Description

This project provides an easy way to control your AWS EC2 instance that hosts Foundry VTT. Instead of logging into the AWS console every time, you can use simple commands in Discord or via the command line to manage your server.

## Features

- Start your EC2 instance
- Stop your EC2 instance
- Check the status of your EC2 instance
- User authorization for Discord commands
- Simple CLI for direct server management

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm
- AWS account with an EC2 instance
- Discord account and a bot token

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/foundry-vtt-server-bot.git
   cd foundry-vtt-server-bot
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   AWS_REGION=your_region
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   EC2_INSTANCE_ID=your_instance_id
   DISCORD_TOKEN=your_discord_bot_token
   AUTHORIZED_USER_ID=your_discord_user_id
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Usage

### Discord Bot

1. Start the Discord bot:
   ```bash
   npm start
   ```

2. Use the following commands in any Discord channel where the bot is present:
   - `!start` - Start the Foundry VTT server
   - `!stop` - Stop the Foundry VTT server
   - `!status` - Check server status
   - `!help` - Show available commands

Note: Only the user with the ID specified in `AUTHORIZED_USER_ID` can control the server.

### CLI Tool

Use the CLI tool to manage your server directly from the command line:

```bash
# Start the EC2 instance
npm run cli -- start

# Stop the EC2 instance
npm run cli -- stop

# Check the status of the EC2 instance
npm run cli -- status
```

For development:
```bash
# Run the TypeScript files directly
npm run dev
```

## Project Architecture

The project follows a simple architecture with clear separation of concerns. For more details, see [Architecture.md](Architecture.md).

## Technical Details

- Built with TypeScript for type safety
- Uses Discord.js for the Discord bot interface
- Uses AWS SDK v3 for EC2 instance management
- Environment variables for secure configuration

## License

ISC

## Author

Mat Busch
