// src/scripts/metrics/twitter-config.ts

/**
 * Configuration types for Twitter API client
 */
export interface TwitterApiConfig {
    /** Bearer token from Twitter API v2 */
    bearerToken: string;
    /** Maximum number of tweets to analyze for metrics */
    tweetsToAnalyze: number;
    /** Rate limiting configuration */
    rateLimit: {
      /** Maximum requests per 15-minute window (Twitter's standard) */
      maxRequestsPer15Min: number;
      /** Minimum delay between requests (in milliseconds) */
      minDelayBetweenRequests: number;
    };
  }
  
  /**
   * Default configuration values
   * Adjust these based on your API access level
   */
  export const DEFAULT_CONFIG: TwitterApiConfig = {
    bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    tweetsToAnalyze: 5,
    rateLimit: {
      maxRequestsPer15Min: 45, // Keep some buffer from the 50 limit
      minDelayBetweenRequests: 2000, // 2 seconds minimum between requests
    },
  };
  
  /**
   * Validate Twitter API configuration
   * Throws error if required values are missing
   */
  export function validateConfig(config: TwitterApiConfig): void {
    if (!config.bearerToken) {
      throw new Error('Twitter Bearer Token is required but not provided');
    }
  
    if (config.tweetsToAnalyze < 1 || config.tweetsToAnalyze > 100) {
      throw new Error('tweetsToAnalyze must be between 1 and 100');
    }
  }