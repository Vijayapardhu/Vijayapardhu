# Quick Start Guide

## Installation & Usage

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Script

**Basic usage (default user: Vijayapardhu):**
```bash
npm run fetch
```

**With authentication (recommended to avoid rate limits):**
```bash
GITHUB_TOKEN=your_token_here npm run fetch
```

**For a different user:**
```bash
GITHUB_USERNAME=other-user npm run fetch
```

### 3. Output

The script creates `repos-data.json` containing all repository data in JSON format, ready for import into Supabase or other databases.

## What the Script Does

1. ✅ Fetches ALL public repositories from GitHub
2. ✅ Handles pagination automatically
3. ✅ Extracts comprehensive data (name, URL, description, language, dates, metrics)
4. ✅ Includes optional fields (topics, homepage, license)
5. ✅ Saves to JSON file
6. ✅ Displays summary statistics

## Example Output Structure

```json
[
  {
    "name": "repo-name",
    "url": "https://github.com/username/repo-name",
    "description": "Repository description",
    "language": "JavaScript",
    "created": "2024-01-01T00:00:00Z",
    "updated": "2024-11-01T00:00:00Z",
    "stars": 10,
    "forks": 2,
    "topics": ["topic1", "topic2"],
    "homepage": "https://example.com",
    "isPrivate": false,
    "isFork": false,
    "openIssues": 1,
    "size": 1234,
    "defaultBranch": "main",
    "license": "MIT"
  }
]
```

## Troubleshooting

**"Rate limit exceeded"**
- Use a GitHub Personal Access Token
- Wait for the rate limit to reset

**"No repositories found"**
- Check the username is correct
- Ensure the user has public repositories

## For More Details

- See `FETCH-REPOS-README.md` for full documentation
- See `SECURITY-SUMMARY.md` for security information
- See `repos-data.example.json` for sample output
