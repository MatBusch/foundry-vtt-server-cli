# Foundry VTT Server Control

![Scale Me Up](assets/scale-me-up.jpg)

A Discord bot and CLI tool for controlling a Foundry VTT server hosted on AWS EC2.

## Features

- Start, stop, and check the status of your EC2 instance running Foundry VTT
- Control via Discord commands (for authorized users only)
- Control via CLI commands
- GitHub Actions integration for web-based control

## Usage

### Discord Bot

The bot responds to the following commands:
- `!start` - Start the Foundry VTT server
- `!stop` - Stop the Foundry VTT server
- `!status` - Check server status
- `!help` - Show available commands

### CLI

Use the CLI tool to manage your server directly from the command line:

```bash
# Start the EC2 instance
pnpm cli start

# Stop the EC2 instance
pnpm cli stop

# Check the status of the EC2 instance
pnpm cli status
```

For development:
```bash
# Run the TypeScript files directly
pnpm dev
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
