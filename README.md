# Twitter MCP Server

A Model Context Protocol (MCP) server for Twitter API with posting, searching, and timeline features.

## Features

- **Post Tweets**: Post new tweets with optional reply functionality
- **Search Tweets**: Search for tweets using query strings
- **Get Timelines**: Retrieve user timelines
- **Rate Limiting**: Basic rate limiting for Twitter API calls
- **TypeScript**: Full TypeScript support with strict type checking
- **Testing**: Comprehensive test suite with Jest

## Prerequisites

- Node.js 18+
- Twitter API credentials (API Key, API Secret, Access Token, Access Token Secret, Bearer Token)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd twitter-mcp-server
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env
```

Edit `.env` with your Twitter API credentials:

```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

## Usage

### Build and Run

```bash
# Build the project
npm run build

# Run the MCP server
npm start
```

### Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## MCP Tools

The server provides the following MCP tools:

### post_tweet

Post a new tweet with optional reply functionality.

**Parameters:**

- `text` (string, required): The text content of the tweet
- `reply_to_tweet_id` (string, optional): Tweet ID to reply to

**Example:**

```json
{
  "name": "post_tweet",
  "arguments": {
    "text": "Hello, world!",
    "reply_to_tweet_id": "1234567890123456789"
  }
}
```

### search_tweets

Search for tweets using a query string.

**Parameters:**

- `query` (string, required): Search query for tweets
- `max_results` (number, optional): Maximum number of results (default: 10)

**Example:**

```json
{
  "name": "search_tweets",
  "arguments": {
    "query": "AI",
    "max_results": 5
  }
}
```

### get_timeline

Get tweets from a user's timeline.

**Parameters:**

- `username` (string, required): Username to get timeline for
- `max_results` (number, optional): Maximum number of results (default: 10)

**Example:**

```json
{
  "name": "get_timeline",
  "arguments": {
    "username": "elonmusk",
    "max_results": 5
  }
}
```

### get_rate_limit_info

Get current rate limit information.

**Parameters:** None

**Example:**

```json
{
  "name": "get_rate_limit_info",
  "arguments": {}
}
```

## Configuration

### Environment Variables

| Variable                      | Description                 | Default         |
| ----------------------------- | --------------------------- | --------------- |
| `TWITTER_API_KEY`             | Twitter API Key             | Required        |
| `TWITTER_API_SECRET`          | Twitter API Secret          | Required        |
| `TWITTER_ACCESS_TOKEN`        | Twitter Access Token        | Required        |
| `TWITTER_ACCESS_TOKEN_SECRET` | Twitter Access Token Secret | Required        |
| `TWITTER_BEARER_TOKEN`        | Twitter Bearer Token        | Required        |
| `NODE_ENV`                    | Environment                 | production      |
| `LOG_LEVEL`                   | Log level                   | info            |
| `RATE_LIMIT_WINDOW_MS`        | Rate limit window           | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS`     | Max requests per window     | 300             |

### Rate Limiting

The server implements basic rate limiting:

- Respects Twitter's API rate limits
- Provides rate limit information via `get_rate_limit_info` tool
- Graceful error handling for rate limit exceeded scenarios

## Project Structure

```
src/
├── config.ts          # Configuration management
├── logger.ts          # Logging utilities
├── server.ts          # MCP server implementation
├── twitter.ts         # Twitter API service
├── types.ts           # TypeScript type definitions
├── index.ts           # Main entry point
└── test/              # Test files
    ├── basic.test.ts
    └── twitter.test.ts
```

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

Tests cover:

- Twitter service functionality
- Rate limiting
- Error handling
- Tool parameter validation

## Development

### Available Scripts

```bash
npm run dev          # Start in development mode
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Jest**: Testing framework

## Error Handling

The server includes comprehensive error handling:

- Twitter API errors (rate limits, authentication, etc.)
- Network errors
- Validation errors
- Graceful shutdown handling

## Security

- Environment variable validation
- Input validation
- Error handling without information leakage
- Secure credential management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License
