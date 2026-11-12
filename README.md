# Storix — Inventory Management & Sales Analytics

Storix is a general-purpose, frontend-focused web application. It combines inventory management with read-only sales analytics.

The MVP supports one warehouse and one local user context. It has no backend, server database, authentication, or external business integrations. Editable inventory data is stored in the browser with LocalStorage. Sales Analytics uses static mock data.

## Product Scope

### Included in the MVP

| Module | Description |
|---|---|
| Dashboard | Inventory summary, stock status, estimated inventory value, recent inventory transactions, and selected sales indicators. |
| Sales Analytics | Read-only sales quantity, revenue, Gross Profit, Gross Margin, charts, and product comparisons using simulated data. |
| Products | Product catalog, SKU, package description, current selling price, minimum stock threshold, categories, and supplier links. |
| Categories | Product categorization with many-to-many relationships. |
| Suppliers | Supplier records and product-supplier relationships. |
| Purchase Invoices | Basic supplier invoice capture. Each invoice line creates one Stock IN transaction. |
| Stock OUT | Non-sale stock removal with a required reason. |
| Inventory Transactions | Immutable history of opening stock, invoice-based Stock IN, and Stock OUT. |
| Settings | Basic local display preferences. |

### Excluded from the MVP

- Backend development and server database integration.
- Authentication, multiple accounts, and user roles.
- Multi-warehouse management.
- Purchase orders and supplier payment management.
- Customer management, sales orders, real sales entry, sales invoices, and payment processing.
- Invoice-level discount, tax, shipping, or other charge allocation.
- Editing, deleting, voiding, or reversing posted purchase invoices.
- Editing, deleting, undoing, adjusting, or reversing posted inventory transactions.
- Barcode scanning, unit conversion, lot/batch/serial tracking, and expiry management.
- Advanced analytics, notifications, and report exports.

## Key Business Rules

- Each Product has a unique SKU.
- A Product can belong to multiple Categories and can be supplied by multiple Suppliers.
- Stock quantity counts whole items or packages. Package descriptions do not convert units.
- All money values are stored as integer toman amounts and displayed as تومان. The app does not convert toman to rial.
- Selling price `0` means Free. `null` means Not set.
- Minimum stock defaults to `0` and can be configured per Product.
- Incoming stock is recorded only by posting a Purchase Invoice. Every invoice line creates exactly one Stock IN transaction.
- Positive opening stock requires a known unit acquisition cost.
- Inventory valuation uses Moving Weighted Average Cost (MWAC).
- Stock OUT requires one of `DAMAGE`, `INTERNAL_USE`, or `OTHER`. `OTHER` requires a note. Stock OUT is not a sale.
- Posted invoices and inventory transactions are immutable in the MVP.
- Sales Analytics uses mock data only. Gross Profit and Gross Margin are simulated metrics.

See the Business Rules document for the full definitions, formulas, validations, and acceptance scenarios.

## Documentation

| Document | Purpose |
|---|---|
| [Product Requirements Document](docs/PRD.md) | Product scope, functional requirements, non-functional requirements, and MVP acceptance criteria. |
| [Business Rules & Data Model](docs/BUSINESS_RULES_AND_DATA_MODEL.md) | Approved business rules, data relationships, calculations, validation, and domain types. |
| [UI/UX Specification](docs/UI_UX_SPECIFICATION.md) | Navigation, page requirements, forms, interaction behavior, and UI acceptance criteria. |
| [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md) | Approved stack, routing, state, persistence, folder structure, and testing strategy. |
| [Project Setup](docs/PROJECT_SETUP.md) | Phase 5 setup decisions, commands, folder structure, and verification evidence. |
| [Approved Product Decisions](docs/OPEN_DECISIONS_REVIEW.md) | Record of product-owner decisions D-01 through D-09. |

## Approved Technology Stack

| Concern | Choice |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript with `strict: true` |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui with Radix UI, configured for RTL |
| Icons | `lucide-react` |
| Client state | Zustand, provider-scoped |
| Forms | React Hook Form |
| Validation | Zod 4 with `@hookform/resolvers` |
| Charts | Recharts |
| Theme | `next-themes` with CSS variables |
| Unit and component tests | Vitest with React Testing Library |
| End-to-end tests | Playwright |
| Package manager | npm |

The MVP has no backend, server database, authentication, remote-data caching layer, or multi-language framework. Editable inventory data will use one versioned LocalStorage snapshot.

Phase 5 also self-hosts the Vazirmatn font through `@fontsource-variable/vazirmatn` and uses `@daypicker/react` with `@daypicker/persian` for Persian calendar input. Exact versions and setup evidence are recorded in [Project Setup](docs/PROJECT_SETUP.md).

## Project Roadmap

| Phase | Title | Status |
|---|---|---|
| Phase 0 | Product Discovery | Completed |
| Phase 1 | Product Requirements & Scope | Completed |
| Phase 2 | Business Rules & Data Model | Completed |
| Phase 3 | UI/UX Specification | Completed |
| Phase 4 | Frontend Architecture | Completed |
| Phase 5 | Project Setup | Complete — Ready for Review |
| Phase 6 | Core Inventory Workflows | Pending |
| Phase 7 | Dashboard & Sales Analytics | Pending |
| Phase 8 | Testing & Optimization | Pending |
| Phase 9 | Release | Pending |

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

`npm run test:e2e` requires the Playwright Chromium browser. Install it once with:

```bash
npx playwright install chromium
```

## Project Status

**Current status:** Phase 5 — Project Setup complete, ready for review.

The application shell is scaffolded with Persian language, RTL direction, the approved dependencies, and the layered folder structure. ESLint, TypeScript, 20 unit/component tests, the production build, and the Playwright smoke test pass. Production dependencies report no audit vulnerabilities. Product features and dashboard pages begin in Phase 6 after setup review and approval.

## License

This project is intended for educational and portfolio purposes.
