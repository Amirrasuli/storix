# Storix — Project Setup

**Document:** Project Setup  
**Version:** 1.0  
**Status:** Complete — Ready for Review  
**Phase:** 5 — Project Setup  
**Started:** 2026-11-12  
**Completed:** 2026-11-12  
**Primary References:** `docs/FRONTEND_ARCHITECTURE.md`, `docs/PRD.md`, `docs/BUSINESS_RULES_AND_DATA_MODEL.md`, `docs/UI_UX_SPECIFICATION.md`

---

## 1. Purpose

This document records the Phase 5 implementation setup for Storix. It does not change approved product scope, business rules, or architecture. The approved documents remain the source of truth.

Phase 5 covers:

- Next.js project initialization.
- Approved dependency installation.
- Persian language and RTL configuration.
- Architecture folder scaffolding.
- Development tool configuration.
- TypeScript, test, and production-build verification.

Product features, dashboard content, inventory workflows, and persistence implementation are deliberately excluded and begin in later phases.

## 2. Environment

| Item | Value |
|---|---|
| Operating system | Windows (`win32`) |
| Node.js | `v26.12.0` |
| npm | `12.2.2` |
| Package manager | npm with committed `package-lock.json` |
| Application language | Persian (`fa`) |
| Text direction | Right-to-left (`rtl`) |
| Locale | `fa-IR` |
| Currency | Integer toman; displayed as `تومان`; identifier `IRT` |

## 3. Setup Decisions

| Concern | Decision | Notes |
|---|---|---|
| Framework | Next.js App Router | Initialized with the `src/` directory and `@/*` alias. |
| Language | TypeScript `strict: true` | No implicit `any`; project-wide typecheck script. |
| Styling | Tailwind CSS v4 | CSS-first configuration through `@import "tailwindcss"` and `@theme inline`. |
| UI primitives | shadcn/ui with Radix UI | `components.json` sets `rtl: true`. Components are copied into `src/components/ui/` and remain project-owned. |
| Icons | `lucide-react` | Directional icons must be reviewed in RTL layouts. |
| Client state | Zustand | Provider-scoped store factory in a later phase; no module-level singleton. |
| Forms | React Hook Form | Form state stays outside the persisted inventory snapshot. |
| Validation | Zod 4 and `@hookform/resolvers` | Shared runtime schemas in later phases. |
| Charts | Recharts | Read-only Sales Analytics charts in a later phase. |
| Theme | `next-themes` plus CSS variables | Light, Dark, and System preferences. |
| Unit tests | Vitest + React Testing Library | Domain and component behavior. |
| End-to-end tests | Playwright | Chromium smoke test for the application shell. |
| Persian font | Vazirmatn | Self-hosted through `@fontsource-variable/vazirmatn`, imported in `src/app/globals.css`; production builds do not depend on a font CDN. |
| Persian date picker | `@daypicker/react` + `@daypicker/persian` `10.0.2` | Provides the Persian calendar integration for the shadcn/ui Calendar wrapper in the UI phase. The legacy `react-day-picker` v10 package does not ship the Persian entry used by this setup. |

### 3.1. Installed Versions

Exact versions resolved by `package-lock.json` at the end of Phase 5:

| Package | Version |
|---|---|
| Next.js | `16.4.6` |
| React / React DOM | `19.3.1` |
| TypeScript | `5.9.3` |
| Tailwind CSS / `@tailwindcss/turbopack` | `4.3.5` |
| shadcn CLI (dev dependency) | `4.23.0` |
| Radix UI (`radix-ui`) | `1.8.1` |
| Zustand | `5.1.0` |
| React Hook Form | `7.92.0` |
| Zod | `4.6.7` |
| `@hookform/resolvers` | `7.0.6` |
| Recharts | `3.10.1` |
| `next-themes` | `0.4.6` |
| `lucide-react` | `1.72.0` |
| `@daypicker/react` / `@daypicker/persian` | `10.0.2` |
| `@fontsource-variable/vazirmatn` | `5.3.0` |
| Vitest | `5.1.0` |
| React Testing Library | `16.3.3` |
| Playwright | `1.65.0` |
| ESLint / `eslint-config-next` | `9.39.5` / `16.4.6` |
| jsdom | `31.0.0` |

### 3.2. Dependencies deliberately excluded

- Backend framework, API routes, Server Actions, or server database.
- Authentication, roles, or user accounts.
- TanStack Query, SWR, or Axios.
- Prisma, Drizzle, or another ORM.
- A second global state library.
- A multi-locale internationalization framework.
- Zustand persistence middleware.

## 4. Folder Structure

The setup follows the approved feature-oriented structure. Empty directories contain `.gitkeep` placeholders until their first real file is needed.

```text
src/
├── app/
│   ├── (workspace)/
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
├── features/
│   ├── dashboard/
│   ├── sales-analytics/
│   ├── products/
│   ├── categories/
│   ├── suppliers/
│   ├── purchase-invoices/
│   ├── stock-out/
│   ├── transactions/
│   └── settings/
├── domain/
│   ├── entities/
│   ├── rules/
│   ├── calculations/
│   ├── schemas/
│   └── errors/
├── application/
│   ├── commands/
│   ├── queries/
│   └── ports/
├── infrastructure/
│   └── storage/
│       └── migrations/
├── store/
│   └── selectors/
├── lib/
│   ├── formatting/
│   ├── dates/
│   └── utils/
└── test/
    ├── fixtures/
    └── helpers/
```

## 5. Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create the production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm test` | Run Vitest once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run test:e2e` | Run Playwright end-to-end tests. |
| `npm run check` | Run lint, typecheck, and unit tests. |

## 6. RTL and Persian Checklist

- [x] Root document renders `<html lang="fa" dir="rtl">`.
- [x] Radix `DirectionProvider` supplies `direction="rtl"`.
- [x] Vazirmatn is applied as the default Persian font.
- [x] Metadata and placeholder page copy are Persian.
- [x] Shared money and quantity formatting uses `fa-IR`.
- [x] Date display uses the Persian calendar while stored dates remain Gregorian ISO date-only values.
- [x] Numeric input normalization converts Persian and Arabic-Indic digits to ASCII before validation. The shared utility is implemented and tested; form controls will consume it in Phase 6.
- [x] Layout uses logical CSS properties where direction matters.
- [x] shadcn/ui configuration has `rtl: true`.
- [x] Mixed Persian/Latin values are isolated with `dir="ltr"` or `<bdi>` where needed.

## 7. Verification Log

Final verification was rerun on 2026-11-12 against the committed Phase 5 tree. A full-page screenshot of the production build was captured during browser inspection and stored outside the repository to avoid adding a binary artifact.

| Check | Command | Result |
|---|---|---|
| Dependency installation | `npm install` | Pass — dependencies resolved and `package-lock.json` updated. |
| ESLint | `npm run lint` | Pass — no errors or warnings. |
| TypeScript | `npm run typecheck` | Pass — `next typegen` and `tsc --noEmit` completed without errors. |
| Unit and component tests | `npm test` | Pass — 5 test files, 20 tests. |
| Combined check | `npm run check` | Pass — lint, typecheck, and unit tests. |
| Production build | `npm run build` | Pass — Next.js `16.4.6`; `/` and `/_not-found` are static. |
| Production server smoke test | `npm run start -- -p 3100` | Pass — application served successfully on `localhost:3100`. |
| Playwright smoke test | `npm run test:e2e` | Pass — Chromium test passed against both the development and production servers. |
| RTL and Persian browser check | Browser inspection | Pass — `lang="fa"`, `dir="rtl"`, Vazirmatn computed on `<body>`, Persian formatting rendered, and no console errors. |
| Production dependency audit | `npm audit --omit=dev` | Pass — 0 vulnerabilities in production dependencies. |

### 7.1. Development Dependency Advisories

`npm audit` reports 12 advisories in development-only tooling: 2 low and 10 moderate. They are inherited from the latest `shadcn` CLI (`deepmerge`, `ts-morph`, and `minimatch`) and `typescript-eslint` (`minimatch`). They are not included in the production dependency graph or the client bundle.

The installed `shadcn` and `typescript-eslint` versions are already the latest releases. npm's proposed fix is a breaking downgrade of `shadcn` to `1.0.0`, which is not acceptable for this setup. A final `npm audit fix --dry-run` reported `up to date` and proposed no non-breaking changes. `npm audit fix --force` was not used. No safe non-breaking fix is currently available; the advisories will be revisited when upstream packages update their dependencies.

## 8. Boundaries for the Next Phase

Phase 6 may begin only after this setup is reviewed and approved. It will implement the approved core inventory workflows on top of this foundation. The setup itself does not implement:

- Dashboard KPIs or sales charts.
- Product, category, supplier, invoice, Stock OUT, transaction, or settings pages.
- Zustand store creation.
- LocalStorage repository, schema, or migrations.
- Business calculations such as MWAC.
