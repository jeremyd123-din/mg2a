# MG2A website

Next.js, Sanity Studio and Tailwind CSS, customized for M Gingerich Gereaux & Associates.

- `npm run dev` — local website and embedded Studio at `/studio`
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run check:mg2a` — schemas, rendering contracts, styling isolation and form checks
- `npm run seed:mg2a` — create missing MG2A records without overwriting existing edits
- `/blocks` — preview the MG2A section library

Copy `.env.example` to `.env.local` and configure the existing Sanity project/dataset and server-side tokens. Never commit credentials.

See [the editor and development handoff](docs/mg2a-homepage-handoff.md) for section padding, scoped CSS, page CSS, preview, publishing, and outstanding client information.
