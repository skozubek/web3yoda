import { chromium, type Page, type BrowserContext } from 'playwright';
import type { TwitterMetrics, ScraperConfig } from './types';
import { ScraperError, ScraperErrorType } from './types';

/**
 * Default configuration for the Twitter scraper
 */
const DEFAULT_CONFIG: ScraperConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  tweetsToAnalyze: 5,  // Only look at 5 most recent tweets
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

/**
 * Simplified TwitterScraper that focuses on basic metrics
 */
export class TwitterScraper {
  private config: ScraperConfig;

  constructor(config: Partial<ScraperConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Scrape basic metrics for a Twitter handle
   * Includes retry logic for reliability
   */
  async scrapeMetrics(handle: string): Promise<TwitterMetrics> {
    let lastError: Error | null = null;

    // Try a few times in case of temporary issues
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await this.singleScrapeAttempt(handle);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed for @${handle}:`, error.message);
        
        // Wait before retrying, longer each time
        if (attempt < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
        }
      }
    }

    throw new ScraperError(
      ScraperErrorType.UNKNOWN,
      `Failed to scrape @${handle} after ${this.config.maxRetries} attempts: ${lastError?.message}`,
      handle
    );
  }

  /**
   * Single attempt to scrape metrics from a profile
   */
  private async singleScrapeAttempt(handle: string): Promise<TwitterMetrics> {
    console.log(`Debug: Launching browser for ${handle}`);
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const context: BrowserContext = await browser.newContext({
        userAgent: this.config.userAgent,
        viewport: { width: 1280, height: 800 }
      });
      
      const page: Page = await context.newPage();
      
      // Set timeout for all operations
      page.setDefaultTimeout(this.config.timeout);

      // Go to profile and wait for key elements
      await page.goto(`https://twitter.com/${handle}`);
      await page.waitForLoadState('networkidle');

      // Check if profile exists
      const notFound = await page.locator('text="This account doesn\'t exist"').count();
      if (notFound > 0) {
        throw new ScraperError(ScraperErrorType.NOT_FOUND, `Twitter handle @${handle} not found`, handle);
      }

      // Get basic profile metrics
      const followers = await this.getFollowers(page);
      const [recentTweets, lastTweetDate] = await this.analyzeTweets(page);

      return {
        handle,
        followers,
        recentTweets,
        lastTweetDate,
        lastUpdate: new Date()
      };
    } finally {
      await browser.close();
    }
  }

  /**
   * Extract followers count from profile
   */
  private async getFollowers(page: Page): Promise<number> {
    try {
      // Wait for followers element to be visible
      await page.waitForSelector('div:has-text("Followers")', { timeout: this.config.timeout });

      // Get the text content of the element containing followers count
      // Note: The span before "Followers" contains the number
      const statsText = await page.evaluate(() => {
        const stats = document.querySelectorAll('span');
        for (const stat of stats) {
          const next = stat.nextElementSibling;
          if (next?.textContent?.trim() === 'Followers') {
            return stat.textContent || '';
          }
        }
        return '';
      });

      if (!statsText) {
        throw new Error('Followers count not found');
      }

      return this.parseMetricText(statsText);
    } catch (error) {
      console.error('Error getting followers:', error);
      throw new ScraperError(
        ScraperErrorType.PARSING,
        'Could not find followers count',
        await page.url()
      );
    }
  }

  /**
   * Analyze recent tweets for engagement metrics
   * Returns [engagement metrics, date of most recent tweet]
   */
  private async analyzeTweets(page: Page): Promise<[TwitterMetrics['recentTweets'], Date]> {
    // Get recent tweets
    const tweets = await page
      .locator('article[data-testid="tweet"]')
      .all();
    
    // Limit to configured number of tweets
    const tweetsToAnalyze = tweets.slice(0, this.config.tweetsToAnalyze);
    
    if (tweetsToAnalyze.length === 0) {
      throw new ScraperError(
        ScraperErrorType.PARSING,
        'No tweets found',
        await page.url()
      );
    }

    // Get timestamp from first (most recent) tweet, being more specific about the time element
    const timestamp = await tweetsToAnalyze[0]
      .locator('time[datetime]')
      .first()
      .getAttribute('datetime');
    
    // Calculate engagement metrics
    let totalLikes = 0;
    let totalRetweets = 0;

    for (const tweet of tweetsToAnalyze) {
      const likes = await this.parseMetricText(
        await tweet.locator('[data-testid="like"]').innerText()
      );
      const retweets = await this.parseMetricText(
        await tweet.locator('[data-testid="retweet"]').innerText()
      );

      totalLikes += likes;
      totalRetweets += retweets;
    }

    return [
      {
        count: tweetsToAnalyze.length,
        avgLikes: Math.round(totalLikes / tweetsToAnalyze.length),
        avgRetweets: Math.round(totalRetweets / tweetsToAnalyze.length)
      },
      new Date(timestamp || Date.now())  // Fallback to current date if no timestamp
    ];
  }

  /**
   * Convert metric text (like "1.5K") to number
   */
  private parseMetricText(text: string): number {
    const clean = text.toLowerCase().trim();
    if (!clean) return 0;

    const num = parseFloat(clean.replace(/[^0-9.]/g, ''));
    
    if (clean.includes('k')) return num * 1000;
    if (clean.includes('m')) return num * 1000000;
    
    return num;
  }
}