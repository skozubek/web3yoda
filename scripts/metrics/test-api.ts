// src/scripts/metrics/test-api.ts
import { config } from 'dotenv';
import { TwitterMetricsClient } from './twitter-api-client';
import path from 'path';

// Load environment variables
const envResult = config({ path: path.resolve(process.cwd(), '.env') });

if (envResult.error) {
  console.error('Error loading .env file:', envResult.error);
  process.exit(1);
}

// Verify bearer token is loaded
if (!process.env.TWITTER_BEARER_TOKEN) {
  console.error('TWITTER_BEARER_TOKEN not found in environment variables');
  console.log('Current env vars:', Object.keys(process.env));
  process.exit(1);
}

async function testTwitterApi() {
  console.log('Bearer token length:', process.env.TWITTER_BEARER_TOKEN?.length || 0);

  const client = new TwitterMetricsClient({
    bearerToken: process.env.TWITTER_BEARER_TOKEN
  });

  try {
    console.log('Fetching metrics...');
    const metrics = await client.getMetrics('opensea');
    
    console.log('\nSuccessfully fetched metrics:');
    console.log(JSON.stringify(metrics, null, 2));

    return metrics;
  } catch (error) {
    console.error('Error testing Twitter API:', error);
    throw error;
  } finally {
    client.destroy();
  }
}

// Run the test
console.log('Starting Twitter API test...');
console.log('Current working directory:', process.cwd());
testTwitterApi()
  .then(() => console.log('\nTest completed successfully!'))
  .catch(error => {
    console.error('\nTest failed:', error);
    process.exit(1);
  });