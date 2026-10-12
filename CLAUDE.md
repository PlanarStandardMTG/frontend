# CLAUDE.md

The Planar Standard event manager's UI, a Vite + React SPA. The design and the backlog live in the
API repo (`../backend/event-manager-plan.md`, `../backend/backlog.md`); UI stories are the ones marked
`ui` there, and their markers flip in that repo.

- No business logic here: pairing, standings and permissions are the API's.
- The API's base URL comes from `VITE_API_URL` (`src/api.ts`).
- `legacy` is the old site. Nothing on `main` imports from it.

```bash
pnpm install
pnpm dev
pnpm lint && pnpm build
```
