# Rep

Mobile-first gym logging and progression tracker.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill the deployment-specific values:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are intentional for browser-side Supabase reads/writes. Plain `SUPABASE_URL` is only visible to server code; the current app is mobile/client-first. Do not expose a service-role key with `NEXT_PUBLIC_`.

Keep this Supabase/Clerk project separate from Mission Control.

## Cloudflare

Use the deploy command:

```bash
npm run deploy
```

Do not set the Cloudflare deploy command to `npx wrangler deploy`; that triggers Wrangler's Next.js auto-migration flow. This repo already has the OpenNext Cloudflare config committed.
