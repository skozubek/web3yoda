// src/scripts/metrics/types.ts

/**
 * Monthly statistics for a Twitter profile
 * Used by both API client and scraper implementations
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
   * Used by both API client and scraper implementations
   */
  export interface WeeklyStats {
    tweets: number;
    followersGrowth: number;
  }

  /**
   * Core metrics interface used across all implementations
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
   * Extended metrics interface for the new API implementation
   * Extends core metrics to maintain backward compatibility
   */
  export interface ExtendedTwitterMetrics extends TwitterMetrics {
    monthlyStats: MonthlyStats;
    weeklyStats: WeeklyStats;
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