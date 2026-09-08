# INNOVXATHON 2026 - Build & Deployment Guide

This guide describes how to install dependencies, run automated tests, build for production, and deploy the INNOVXATHON 2026 website.

---

## 1. Prerequisites

- **Node.js:** Node.js v20.x or v22.x+
- **Package Manager:** `pnpm` (or `npm`)

---

## 2. Local Development

```bash
# Install dependencies
pnpm install

# Start local dev server (default: http://localhost:3000)
pnpm dev
```

---

## 3. Running Automated Tests & Type Checking

```bash
# Run unit tests (prize totals, weights, chronological validation)
pnpm test

# Run TypeScript compiler check
npx tsc --noEmit

# Run Oxlint
pnpm lint
```

---

## 4. Production Build

```bash
# Build the optimized production bundle
pnpm build
```

---

## 5. Deployment Options

### Option A: Cloudflare Workers / Pages
The repository is pre-configured with `@cloudflare/vite-plugin` and `wrangler`.
```bash
# Run local preview with Miniflare / Wrangler
pnpm start

# Deploy to Cloudflare Workers
npx wrangler deploy
```

### Option B: Netlify / Vercel
1. Link your Git repository to Netlify or Vercel.
2. Build Command: `pnpm build`
3. Output Directory: `dist/client` or `.next` (handled automatically by the Vite/Vinext builder).
4. Node Version: `>= 20.0.0`
