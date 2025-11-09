/**
 * GitHub Repository Data Fetcher
 * 
 * This script fetches public repository data from GitHub for a specific user
 * and formats it for easy import into a database (e.g., Supabase projects table)
 * 
 * Usage:
 *   node fetch-repos.js
 * 
 * Environment Variables:
 *   GITHUB_TOKEN - Optional GitHub Personal Access Token to avoid rate limits
 *   GITHUB_USERNAME - Optional GitHub username (defaults to 'Vijayapardhu')
 */

const fetch = require('node-fetch');
const fs = require('fs');

// Configuration
const username = process.env.GITHUB_USERNAME || 'Vijayapardhu';
const token = process.env.GITHUB_TOKEN || null;
const perPage = 100;
const outputFile = 'repos-data.json';

/**
 * Fetch all repositories for a user with pagination
 */
async function fetchAllRepos(username) {
  let page = 1;
  let allRepos = [];
  
  console.log(`Fetching repositories for user: ${username}`);
  
  while (true) {
    const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Repo-Fetcher'
    };
    
    // Add authentication if token is provided
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    console.log(`Fetching page ${page}...`);
    
    try {
      const response = await fetch(url, { headers });
      
      // Check for rate limiting
      if (response.status === 403) {
        console.error('Rate limit exceeded. Please use a GitHub Personal Access Token.');
        const resetTime = response.headers.get('x-ratelimit-reset');
        if (resetTime) {
          const resetDate = new Date(resetTime * 1000);
          console.error(`Rate limit resets at: ${resetDate.toISOString()}`);
        }
        process.exit(1);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If no data returned, we've reached the end
      if (data.length === 0) {
        console.log(`Fetched all repositories (${allRepos.length} total)`);
        break;
      }
      
      allRepos = allRepos.concat(data);
      console.log(`  - Retrieved ${data.length} repositories`);
      
      page++;
    } catch (error) {
      console.error(`Error fetching repositories: ${error.message}`);
      process.exit(1);
    }
  }
  
  return allRepos;
}

/**
 * Transform repository data into the desired format
 */
function transformRepoData(repos) {
  return repos.map(r => ({
    name: r.name,
    url: r.html_url,
    description: r.description,
    language: r.language,
    created: r.created_at,
    updated: r.updated_at,
    stars: r.stargazers_count,
    forks: r.forks_count,
    // Optional fields
    topics: r.topics || [],
    homepage: r.homepage || null,
    // Additional useful fields
    isPrivate: r.private,
    isFork: r.fork,
    openIssues: r.open_issues_count,
    size: r.size,
    defaultBranch: r.default_branch,
    license: r.license ? r.license.name : null
  }));
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(50));
  console.log('GitHub Repository Data Fetcher');
  console.log('='.repeat(50));
  
  try {
    // Fetch all repositories
    const repos = await fetchAllRepos(username);
    
    // Transform the data
    console.log('\nTransforming repository data...');
    const transformedData = transformRepoData(repos);
    
    // Save to JSON file
    console.log(`\nSaving data to ${outputFile}...`);
    fs.writeFileSync(outputFile, JSON.stringify(transformedData, null, 2));
    
    console.log('\n' + '='.repeat(50));
    console.log(`✓ Successfully fetched ${transformedData.length} repositories`);
    console.log(`✓ Data saved to: ${outputFile}`);
    console.log('='.repeat(50));
    
    // Print summary statistics
    console.log('\nSummary:');
    console.log(`  Total repositories: ${transformedData.length}`);
    console.log(`  Total stars: ${transformedData.reduce((sum, r) => sum + r.stars, 0)}`);
    console.log(`  Total forks: ${transformedData.reduce((sum, r) => sum + r.forks, 0)}`);
    
    const languages = {};
    transformedData.forEach(r => {
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1;
      }
    });
    console.log(`  Languages: ${Object.keys(languages).join(', ')}`);
    
    // Output to console as well
    console.log('\n' + '='.repeat(50));
    console.log('JSON Output:');
    console.log('='.repeat(50));
    console.log(JSON.stringify(transformedData, null, 2));
    
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
