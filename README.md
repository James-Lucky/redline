# Credline Delhi — UI Starter

A modular Next.js App Router dashboard scaffold inspired by the supplied references:
- dark charcoal interface
- restrained teal/orange accents
- overview metrics, trend chart, geographic preview, AI analyst and source transparency
- responsive layout
- explicit demo-data warnings

## Dependencies

From your existing `client` directory:

```bash
npm install lucide-react recharts
```

This scaffold assumes Tailwind CSS is already configured in the Next.js app. It does not add authentication, backend calls, real crime statistics, or Gemma API calls.

## Copy into your app

Copy the `app/` and `components/` folders into `client/`, merging rather than deleting your existing files.

If you already have a root layout, merge the metadata and body structure from `app/layout.tsx` instead of overwriting it.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Before production

1. Replace all illustrative values with verified, sourced data.
2. Replace the geographic preview with a real boundary layer only after compatible district-level data is verified.
3. Connect filters to actual data.
4. Add server-side Gemma integration. Never expose API keys in client-side code.
5. Add tests, loading/error states, and a proper export workflow.
