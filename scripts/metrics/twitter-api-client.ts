// src/scripts/metrics/twitter-api-client.ts
import { TwitterApi } from 'twitter-api-v2';
import type { ExtendedTwitterMetrics, TwitterMetrics, TwitterTweetData } from './types';
import { DEFAULT_CONFIG, type TwitterApiConfig, validateConfig } from './twitter-config';

export class TwitterMetricsClient {
  private readonly client: TwitterApi;
  private readonly config: TwitterApiConfig;
  private lastRequestTime: number = 0;
  private requestsThisWindow: number = 0;
  private windowResetTimeout: NodeJS.Timeout | null = null;

  constructor(config: Partial<TwitterApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    validateConfig(this.config);
    this.client = new TwitterApi(this.config.bearerToken);
    this.startWindowReset();
  }

  private startWindowReset(): void {
    if (this.windowResetTimeout) {
      clearInterval(this.windowResetTimeout);
    }

    this.windowResetTimeout = setInterval(() => {
      this.requestsThisWindow = 0;
      console.log('Rate limit window reset');
    }, 15 * 60 * 1000);
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.config.rateLimit.minDelayBetweenRequests) {
      const delay = this.config.rateLimit.minDelayBetweenRequests - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (this.requestsThisWindow >= this.config.rateLimit.maxRequestsPer15Min) {
      console.log('Rate limit reached, waiting for window reset...');
      await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }

    this.lastRequestTime = Date.now();
    this.requestsThisWindow++;
  }

  async getMetrics(handle: string): Promise<ExtendedTwitterMetrics> {
    try {
      await this.enforceRateLimit();

      console.log(`Fetching user data for @${handle}...`);

      // Get user data with expanded tweet info
      const user = await this.client.v2.userByUsername(handle, {
        'user.fields': [
          'public_metrics',
          'created_at',
          'most_recent_tweet_id',
          'pinned_tweet_id'
        ] as const,
        expansions: ['most_recent_tweet_id', 'pinned_tweet_id'] as any,
        'tweet.fields': [
          'created_at',
          'public_metrics',
          'text'
        ]
      });

      console.log('Raw API response:', JSON.stringify(user, null, 2));

      if (!user.data) {
        throw new Error(`User @${handle} not found`);
      }

      // Extract included tweets if any
      const tweets = (user.includes?.tweets || []) as TwitterTweetData[];
      const mostRecentTweet = tweets.find(t => t.id === user.data.most_recent_tweet_id);
      const pinnedTweet = tweets.find(t => t.id === user.data.pinned_tweet_id);

      // Calculate recent tweet metrics (if available)
      const recentTweets = {
        count: 1, // We only have the most recent tweet
        avgLikes: mostRecentTweet?.public_metrics.like_count || 0,
        avgRetweets: mostRecentTweet?.public_metrics.retweet_count || 0
      };

      // Maintain backwards compatibility with base TwitterMetrics
      const baseMetrics: TwitterMetrics = {
        handle,
        followers: user.data.public_metrics?.followers_count || 0,
        recentTweets,
        lastTweetDate: mostRecentTweet ? new Date(mostRecentTweet.created_at) : new Date(),
        lastUpdate: new Date()
      };

      // Return extended metrics
      return {
        ...baseMetrics,
        mostRecentTweet: mostRecentTweet ? {
          id: mostRecentTweet.id,
          createdAt: mostRecentTweet.created_at,
          text: mostRecentTweet.text,
          metrics: mostRecentTweet.public_metrics
        } : undefined,
        pinnedTweet: pinnedTweet ? {
          id: pinnedTweet.id,
          createdAt: pinnedTweet.created_at,
          text: pinnedTweet.text,
          metrics: pinnedTweet.public_metrics
        } : undefined,
        monthlyStats: {
          tweets: 0, // We can't get this from single request
          avgLikes: mostRecentTweet?.public_metrics.like_count || 0,
          avgRetweets: mostRecentTweet?.public_metrics.retweet_count || 0,
          avgQuotes: mostRecentTweet?.public_metrics.quote_count || 0,
          followersGrowth: 0 // Would need historical data
        },
        weeklyStats: {
          tweets: 0, // Can't get this from single request
          followersGrowth: 0 // Would need historical data
        }
      };

    } catch (error) {
      console.error(`Error fetching metrics for @${handle}:`, error);
      throw error;
    }
  }

  destroy(): void {
    if (this.windowResetTimeout) {
      clearInterval(this.windowResetTimeout);
    }
  }
}