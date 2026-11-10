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
| [Approved Product Decisions](docs/OPEN_DECISIONS_REVIEW.md) | Record of product-owner decisions D-01 through D-09. |

## Technology Direction

The current direction is Next.js and TypeScript. Final choices for routing, state management, forms, validation, styling, charts, and folder structure belong to the Frontend Architecture phase. Do not treat a library as selected until that phase confirms it.

## Project Roadmap

| Phase | Title | Status |
|---|---|---|
| Phase 0 | Product Discovery | Completed |
| Phase 1 | Product Requirements & Scope | Completed |
| Phase 2 | Business Rules & Data Model | Completed |
| Phase 3 | UI/UX Specification | Completed |
| Phase 4 | Frontend Architecture | Next |
| Phase 5 | Project Setup | Pending |
| Phase 6 | Core Inventory Workflows | Pending |
| Phase 7 | Dashboard & Sales Analytics | Pending |
| Phase 8 | Testing & Optimization | Pending |
| Phase 9 | Release | Pending |

## Getting Started

The application implementation has not started. After the Frontend Architecture and Project Setup phases, installation and run instructions will be added here.

## Project Status

**Current status:** Product documentation approved for Frontend Architecture.

The next phase is Frontend Architecture. Frontend implementation starts after the architecture decisions are complete.

## License

This project is intended for educational and portfolio purposes.
