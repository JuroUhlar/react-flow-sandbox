
# Sandbox for prototyping stuff with [React Flow ](https://reactflow.dev/)

## Demo 

https://react-flow-sandbox.pages.dev/

## Files to pay attention to

- [`src/components/RulesTab.tsx`](src/components/RulesTab.tsx) 
- [`src/components/RulesCanvas.tsx`](src/components/RulesCanvas.tsx) 
- [`src/components/RuleForm.tsx`](src/components/RuleForm.tsx) 

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Deployment to Cloudflare Pages

### Manual Deployment

Deploy to Cloudflare Pages (builds and deploys in one command):
```bash
pnpm deploy
```

Or build and deploy separately:
```bash
pnpm build
wrangler pages deploy dist
```

### Automatic Deployment via GitHub Actions

The project includes a GitHub Actions workflow that automatically deploys to Cloudflare Pages on pushes to `main`.

**Setup required:**

1. Get your Cloudflare API token:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - Create a token with `Cloudflare Pages:Edit` permissions

2. Get your Cloudflare Account ID:
   - Found in the Cloudflare Dashboard URL or in the right sidebar

3. Add secrets to your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` with your API token
   - Add `CLOUDFLARE_ACCOUNT_ID` with your account ID

4. Push to `main` branch to trigger automatic deployment

### Local Testing

Test the production build locally:
```bash
pnpm build
pnpm pages:dev
```

