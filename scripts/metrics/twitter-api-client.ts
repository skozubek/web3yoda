// src/scripts/metrics/twitter-api-client.ts
import { TwitterApi } from 'twitter-api-v2';

import type { TwitterMetrics, ExtendedTwitterMetrics } from './types';
import { DEFAULT_CONFIG, type TwitterApiConfig, validateConfig } from './twitter-config';

/**
 * Client for fetching Twitter metrics using Twitter API v2
 */
export class TwitterMetricsClient {
  /** Twitter API client instance */
  /** Twitter API client instance with read-only access */
  private readonly client: TwitterApi;

  /** Client configuration */
  private readonly config: TwitterApiConfig;

  /** Timestamp of last API request */
  private lastRequestTime: number = 0;

  /** Counter for requests in current time window */
  private requestsThisWindow: number = 0;

  /** Timer for resetting request window */
  private windowResetTimeout: NodeJS.Timeout | null = null;

  constructor(config: Partial<TwitterApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    validateConfig(this.config);

    // Initialize client with bearer token
    this.client = new TwitterApi(this.config.bearerToken);

    // Start rate limit window tracking
    this.startWindowReset();
  }

  /**
   * Reset request counter every 15 minutes
   * This helps us stay within Twitter's rate limits
   */
  private startWindowReset(): void {
    if (this.windowResetTimeout) {
      clearInterval(this.windowResetTimeout);
    }

    this.windowResetTimeout = setInterval(() => {
      this.requestsThisWindow = 0;
      console.log('Rate limit window reset');
    }, 15 * 60 * 1000); // 15 minutes
  }

  /**
   * Enforce rate limits and delays between requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // Ensure minimum delay between requests
    if (timeSinceLastRequest < this.config.rateLimit.minDelayBetweenRequests) {
      const delay = this.config.rateLimit.minDelayBetweenRequests - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Check if we're at the rate limit
    if (this.requestsThisWindow >= this.config.rateLimit.maxRequestsPer15Min) {
      console.log('Rate limit reached, waiting for window reset...');
      await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // Wait 1 minute
    }

    this.lastRequestTime = Date.now();
    this.requestsThisWindow++;
  }

  /**
   * Fetch metrics for a Twitter handle
   */
  async getMetrics(handle: string): Promise<ExtendedTwitterMetrics> {
    try {
      await this.enforceRateLimit();

      console.log(`Fetching user data for @${handle}...`);

      // Get user data with public metrics
      const user = await this.client.v2.userByUsername(handle, {
        'user.fields': ['public_metrics', 'created_at']
      });

      console.log('User data response:', JSON.stringify(user, null, 2));

      if (!user.data) {
        throw new Error(`User @${handle} not found`);
      }
      return {
        handle,
        followers: user.data.public_metrics.followers_count,
        recentTweets: {
          count: 0,
          avgLikes: 0,
          avgRetweets: 0
        },
        monthlyStats: {
          tweets: 0, // Estimate based on recent activity
          avgLikes: 0,
          avgRetweets: 0,
          avgQuotes: 0,
          followersGrowth: 0 // Requires historical data
        },
        weeklyStats: {
          tweets: 0,
          followersGrowth: 0
        },
        lastTweetDate: new Date(),
        lastUpdate: new Date()
      };

    } catch (error) {
      console.error(`Error fetching metrics for @${handle}:`, error);
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.windowResetTimeout) {
      clearInterval(this.windowResetTimeout);
    }
  }
}