# GitHub Repository Data Fetcher

A Node.js script to fetch public repository data from GitHub and format it for easy integration into portfolio sites or databases like Supabase.

## Features

- ✅ Fetches all public repositories for a GitHub user
- ✅ Handles pagination automatically (up to 100 repos per page)
- ✅ Extracts comprehensive repository data including:
  - Basic info: name, URL, description, language
  - Dates: created_at, updated_at
  - Metrics: stars, forks, open issues
  - Additional: topics, homepage, license, etc.
- ✅ Outputs data as formatted JSON
- ✅ Saves to file for easy import into databases
- ✅ Supports GitHub Personal Access Token for higher rate limits
- ✅ Provides summary statistics

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage

Fetch repositories for the default user (Vijayapardhu):
```bash
npm run fetch
```

Or directly:
```bash
node fetch-repos.js
```

### With Custom Username

```bash
GITHUB_USERNAME=your-username node fetch-repos.js
```

### With Authentication Token (Recommended)

To avoid GitHub API rate limits, use a Personal Access Token:

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `public_repo` scope
   - Copy the token

2. Run the script with the token:
```bash
GITHUB_TOKEN=your_token_here node fetch-repos.js
```

Or create a `.env` file (not committed to git):
```
GITHUB_TOKEN=your_token_here
GITHUB_USERNAME=Vijayapardhu
```

## Output

The script generates:

1. **Console Output**: Summary statistics and full JSON data
2. **File Output**: `repos-data.json` - Ready for database import

### Output Format

```json
[
  {
    "name": "repository-name",
    "url": "https://github.com/username/repository-name",
    "description": "Repository description",
    "language": "JavaScript",
    "created": "2023-01-01T00:00:00Z",
    "updated": "2024-01-01T00:00:00Z",
    "stars": 42,
    "forks": 7,
    "topics": ["topic1", "topic2"],
    "homepage": "https://example.com",
    "isPrivate": false,
    "isFork": false,
    "openIssues": 3,
    "size": 1234,
    "defaultBranch": "main",
    "license": "MIT"
  }
]
```

## Importing to Supabase

To import the generated JSON into Supabase:

1. Create a table in Supabase with matching columns:
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  language TEXT,
  created TIMESTAMP,
  updated TIMESTAMP,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  topics TEXT[],
  homepage TEXT,
  is_private BOOLEAN DEFAULT false,
  is_fork BOOLEAN DEFAULT false,
  open_issues INTEGER DEFAULT 0,
  size INTEGER DEFAULT 0,
  default_branch TEXT,
  license TEXT
);
```

2. Use Supabase's data import feature or insert via API:
```javascript
const { data, error } = await supabase
  .from('projects')
  .insert(reposData);
```

## Rate Limits

- **Without authentication**: 60 requests per hour
- **With authentication**: 5,000 requests per hour

For most users, unauthenticated requests are sufficient unless you have hundreds of repositories.

## Troubleshooting

### Rate Limit Exceeded
If you see `Rate limit exceeded`, wait for the reset time or use a GitHub Personal Access Token.

### No repositories found
Check that the username is correct and has public repositories.

## License

MIT License - Feel free to use this script for your own portfolio projects!
