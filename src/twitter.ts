import { TwitterApi } from 'twitter-api-v2';
import { twitterCredentials } from './config.js';
import logger from './logger.js';
import { Tweet, PostTweetParams, SearchParams, TimelineParams, RateLimitInfo } from './types.js';

export class TwitterService {
  private client: TwitterApi;
  private rateLimitInfo: RateLimitInfo = {
    remaining: 300,
    reset: Date.now() + 900000,
    limit: 300,
  };

  constructor() {
    // Create client with OAuth 1.0a for posting tweets
    this.client = new TwitterApi({
      appKey: twitterCredentials.apiKey,
      appSecret: twitterCredentials.apiSecret,
      accessToken: twitterCredentials.accessToken,
      accessSecret: twitterCredentials.accessTokenSecret,
    });
  }

  private async handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
      const result = await apiCall();
      logger.info('Twitter API call successful');
      return result;
    } catch (error: any) {
      logger.error('Twitter API error', { error: error.message, code: error.code });
      
      if (error.code === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      if (error.code === 401) {
        throw new Error('Authentication failed. Please check your Twitter credentials.');
      }
      
      if (error.code === 403) {
        throw new Error('Access forbidden. You may not have permission to access this resource.');
      }
      
      throw new Error(`Twitter API error: ${error.message}`);
    }
  }

  async postTweet(params: PostTweetParams): Promise<Tweet> {
    logger.info('Posting tweet', { text: params.text.substring(0, 50) + '...' });
    
    const tweetParams: any = {
      text: params.text,
    };

    if (params.reply_to_tweet_id) {
      tweetParams.reply = { in_reply_to_tweet_id: params.reply_to_tweet_id };
    }

    const result = await this.handleApiCall(() =>
      this.client.v2.tweet(tweetParams)
    );

    return {
      id: result.data.id,
      text: result.data.text,
      created_at: (result.data as any).created_at,
    };
  }

  async searchTweets(params: SearchParams): Promise<Tweet[]> {
    logger.info('Searching tweets', { query: params.query });
    
    const searchParams: any = {
      query: params.query,
      max_results: params.max_results || 10,
    };

    const result = await this.handleApiCall(() =>
      this.client.v2.search(params.query, {
        ...searchParams,
        'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
      })
    );

    return (result.data as unknown as Tweet[]) || [];
  }

  async getTimeline(params: TimelineParams): Promise<Tweet[]> {
    logger.info('Getting user timeline', { username: params.username });
    
    // First get user by username
    const user = await this.handleApiCall(() =>
      this.client.v2.userByUsername(params.username)
    );

    if (!user.data) {
      throw new Error(`User ${params.username} not found`);
    }

    const timelineParams: any = {
      max_results: params.max_results || 10,
    };

    const result = await this.handleApiCall(() =>
      this.client.v2.userTimeline(user.data.id, {
        ...timelineParams,
        'tweet.fields': ['created_at', 'public_metrics'],
      })
    );

    return (result.data as unknown as Tweet[]) || [];
  }

  async getRateLimitInfo(): Promise<RateLimitInfo> {
    return this.rateLimitInfo;
  }
}

export const twitterService = new TwitterService(); 