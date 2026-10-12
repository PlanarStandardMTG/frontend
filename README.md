# Planar Standard Events — UI

The event manager's front end: organizers run events, players register, report results and follow
pairings and standings. Signs in through [planarstandard.com](https://www.planarstandard.com).

- **The plan and backlog** live with the API: [PlanarStandardMTG/backend](https://github.com/PlanarStandardMTG/backend)
  (`event-manager-plan.md`, `backlog.md`)
- **The old site:** the [`legacy`](https://github.com/PlanarStandardMTG/frontend/tree/legacy) branch

## Today

A placeholder page that checks the API's health. A push to `main` deploys to Vercel.

```bash
pnpm install
cp .env.example .env.local   # VITE_API_URL
pnpm dev                     # http://localhost:5173
pnpm lint && pnpm build
```
