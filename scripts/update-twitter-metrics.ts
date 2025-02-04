import { readFile, writeFile } from 'fs/promises';
import { globby } from 'globby';
import { TwitterScraper } from './metrics/scraper';
import type { TwitterMetrics } from './metrics/types';

/**
 * Updates Twitter metrics in all tool MDX files
 * Runs in GitHub Actions every 6 hours
 */
async function updateMetrics() {
  try {
    console.log('Starting Twitter metrics update...');
    
    // Initialize scraper
    const scraper = new TwitterScraper({
      maxRetries: 3,
      tweetsToAnalyze: 5
    });

    // Find all tool MDX files
    const mdxFiles = await globby('src/content/tools/**/*.mdx');
    console.log(`Found ${mdxFiles.length} tool files`);

    // Process each file
    for (const filePath of mdxFiles) {
      try {
        await processFile(filePath, scraper);
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        // Continue with next file even if one fails
      }
    }

    console.log('Metrics update completed successfully');
  } catch (error) {
    console.error('Error updating metrics:', error);
    process.exit(1);
  }
}

/**
 * Process a single MDX file
 * Extracts Twitter handle, gets new metrics, updates file
 */
async function processFile(filePath: string, scraper: TwitterScraper) {
  console.log(`\nProcessing ${filePath}...`);

  // Read file content
  const content = await readFile(filePath, 'utf-8');

  // Extract Twitter handle from social.x field
  const match = content.match(/x:\s*["']https:\/\/twitter\.com\/([^"']+)["']/);
  if (!match) {
    console.log(`No Twitter handle found in ${filePath}, skipping...`);
    return;
  }

  const handle = match[1];
  console.log(`Found Twitter handle: @${handle}`);

  try {
    // Get fresh metrics
    const metrics = await scraper.scrapeMetrics(handle);
    console.log(`Successfully scraped metrics for @${handle}`);
    
    // Update file content
    const updatedContent = updateFileContent(content, metrics);
    
    // Save changes
    await writeFile(filePath, updatedContent, 'utf-8');
    console.log(`Updated metrics for @${handle}`);
  } catch (error) {
    console.error(`Failed to update metrics for @${handle}:`, error);
  }
}

/**
 * Updates the xMetrics section in MDX frontmatter
 */
function updateFileContent(content: string, metrics: TwitterMetrics): string {
  // Prepare new metrics block
  const metricsBlock = `xMetrics:
  handle: "${metrics.handle}"
  followers: ${metrics.followers}
  monthlyStats:
    tweets: ${metrics.recentTweets.count * 6}  # Estimated from recent tweets
    avgLikes: ${metrics.recentTweets.avgLikes}
    avgRetweets: ${metrics.recentTweets.avgRetweets}
    avgQuotes: 0  # Not currently tracked
    followersGrowth: 0  # Not currently tracked
  weeklyStats:
    tweets: ${metrics.recentTweets.count}
    followersGrowth: 0  # Not currently tracked
  lastTweetDate: ${metrics.lastTweetDate.toISOString()}
  lastMetricsUpdate: ${metrics.lastUpdate.toISOString()}`;

  // Replace existing metrics block or add after frontmatter
  if (content.includes('xMetrics:')) {
    // Replace existing block
    return content.replace(
      /xMetrics:[\s\S]+?(^[a-zA-Z]|---)/m,
      `${metricsBlock}\n\n$1`
    );
  } else {
    // Add new block before first non-frontmatter content
    return content.replace(
      /(^---[\s\S]+?)(^[a-zA-Z]|^---)/m,
      `$1\n${metricsBlock}\n\n$2`
    );
  }
}

// Run the update
updateMetrics().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});