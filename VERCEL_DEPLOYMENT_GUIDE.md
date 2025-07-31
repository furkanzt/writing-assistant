# 🚀 Vercel Deployment Guide for AI Features

## Overview
This guide will help you get your AI writing assistant working on Vercel with GitHub AI models.

## ✅ Prerequisites
- Your project is already deployed to Vercel
- You have a GitHub Personal Access Token (PAT)
- Your project uses GitHub AI models

## 🔧 Step-by-Step Setup

### 1. Add Environment Variables to Vercel

**Method 1: Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project (`ai-writing-assistant`)
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
github_token=your_github_pat_token_here
openai_base_url=https://models.github.ai/inference
openai_model=openai/gpt-4o-mini
```

**Method 2: Vercel CLI**
```bash
vercel env add github_token
vercel env add openai_base_url
vercel env add openai_model
```

### 2. Redeploy Your Project

After adding environment variables, redeploy:
```bash
git push origin main
```

Or trigger a manual redeploy from the Vercel dashboard.

### 3. Verify AI Features

Test your AI features by:
1. Visiting your Vercel deployment URL
2. Submitting an essay for analysis
3. Checking if the AI feedback is generated

## 🔍 Troubleshooting

### Common Issues:

**1. "Failed to analyze essay" error**
- Check if `github_token` is set correctly
- Verify your GitHub PAT has the necessary permissions
- Ensure the token hasn't expired

**2. "Environment variables not found"**
- Make sure you added the variables to the correct environment (Production/Preview/Development)
- Redeploy after adding environment variables
- Verify variable names use lowercase letters, digits, dashes, and underscores only

**3. API routes returning 500 errors**
- Check Vercel function logs in the dashboard
- Verify your API routes are properly configured

### Debug Steps:
1. Check Vercel function logs in the dashboard
2. Test locally with the same environment variables
3. Verify your GitHub PAT is valid and has the right permissions

## 🧪 Testing

Use the provided test script:
```bash
node test-ai-features.js
```

## 📝 Important Notes

- **GitHub PAT**: Make sure your Personal Access Token has the necessary permissions for GitHub AI models
- **Environment Variables**: Use lowercase letters, digits, dashes, and underscores only
- **Redeployment**: Always redeploy after adding environment variables
- **Rate Limits**: Be aware of GitHub AI API rate limits

## 🔗 Useful Links

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub AI Models](https://github.com/features/ai)

## ✅ Success Checklist

- [ ] Environment variables added to Vercel
- [ ] Project redeployed
- [ ] AI features tested and working
- [ ] No errors in Vercel function logs
- [ ] Essay analysis generates feedback
- [ ] Chat feedback feature works 