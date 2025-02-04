import { TwitterScraper } from './scraper';

/**
 * Test script for Twitter metrics scraper
 * Tests scraping with one of our tool's Twitter handles
 */
async function testScraper() {
  // Create scraper instance
  const scraper = new TwitterScraper({
    maxRetries: 2,
    tweetsToAnalyze: 5
  });

  try {
    // Try to scrape metrics for UniSat Wallet (one of our tools)
    console.log('Starting scrape test for @unisat_wallet...');
    
    const metrics = await scraper.scrapeMetrics('unisat_wallet');
    
    console.log('\nScrape successful! Results:');
    console.log(JSON.stringify(metrics, null, 2));
    
    return metrics;
  } catch (error) {
    console.error('\nScrape failed:', error);
    process.exit(1);
  }
}

// Run the test
console.log('Starting scraper test...');
testScraper()
  .then(() => console.log('\nTest completed successfully!'))
  .catch(error => {
    console.error('\nTest failed:', error);
    process.exit(1);
  });