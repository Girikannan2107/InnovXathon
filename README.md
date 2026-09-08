# InnovXathon 2026

Full source project for the INNOVXERA college ideathon website, including original and cropped logos, responsive styling, and the reversible star-particle registration animation.

## Run locally

Requirements: Node.js 22.13.0 or newer and pnpm (the project was installed with pnpm 11.19.0).

Open a terminal in this folder and run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by the development server.

## Build

```sh
pnpm build
pnpm start
```

The project uses React, TypeScript, Vinext, Tailwind CSS, and Cloudflare Workers tooling. `pnpm start` serves the generated Worker locally through Wrangler. Hosting on another platform may require adapting its deployment configuration.

## Main files

- `app/page.tsx`: event content, sections, organizer and sponsors.
- `app/particle-register.tsx`: scroll-driven Register button formation and dissolution.
- `app/globals.css`: styling and responsive layouts.
- `app/layout.tsx`: page metadata.
- `public/brands/`: supplied logos and cropped versions.
- `vite.config.ts` and `next.config.ts`: framework configuration.
- `.openai/hosting.json`: existing Sites project association (not a credential).

## Registration and event details

The official Google Form URL has not yet been supplied. The Register button currently displays a notice. Update its action in `app/page.tsx` once the URL is available.

The detailed closing time, payment method/deadline and final screening procedure still require organizer confirmation. Content follows the supplied revised concept proposal: InnovXathon 2026, 16 October 2026, 9:00 AM, teams of four, up to 30 shortlisted teams, and proposed awards of INR 25,000 / 15,000 / 10,000.

## Package contents

Source code, dependency manifests and lockfile, configuration, and all website assets are included. Installed packages, Git history, local caches, build output and credentials are excluded. Install dependencies and build using the commands above.
