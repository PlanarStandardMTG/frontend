# Planar Standard Frontend - AI Coding Agent Instructions

## Project Overview
React + TypeScript frontend for a community-driven Magic: the Gathering format. Built with Vite, React Router, and Tailwind CSS. Authentication flows with a separate backend API.

## Architecture & Key Patterns

### Context & State Management
- **AuthContext Pattern**: Split across 3 files for separation of concerns:
  - `AuthContextProvider.ts` - exports context definition
  - `AuthContext.tsx` - exports provider component
  - `useAuth.ts` - exports custom hook with error boundary
  - Token stored in `localStorage` as `authToken`
  - Cross-tab sync via `storage` event listener in provider

### Routing & Protection
- Routing structure: `App.tsx` → `MainLayout` → page components
- Protected routes use `<ProtectedRoute>` wrapper that redirects to `/auth`
- Catch-all redirects to `/` via `<Route path="*">`
- Routes: `/` (Home), `/auth`, `/dashboard` (protected), `/rules`

### API Integration
- Base URL from `VITE_API_URL` environment variable, fallback to `http://localhost:3000`
- Defined in `src/types/Api.ts` as `API_BASE_URL`
- Auth endpoints documented in `README.md`:
  - `POST /api/auth/register` - email, password, username
  - `POST /api/auth/login` - returns token
  - `GET /api/users/me` - requires Bearer token in Authorization header

### Component Conventions
- **File naming**: PascalCase for components (`Header.tsx`, `BlindEternitiesBackground.tsx`)
- **Exports**: Named exports for components (`export function ComponentName()`)
- **Props typing**: Inline interfaces for simple cases, separate types for complex
- **Icons**: `react-icons` with `Fa` prefix (`FaSignInAlt`, `FaDiscord`)

### Styling Approach
- Tailwind utility-first with dark theme (`bg-gray-900`, `text-white` base)
- Gradient patterns: `from-gray-900 via-gray-800 to-gray-900` for headers
- Glass morphism cards: `bg-gray-900/75 backdrop-blur-md`
- Responsive: mobile-first with `sm:` and `md:` breakpoints
- Custom CSS in `src/styles/index.css` imports Tailwind and adds global button hover

### Development-Only Features
- Conditional rendering based on `import.meta.env.MODE === 'development'`
- Example: "Test User Info" button in Header, Dashboard link on Home page
- Always check mode before exposing dev-only routes/features

## Key Components & Their Purposes

**BlindEternitiesBackground**: Canvas-based animated starfield with mouse parallax. Performance-optimized star count based on viewport size. Uses refs for animation loop and mouse tracking.

**Header**: Responsive navigation with desktop/mobile variants. Desktop uses `DesktopButton` component, mobile uses collapsible menu with state toggle. Handles logout by clearing localStorage and resetting auth context.

**Authentication**: Dual-mode form (login/register) with state machine. Post-registration flow auto-switches to login mode after 2s delay. Token stored on successful login, triggers redirect to dashboard.

## Developer Workflows

### Build & Dev Commands
```bash
npm run dev       # Vite dev server with HMR
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint with flat config
npm run preview   # Preview production build locally
```

### Environment Setup
- Create `.env.local` with `VITE_API_URL=your_backend_url`
- Backend expected at `localhost:3000` by default

### Deployment (Vercel)
- `vercel.json` configured for SPA routing (all routes → `index.html`)
- Environment variable `VITE_API_URL` must be set in Vercel dashboard

## Common Pitfalls & Notes

- **Auth state sync**: Changes to localStorage in one tab won't update other tabs unless you use the storage event listener (already implemented in AuthProvider)
- **Protected routes**: Always wrap with `<ProtectedRoute>`, never just check `isLoggedIn` in component
- **API errors**: Backend responses include `message` field for errors - always display `data.message` if available
- **TypeScript refs**: Canvas and animation refs need proper null checks before use
- **Tailwind purging**: Component class names must be in `./src/**/*.{js,ts,jsx,tsx}` to be included

## File Organization
- `/pages` - route-level components
- `/components` - reusable UI components (subdirectories for related components like `Header/`)
- `/contexts` - React context providers and hooks
- `/layouts` - page wrapper components
- `/types` - TypeScript type definitions for API, domain models
- `/styles` - global CSS (minimal, Tailwind-based)

## When Adding Features
1. New protected routes: Wrap with `<ProtectedRoute>` in `App.tsx`
2. New components: Use named exports, TypeScript props interfaces
3. New global state: Follow the AuthContext pattern (provider/hook separation)
4. Forms: Always include loading states, error handling, success feedback

## When Creating .md Files
- Use clear headings and subheadings for structure
- Place them in .github/
