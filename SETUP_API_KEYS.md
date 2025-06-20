# 🔐 API Keys Setup Guide

## Important Security Notice
**NEVER commit API keys to version control!** This project uses a secure API key management system.

## Setup Instructions

### 1. Copy the Template File
```bash
cp constants/ApiKeys.template.ts constants/ApiKeys.ts
```

### 2. Add Your API Keys
Open `constants/ApiKeys.ts` and replace the placeholder values with your real API keys:

```typescript
export const OPENAI_API_KEY = 'sk-proj-your-actual-openai-key-here';

export const API_KEYS = {
  OPENAI: OPENAI_API_KEY,
  // Add other keys as needed
};
```

### 3. Required API Keys

#### OpenAI API Key
- **Purpose**: Powers the AI financial assistant chatbot
- **Get it from**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use (approximately $0.002 per 1K tokens)
- **Variable**: `OPENAI_API_KEY`

## Security Best Practices

✅ **DO:**
- Keep your API keys in `constants/ApiKeys.ts` (already in .gitignore)
- Use environment variables in production
- Rotate your keys regularly
- Monitor your API usage and billing

❌ **DON'T:**
- Commit API keys to git
- Share your keys in chat/email
- Use production keys in development
- Hard-code keys in your app code

## Production Deployment

For production apps, consider:
- Using environment variables
- Server-side proxy for API calls
- API key rotation strategy
- Rate limiting and usage monitoring

## Troubleshooting

### "API Key not found" error
1. Ensure `constants/ApiKeys.ts` exists
2. Check that your API key is valid
3. Verify the import path in your components

### Build errors
1. Make sure you copied the template file correctly
2. Check for syntax errors in ApiKeys.ts
3. Ensure all required keys are defined

## File Structure
```
constants/
├── ApiKeys.ts          # Your actual keys (gitignored)
├── ApiKeys.template.ts # Template for new developers
└── Colors.ts          # Other constants
``` 