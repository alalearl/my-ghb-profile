# Deploy to Vercel

## Prerequisites
- Create a Vercel account at https://vercel.com
- Install Vercel CLI (optional): `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for deployment"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect SvelteKit
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Project Configuration

The project is already configured for Vercel:
- ✅ `@sveltejs/adapter-vercel` installed
- ✅ `svelte.config.js` configured with Vercel adapter
- ✅ `vercel.json` with optimal settings
- ✅ Region set to Singapore (sin1) for Asia-Pacific performance
- ✅ Node.js 20.x runtime
- ✅ CORS headers configured for API routes

## Important Notes

### API Routes
All API routes in `/src/routes/api/` will work as Vercel serverless functions automatically.

### Environment Variables
If you need environment variables:
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables (they should start with `PUBLIC_` if you want them available in browser)

### Custom Domain
After deployment, you can add a custom domain in:
- Project Settings → Domains

### Current Setup
- **Framework**: SvelteKit
- **Package Manager**: pnpm
- **Node Version**: 20.x
- **Region**: Singapore (sin1)
- **API Proxy Routes**: 
  - `/api/loan-details`
  - `/api/generate-qr`

## Post-Deployment

After successful deployment:
1. Vercel will provide you with a URL (e.g., `your-project.vercel.app`)
2. Test all features:
   - Cookie authentication
   - Loan details page
   - QR code generation
3. Monitor logs in Vercel dashboard if there are any issues

## Troubleshooting

### Build Errors
- Check Vercel build logs in dashboard
- Ensure all dependencies are in `package.json`
- Node.js version issues are handled by Vercel automatically

### API Issues
- CORS headers are already configured in `vercel.json`
- Check Vercel function logs for server-side errors
- Verify external API endpoints (GH Bank API) are accessible

### Performance
- Vercel automatically optimizes static assets
- API routes run as serverless functions (no cold start optimization needed for this scale)
- Singapore region provides ~20-100ms latency for Thailand users

## Resources
- Vercel Documentation: https://vercel.com/docs
- SvelteKit Adapter: https://kit.svelte.dev/docs/adapter-vercel
- Vercel CLI: https://vercel.com/docs/cli
