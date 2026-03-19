# CCM Website Payload Repo

## Purpose

This repository contains the official CCM nonprofit website, built with Payload CMS and Next.js.

It includes:

1. Frontend pages and multilingual routes.
2. Payload content models (Globals, Collections, Media).
3. Cloudflare deployment setup (D1, R2, Workers).

## Goals

This repository supports long-term website operations and iterative development. The goals are to:

1. Enable staff to manage content safely in the admin panel.
2. Keep frontend rendering aligned with CMS data structures.
3. Reduce maintenance and collaboration costs through consistent code standards.

## Tech Stack

Payload CMS, Next.js, React, TypeScript, Tailwind CSS, Cloudflare Workers, D1, and R2.

## Local Development

1. Install dependencies: `pnpm install`
2. Start development server: `pnpm dev`
3. Regenerate types after schema changes: `pnpm run generate:types`

## License

1. Code: MIT License, see [LICENSE](./LICENSE)
2. Website content and brand assets: All Rights Reserved, see [CONTENT-LICENSE.md](./CONTENT-LICENSE.md)

Note: MIT applies to source code only. It does not apply to text, images, videos, logos, branding, or design assets.
