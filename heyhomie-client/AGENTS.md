<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-23 | Updated: 2026-03-23 -->

# heyhomie-client (Customer Frontend)

## Purpose
Next.js 10 customer-facing frontend built with React 17 and Redux. Handles the booking flow for cleaning, flowers, massage, and nail services; user account management (addresses, payment methods, subscriptions); and service landing pages. Communicates with the Rails API at `http://localhost:3001`.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies and scripts |
| `next.config.js` | Next.js configuration |
| `pages/_app.js` | App wrapper with Redux store and global providers |
| `pages/index.js` | Home page |
| `lib/store.js` | Redux store configuration |
| `styles/` | Global CSS styles |
| `messages/` | i18n/localization message files |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `pages/` | Next.js file-based routes — each file is a page |
| `pages/account/` | My account section (profile, orders, subscriptions) |
| `components/` | Reusable React components |
| `components/ui/` | Generic UI components (buttons, inputs, etc.) |
| `components/citypage/` | City-specific service listing components |
| `components/myaccount/` | Account management components (addresses, payment, settings, subscriptions) |
| `components/serviceLanding/` | Service landing pages (cleaning, flowers, massage) |
| `components/utilpages/` | Utility pages — footer, nav, privacy, terms |
| `api/endpoints/` | API call definitions |
| `hooks/` | Custom React hooks |
| `lib/slices/` | Redux Toolkit slices for state management |
| `public/` | Static assets (icons, images) |

## For AI Agents

### Working In This Directory
```bash
# Development server (port 3006)
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

### Key Patterns
- **Next.js 10** — uses `pages/` directory (not App Router which came in Next.js 13+)
- **Redux** for global state management via `lib/slices/`
- **API calls** defined in `api/endpoints/` — do not call Rails API directly in components
- State management uses Redux Toolkit patterns

### Testing Requirements
- Run `npm run lint` before committing
- No dedicated test runner configured — check `package.json` scripts for current test setup

## Dependencies

### Internal
- Rails API at `http://localhost:3001` for all data

### External
- React 17
- Next.js 10.0.5
- Redux / Redux Toolkit
- Stripe (payment elements in checkout flow)

<!-- MANUAL: -->
