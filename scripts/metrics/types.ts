/**
 * Types for Twitter metrics scraping functionality
 * Simplified version focusing on immediately available metrics
 */

/**
 * Core metrics we scrape from Twitter profile
 * Only includes data visible without historical tracking
 */
export interface TwitterMetrics {
    handle: string;
    followers: number;
    recentTweets: {
      count: number;          // Number of recent tweets we found
      avgLikes: number;       // Average likes per tweet
      avgRetweets: number;    // Average retweets per tweet
    };
    lastTweetDate: Date;      // Date of most recent tweet
    lastUpdate: Date;         // When we last scraped this data
  }
  
  /**
   * Configuration for the scraping process
   */
  export interface ScraperConfig {
    maxRetries: number;
    retryDelay: number;      // milliseconds
    timeout: number;         // milliseconds
    userAgent: string;
    tweetsToAnalyze: number; // How many recent tweets to look at
  }
  
  /**
   * Error types for better error handling
   */
  export enum ScraperErrorType {
    NETWORK = 'network',
    PARSING = 'parsing',
    TIMEOUT = 'timeout',
    NOT_FOUND = 'not_found',
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