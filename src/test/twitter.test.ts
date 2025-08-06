import { TwitterService } from '../twitter';
import { PostTweetParams, SearchParams, TimelineParams } from '../types';

// Mock the Twitter API client
jest.mock('twitter-api-v2', () => ({
  TwitterApi: jest.fn().mockImplementation(() => ({
    v2: {
      tweet: jest.fn().mockResolvedValue({
        data: {
          id: '123456789',
          text: 'Test tweet',
          created_at: '2023-01-01T00:00:00.000Z',
        },
      }),
      search: jest.fn().mockResolvedValue({
        data: [
          {
            id: '123456789',
            text: 'Test search result',
            created_at: '2023-01-01T00:00:00.000Z',
          },
        ],
      }),
      userByUsername: jest.fn().mockResolvedValue({
        data: {
          id: '123456789',
          username: 'testuser',
        },
      }),
      userTimeline: jest.fn().mockResolvedValue({
        data: [
          {
            id: '123456789',
            text: 'Test timeline tweet',
            created_at: '2023-01-01T00:00:00.000Z',
          },
        ],
      }),
    },
  })),
}));

describe('TwitterService', () => {
  let twitterService: TwitterService;

  beforeEach(() => {
    twitterService = new TwitterService();
  });

  describe('postTweet', () => {
    it('should post a tweet successfully', async () => {
      const params: PostTweetParams = {
        text: 'Test tweet content',
      };

      const result = await twitterService.postTweet(params);

      expect(result).toEqual({
        id: '123456789',
        text: 'Test tweet',
        created_at: '2023-01-01T00:00:00.000Z',
      });
    });

    it('should post a reply tweet', async () => {
      const params: PostTweetParams = {
        text: 'Test reply',
        reply_to_tweet_id: '123456789',
      };

      const result = await twitterService.postTweet(params);

      expect(result).toEqual({
        id: '123456789',
        text: 'Test tweet',
        created_at: '2023-01-01T00:00:00.000Z',
      });
    });
  });

  describe('searchTweets', () => {
    it('should search tweets successfully', async () => {
      const params: SearchParams = {
        query: 'test query',
        max_results: 5,
      };

      const result = await twitterService.searchTweets(params);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '123456789',
        text: 'Test search result',
        created_at: '2023-01-01T00:00:00.000Z',
      });
    });

    it('should use default max_results when not provided', async () => {
      const params: SearchParams = {
        query: 'test query',
      };

      const result = await twitterService.searchTweets(params);

      expect(result).toHaveLength(1);
    });
  });

  describe('getTimeline', () => {
    it('should get user timeline successfully', async () => {
      const params: TimelineParams = {
        username: 'testuser',
        max_results: 5,
      };

      const result = await twitterService.getTimeline(params);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '123456789',
        text: 'Test timeline tweet',
        created_at: '2023-01-01T00:00:00.000Z',
      });
    });

    it('should use default max_results when not provided', async () => {
      const params: TimelineParams = {
        username: 'testuser',
      };

      const result = await twitterService.getTimeline(params);

      expect(result).toHaveLength(1);
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return rate limit information', async () => {
      const result = await twitterService.getRateLimitInfo();

      expect(result).toEqual({
        remaining: 300,
        reset: expect.any(Number),
        limit: 300,
      });
    });
  });
}); 