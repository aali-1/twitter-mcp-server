import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { twitterService } from './twitter.js';
import logger from './logger.js';
import { PostTweetParams, SearchParams, TimelineParams } from './types.js';

class TwitterMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server({
      name: 'twitter-mcp-server',
      version: '1.0.0',
    });

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'post_tweet',
            description: 'Post a new tweet with optional reply to a tweet ID',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'The text content of the tweet',
                },
                reply_to_tweet_id: {
                  type: 'string',
                  description: 'Optional tweet ID to reply to',
                },
              },
              required: ['text'],
            },
          },
          {
            name: 'search_tweets',
            description: 'Search for tweets using a query string',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for tweets',
                },
                max_results: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 10)',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_timeline',
            description: 'Get tweets from a user\'s timeline',
            inputSchema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'Username to get timeline for',
                },
                max_results: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 10)',
                },
              },
              required: ['username'],
            },
          },
          {
            name: 'get_rate_limit_info',
            description: 'Get current rate limit information',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'post_tweet':
            return await this.handlePostTweet(args as unknown as PostTweetParams);

          case 'search_tweets':
            return await this.handleSearchTweets(args as unknown as SearchParams);

          case 'get_timeline':
            return await this.handleGetTimeline(args as unknown as TimelineParams);

          case 'get_rate_limit_info':
            return await this.handleGetRateLimitInfo();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        logger.error('Tool call error', { tool: name, error: error.message });
        throw error;
      }
    });
  }

  private async handlePostTweet(args: PostTweetParams) {
    const tweet = await twitterService.postTweet(args);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(tweet, null, 2),
        },
      ],
    };
  }

  private async handleSearchTweets(args: SearchParams) {
    const tweets = await twitterService.searchTweets(args);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(tweets, null, 2),
        },
      ],
    };
  }

  private async handleGetTimeline(args: TimelineParams) {
    const tweets = await twitterService.getTimeline(args);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(tweets, null, 2),
        },
      ],
    };
  }

  private async handleGetRateLimitInfo() {
    const rateLimitInfo = await twitterService.getRateLimitInfo();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(rateLimitInfo, null, 2),
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Twitter MCP server started');
  }
}

export { TwitterMCPServer }; 