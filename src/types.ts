export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

export interface ServerConfig {
  nodeEnv: string;
  logLevel: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface Tweet {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

export interface PostTweetParams {
  text: string;
  reply_to_tweet_id?: string;
}

export interface SearchParams {
  query: string;
  max_results?: number;
}

export interface TimelineParams {
  username: string;
  max_results?: number;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
} 