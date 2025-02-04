// src/scripts/metrics/types.ts

/**
 * Twitter API v2 tweet metrics structure
 * Matches exactly what the API returns
 */
export interface TwitterTweetMetrics {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count?: number;
  }

  /**
   * Structure for individual tweet data from API
   */
  export interface TwitterTweetData {
    id: string;
    created_at: string;
    text: string;
    public_metrics: TwitterTweetMetrics;
  }

  /**
   * Core metrics interface used across all implementations
   * Both scraper and API client must provide these fields
   */
  export interface TwitterMetrics {
    handle: string;
    followers: number;
    recentTweets: {
      count: number;
      avgLikes: number;
      avgRetweets: number;
    };
    lastTweetDate: Date;
    lastUpdate: Date;
  }
  
  /**
   * Extended metrics available when using Twitter API
   * Optional fields that don't break existing implementations
   */
  export interface ExtendedTwitterMetrics extends TwitterMetrics {
    // Added strictness to tweet data structure
    mostRecentTweet?: {
      id: string;
      createdAt: string;
      text: string;
      metrics: TwitterTweetMetrics;
    };
    pinnedTweet?: {
      id: string;
      createdAt: string;
      text: string;
      metrics: TwitterTweetMetrics;
    };
    monthlyStats: MonthlyStats;
    weeklyStats: WeeklyStats;
  }

  /**
   * Monthly statistics for a Twitter profile
   */
  export interface MonthlyStats {
    tweets: number;
    avgLikes: number;
    avgRetweets: number;
    avgQuotes: number;
    followersGrowth: number;
  }

  /**
   * Weekly statistics for a Twitter profile
   */
  export interface WeeklyStats {
    tweets: number;
    followersGrowth: number;
  }

  /**
   * Configuration for the scraper
   */
  export interface ScraperConfig {
    maxRetries: number;
    retryDelay: number;
    timeout: number;
    tweetsToAnalyze: number;
    userAgent: string;
  }
  
  /**
   * Error types for better error handling
   */
  export enum ScraperErrorType {
    NETWORK = 'network',
    PARSING = 'parsing',
    TIMEOUT = 'timeout',
    NOT_FOUND = 'not_found',
    RATE_LIMIT = 'rate_limit',
    UNKNOWN = 'unknown'
  }
  
  /**
   * Custom error class for scraping errors
   */
  export class ScraperError extends Error {
    constructor(
      public type: ScraperErrorType,
      message: string,
      public readonly handle?: string
    ) {
      super(message);
      this.name = 'ScraperError';
    }
  }