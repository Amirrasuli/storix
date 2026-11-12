# Storix — Frontend Architecture

**Document:** Frontend Architecture  
**Version:** 0.1  
**Status:** Draft for Review  
**Last Updated:** 2026-11-12  
**Primary References:** `docs/PRD.md`, `docs/BUSINESS_RULES_AND_DATA_MODEL.md`, `docs/UI_UX_SPECIFICATION.md`, `docs/OPEN_DECISIONS_REVIEW.md`

---

## 1. Purpose

This document defines the proposed frontend architecture for the Storix MVP.

It turns the approved product requirements, business rules, and UI/UX requirements into an implementation plan. It defines:

- The application structure and routing approach.
- The frontend technology choices.
- The separation between UI, application logic, domain rules, and browser storage.
- The state and persistence strategy.
- The form, validation, and error-handling strategy.
- The testing approach and architecture quality gates.

This document does not change product scope or business rules. The approved documents remain the source of truth for product behavior.

## 2. Architecture Goals

The architecture must:

1. Keep the MVP frontend-only.
2. Keep business rules independent from React components and browser APIs.
3. Preserve inventory history and data integrity.
4. Save each logical inventory operation as one complete data update.
5. Keep Sales Analytics separate from editable inventory data.
6. Make the application easy to test and maintain.
7. Avoid infrastructure that the MVP does not need.
8. Leave a clear path for a future data-source change without building a backend now.

## 3. Architecture Constraints

The following constraints are fixed by the approved product documents:

| Area | Constraint |
|---|---|
| Product | General-purpose inventory management with read-only sales analytics |
| Framework direction | Next.js and TypeScript |
| Router | Final choice is made in this architecture phase |
| User context | One local user; no authentication or roles |
| Warehouse | One warehouse |
| Backend | Not included |
| Server database | Not included |
| Editable data | Browser LocalStorage |
| Sales data | Static mock data; read-only |
| Currency | Store integer toman amounts; display `تومان`; application identifier is `IRT` |
| Quantity | Positive or non-negative whole-number quantities as defined by each operation; one countable item or package |
| Inventory source of truth | Immutable inventory transaction ledger |
| Stock IN | Created only by posting a Purchase Invoice or by the approved opening-stock flow |
| Stock OUT | Non-sale removal with an approved reason |
| Posted invoices and transactions | Immutable in the MVP |

Do not add APIs, a server database, authentication, real sales processing, customer management, purchase orders, supplier payments, or multiple warehouses.

## 4. Proposed Technology Stack

The following choices are recommendations for the MVP. Confirm them during the architecture review before Project Setup.

| Concern | Proposed choice | Reason |
|---|---|---|
| Framework | Next.js App Router | File-based routes and shared layouts fit the approved page structure. |
| Language | TypeScript with `strict: true` | Catch invalid data and unsafe assumptions during development. |
| Styling | Tailwind CSS v4 | Supports a custom, responsive interface without a large runtime UI layer. |
| UI primitives | shadcn/ui components, copied into the repository and adapted | Gives accessible building blocks while keeping the components under project control. |
| Icons | `lucide-react` | Consistent icon set for navigation and actions. |
| Global client state | Zustand | Holds the hydrated local application snapshot and exposes focused selectors/actions. |
| Forms | React Hook Form | Manages form state and field-level updates with low unnecessary re-rendering. |
| Validation | Zod 4 and `@hookform/resolvers` | Provides shared runtime schemas for forms and stored data. |
| Charts | Recharts | Covers the MVP's sales charts and product comparisons. |
| Theme | `next-themes` plus CSS variables | Supports Light, Dark, and System preferences. |
| Unit tests | Vitest | Tests domain rules, calculations, and storage behavior. |
| Component tests | React Testing Library | Tests visible user behavior rather than component internals. |
| End-to-end tests | Playwright | Tests complete inventory workflows in a browser. |
| Package manager | npm | Matches the current development workflow; commit `package-lock.json`. |

### 4.1. Dependencies Not Required for the MVP

Do not add these unless a clear requirement appears:

- TanStack Query or SWR: there is no remote data source to fetch or cache.
- Axios: there are no application API requests.
- Prisma, Drizzle, or an ORM: there is no server database.
- Authentication libraries: authentication is out of scope.
- A second global state library: Zustand is sufficient for the local application snapshot.
- A large all-in-one UI framework: use project-owned components and design tokens.

Do not pin package versions in this architecture document. During Project Setup, install compatible stable versions, check peer dependencies, and commit the lockfile.

## 5. Application Architecture

Use a layered, feature-oriented frontend architecture.

```text
Next.js Routes and Layouts
          |
          v
Feature UI Components and Hooks
          |
          v
Application Use Cases / Queries
          |
          v
Domain Types, Rules, and Calculations
          |
          v
Repository Interfaces
          |
          v
LocalStorage Adapter
```

Sales Analytics uses a separate read-only data path:

```text
Sales Analytics UI
        |
        v
Sales Analytics Queries
        |
        v
Static SalesMockEntry Dataset
```

### 5.1. Layer Responsibilities

#### Presentation Layer

Contains routes, layouts, feature pages, forms, tables, dialogs, charts, and shared UI components.

It may:

- Read application state through selectors.
- Hold temporary UI state and form drafts.
- Call application use cases through store actions.
- Display validation and persistence errors.

It must not:

- Calculate MWAC inside React components.
- Directly read or write LocalStorage.
- Change stock quantities without creating ledger transactions.
- Mix SalesMockEntry data with inventory transactions.

#### Application Layer

Contains use cases and read queries.

Examples:

- `createProduct`
- `updateProduct`
- `deleteProduct`
- `createCategory`
- `deleteCategory`
- `createSupplier`
- `deleteSupplier`
- `postPurchaseInvoice`
- `recordStockOut`
- `updateAppSettings`
- `getDashboardSummary`
- `getProductDetails`
- `getLatestSupplierPurchasePrices`

Use cases coordinate domain rules and repository operations. They must not depend on React or Next.js.

#### Domain Layer

Contains the core business types, invariants, and pure calculations.

Examples:

- Product, Category, Supplier, ProductSupplier, ProductCategory.
- PurchaseInvoice and PurchaseInvoiceItem.
- InventoryTransaction and StockOutReason.
- Stock status calculation.
- Moving Weighted Average Cost (MWAC) calculations.
- Latest purchase-price selection.
- Invoice and Stock OUT validation rules.

Domain functions must be deterministic where possible. They must not import React, Zustand, Next.js, or browser APIs.

#### Infrastructure Layer

Implements repository contracts and browser-specific data access.

For the MVP, this layer contains the LocalStorage adapter, serialization, schema validation, and data migrations.

Only this layer may access `window.localStorage`.

## 6. Routing Architecture

Use the Next.js App Router.

The route files should stay thin. Each route should render the related feature page. Business logic belongs in the application and domain layers.

### 6.1. MVP Routes

| Route | Feature | Page responsibility |
|---|---|---|
| `/` | Dashboard | Inventory summary, selected sales indicators, recent inventory transactions, and best-selling products from mock data |
| `/sales-analytics` | Sales Analytics | Read-only sales metrics, charts, product comparisons, and date-range filtering |
| `/products` | Products | Product list, search, filtering, sorting, and pagination |
| `/products/[productId]` | Products | Product details, stock position, categories, suppliers, and supplier-specific purchase-price history |
| `/categories` | Categories | Category list and management |
| `/suppliers` | Suppliers | Supplier list and management |
| `/suppliers/[supplierId]` | Suppliers | Supplier details and related products |
| `/purchase-invoices` | Purchase Invoices | Posted invoice list |
| `/purchase-invoices/new` | Purchase Invoices | Create, review, and post a supplier invoice |
| `/purchase-invoices/[invoiceId]` | Purchase Invoices | Read-only posted invoice details |
| `/stock-out` | Stock OUT | Create and confirm a non-sale stock removal |
| `/transactions` | Transactions | Inventory transaction history and filters |
| `/transactions/[transactionId]` | Transactions | Read-only transaction details |
| `/settings` | Settings | Local display preferences |

The exact route paths may change during implementation, but page responsibilities must remain aligned with the UI/UX Specification.

### 6.2. Route Rules

- Do not create a standalone Stock IN route or form.
- Purchase Invoice posting is the normal Stock IN flow.
- Do not create routes for customers, sales orders, sales invoices, payments, purchase orders, warehouses, or user accounts.
- Use route parameters only for records that have a stable ID.
- Use Next.js layouts for the shared application shell and navigation.

## 7. Component Architecture

Use three component levels.

### 7.1. UI Primitives

Location: `src/components/ui/`

Examples: Button, Input, Select, Checkbox, Dialog, Dropdown Menu, Tooltip, Tabs, Badge, Card, and Table primitives.

Rules:

- Keep these components generic.
- Do not place product or inventory business rules in UI primitives.
- Adapt generated shadcn/ui code to Storix design tokens and accessibility needs.
- Do not install components that the application does not use.

### 7.2. Shared Application Components

Location: `src/components/shared/` and `src/components/layout/`

Examples:

- `AppSidebar`
- `Topbar`
- `PageContainer`
- `PageHeader`
- `Breadcrumbs`
- `DataTable`
- `SearchInput`
- `FilterControl`
- `Pagination`
- `EmptyState`
- `ErrorState`
- `ConfirmationDialog`
- `ToastNotification`
- `MoneyDisplay`
- `QuantityDisplay`
- `StockStatusBadge`
- `TransactionTypeBadge`

These components may format and display data. They must not own business calculations.

### 7.3. Feature Components

Each feature owns its page-specific UI, forms, hooks, and view models.

Examples:

- Products: `ProductForm`, `ProductTable`, `ProductFilters`, `ProductSupplierSelector`, `CategoryMultiSelect`, `SupplierPurchasePriceList`.
- Purchase Invoices: `PurchaseInvoiceForm`, `PurchaseInvoiceLineEditor`, `PurchaseInvoiceReview`, `PurchaseInvoiceDetails`.
- Stock OUT: `StockOutForm`, `StockOutReview`.
- Transactions: `TransactionTable`, `TransactionDetails`.
- Dashboard: `InventorySummaryCard`, `SalesMetricCard`, `SalesTrendChart`, `TopProductsList`, `RecentTransactionsTable`.
- Sales Analytics: `SalesDateRangePicker`, `SalesTrendChart`, `ProductPerformanceComparison`, `GrossProfitCard`, `GrossMarginCard`.

A feature component may compose shared components. Shared components must not import from a feature folder.

## 8. State Management

Use Zustand for the in-memory application state.

### 8.1. State Categories

| State type | Where it belongs | Examples |
|---|---|---|
| Persisted application data | Zustand store, backed by LocalStorage | Products, categories, suppliers, links, invoices, invoice lines, transactions, settings |
| Temporary form state | React Hook Form | Product draft, invoice draft, Stock OUT draft |
| Temporary UI state | Local React state | Open dialog, expanded row, active tab, sidebar state |
| URL state | Search parameters when useful | Search query, selected filters, selected page |
| Static data | Source files, not Zustand persistence | SalesMockEntry dataset |
| Derived data | Selectors and pure query functions | Current stock, inventory value, low-stock state, latest purchase price |

Do not copy derived values into the Product record or store them as editable fields.

### 8.2. Zustand Store Responsibilities

The store should expose:

- The hydrated application snapshot.
- Initialization status.
- A persistence or data-integrity error state.
- Selectors for reading the current snapshot.
- Actions that call application use cases and update in-memory state only after a successful repository save.

Do not place all business rules inside Zustand actions. Keep use cases and domain functions independently testable.

### 8.3. Derived Data

Derive these values from source records:

- Product current quantity.
- Product inventory carrying value.
- Product average unit cost.
- Stock status.
- Dashboard inventory metrics.
- Latest purchase price for each Product-Supplier pair.
- Purchase Invoice line totals and recorded purchase subtotal.
- Sales Analytics metrics from SalesMockEntry only.

Use focused selectors and memoization where needed. Do not add a second persisted copy of derived values.

## 9. Data Layer and LocalStorage Persistence

### 9.1. Source of Truth

The inventory transaction ledger is the source of truth for stock quantity and carrying value.

Product must not store an editable `currentStock`, `quantityOnHand`, `inventoryValueIrt`, or manually editable purchase price.

Purchase price history must come from Purchase Invoice lines. The latest purchase price must be derived for each Product-Supplier pair.

SalesMockEntry records must stay in static application data. Do not save them in the editable inventory snapshot.

### 9.2. Persisted Snapshot

Store all editable application data in one versioned snapshot under one LocalStorage key.

Proposed key:

```text
storix:app-data
```

Proposed envelope:

```ts
interface StorageEnvelope {
  schemaVersion: number;
  revision: number;
  savedAt: string;
  data: AppData;
}

interface AppData {
  products: Product[];
  categories: Category[];
  productCategories: ProductCategory[];
  suppliers: Supplier[];
  productSuppliers: ProductSupplier[];
  purchaseInvoices: PurchaseInvoice[];
  purchaseInvoiceItems: PurchaseInvoiceItem[];
  inventoryTransactions: InventoryTransaction[];
  settings: AppSettings;
}
```

`SalesMockEntry[]` is deliberately not part of `AppData`.

The `schemaVersion` supports future data migrations. The `revision` helps detect changes from another browser tab. `savedAt` records the last successful snapshot write.

### 9.3. Repository Contract

The application layer should depend on a repository contract, not on LocalStorage directly.

Proposed responsibilities:

```ts
interface AppRepository {
  load(): Result<AppData, StorageError>;
  save(data: AppData, revision: number): Result<StorageMetadata, StorageError>;
}
```

The exact TypeScript result types should be defined during Project Setup. The contract must expose failure. It must not silently return success when storage fails.

### 9.4. Save Flow

Every write operation must follow this sequence:

1. Read the current in-memory snapshot.
2. Run the relevant application use case and domain validation.
3. Build a new immutable snapshot without changing the current one.
4. Validate the new snapshot with the storage schema.
5. Serialize the complete snapshot.
6. Write the complete envelope with one `localStorage.setItem` call.
7. Update the Zustand store only after the write succeeds.
8. Show success feedback only after the store and persistence update succeed.

If validation or persistence fails:

- Keep the previous in-memory snapshot.
- Do not show a success message.
- Keep the user's form values.
- Show a useful error message.

This single-key snapshot design prevents the application from saving an invoice header while missing its lines or Stock IN transactions. It is an application-level consistency strategy. LocalStorage is not a full database and does not provide database transactions or backups.

### 9.5. Purchase Invoice Posting

`postPurchaseInvoice` must be one application command.

It must create the following in memory before saving:

- One PurchaseInvoice header.
- All PurchaseInvoiceItem records.
- Exactly one STOCK_IN InventoryTransaction for each invoice line.
- Updated ledger-derived stock state, without directly editing a Product stock field.
- Updated invoice and transaction sequences where required.

The command must validate all product-supplier links, duplicate product lines, quantities, prices, and safe-integer arithmetic before saving.

The complete next snapshot is persisted once. Do not save each record separately.

Product creation with positive opening stock must follow the same pattern: create the Product and its `OPENING_STOCK` transaction in one command and one snapshot write. Do not save the Product first and its opening transaction later.

### 9.6. Storage Initialization and Validation

At application startup:

1. Read the snapshot in the browser after client initialization.
2. If no snapshot exists, create an empty valid dataset with approved default settings.
3. Parse the JSON and validate it with the current storage schema.
4. Run sequential migrations when the saved `schemaVersion` is older.
5. Hydrate Zustand only after the snapshot is valid.

Do not overwrite invalid or unreadable saved data with an empty dataset automatically.

If stored data is invalid:

- Stop write operations.
- Show a clear data-integrity error.
- Preserve the stored value until the user chooses an explicit recovery or reset action.
- Do not display fabricated zero values for calculations that cannot be trusted.

### 9.7. Storage Error Handling

Handle at least:

- `QuotaExceededError`.
- Storage access blocked by browser settings or privacy mode.
- Invalid JSON.
- Unsupported schema versions.
- Schema validation failures.
- Serialization failures.

The UI must explain that the operation was not saved. Never update the visible inventory state as if a failed save had succeeded.

### 9.8. Browser-Tab Changes

The MVP does not provide collaborative or multi-user editing.

Use the browser `storage` event to detect when another tab changes the Storix snapshot. If the in-memory revision is stale, warn the user and require a reload before the next write. Do not silently overwrite a newer snapshot with an older one.

## 10. Domain and Business Logic

All calculations and business rules must live in pure domain functions or application use cases.

### 10.1. Inventory Ledger

- Keep InventoryTransaction records immutable.
- Keep the original product, SKU, package, and supplier snapshots on historical records.
- Keep transactions readable after a Product or Supplier is deleted.
- Use the per-product `sequence` to replay movements in a stable order.
- Do not backdate movements.

### 10.2. Moving Weighted Average Cost

Implement MWAC in a dedicated, well-tested domain module.

It must:

- Replay the product's ordered inventory transactions.
- Keep carrying-value totals as integer toman amounts.
- Preserve fractional average-unit-cost precision for later calculations where practical.
- Use the approved round-half-up rule for partial Stock OUT cost.
- Remove the full remaining carrying value when Stock OUT removes the full remaining quantity.
- Reject unsafe integer arithmetic and negative stock or carrying value.

Do not reimplement this formula in a Dashboard card, table, or form.

### 10.3. Purchase-Price History

Derive the latest purchase price separately for each Product-Supplier pair.

Sort by:

1. `invoiceDate` descending.
2. `recordedAt` descending when invoice dates are equal.

Do not store the latest price on Product or ProductSupplier. Do not show a single unqualified purchase price for a product with multiple suppliers.

### 10.4. Record Deletion Rules

Keep deletion behavior in application use cases and enforce the approved domain rules:

- A Product can be deleted only when its derived current stock is zero. Remove its active category and supplier links, but retain its invoices, invoice lines, inventory transactions, and historical snapshots.
- A Category can be deleted only when no ProductCategory link refers to it.
- A Supplier can be deleted only when it has no active ProductSupplier links and no Purchase Invoice history.
- Never cascade-delete historical invoice or transaction records.

### 10.5. Sales Analytics

- Store SalesMockEntry data in a static source file.
- Keep sales queries separate from inventory queries.
- Apply one selected date range to all date-dependent widgets.
- Calculate Revenue, Cost of Goods Sold, Gross Profit, and Gross Margin only from the mock dataset and the approved formulas.
- Clearly label all metrics as sample or simulated data.
- Never treat Stock OUT as a sale.

## 11. Forms and Validation

Use React Hook Form for form state and Zod schemas for validation.

### 11.1. Validation Boundaries

Validate at more than one boundary:

1. Form schema: validates user input and produces field-level errors.
2. Application use case: validates business preconditions against the current snapshot.
3. Storage schema: validates the complete serialized snapshot when loading and before saving.

A valid form is not proof that an operation is valid against current application data.

### 11.2. Form Rules

- Keep incomplete form drafts in React Hook Form, not in the persisted application snapshot.
- Use field arrays for Purchase Invoice lines.
- Prevent duplicate Product lines within one invoice.
- Validate Product-Supplier links against current data at submit time.
- Disable duplicate submission while a command is running.
- Use an explicit review and confirmation step before posting a Purchase Invoice or Stock OUT.
- Preserve entered values when validation or persistence fails.

### 11.3. Numeric and Money Inputs

- Store quantities as whole numbers.
- Store money as non-negative safe integer toman amounts.
- Keep formatted display strings separate from numeric domain values.
- `sellingPriceIrt: null` means Not set.
- `sellingPriceIrt: 0` means Free.
- Never convert toman to rial.
- Validate safe-integer constraints before calculations and persistence.

## 12. Formatting, Dates, and Locale

Use shared formatting utilities. Do not format money, dates, or quantities independently in each feature.

Proposed utilities:

- `formatMoneyIrt(value)`
- `formatQuantity(value)`
- `formatCalendarDate(value)`
- `formatDateTime(value)`
- `formatRelativeAge(invoiceDate)`

Use `Intl.NumberFormat` and `Intl.DateTimeFormat` behind these utilities. Keep stored amounts numeric and stored timestamps in ISO 8601 UTC format.

`invoiceDate` and SalesMockEntry `date` are calendar dates (`YYYY-MM-DD`), not timestamps. Do not parse them in a way that shifts the calendar date across time zones.

**Open UI decision:** the approved product documents do not specify the interface language, text direction, calendar system, or digit style. The recommended default for review is Persian UI with RTL layout and Toman display. Confirm this before implementing the root `lang`/`dir` settings and date presentation. Use CSS logical properties so components do not depend on a fixed text direction.

## 13. Error and Feedback Architecture

Use a consistent error model across the application.

| Error category | Example | Expected behavior |
|---|---|---|
| Field validation | Invalid SKU or negative price | Show a field-level message and preserve other values |
| Business rule | Product has non-zero stock and cannot be deleted | Block the action and explain why |
| Domain calculation | Unsafe integer or invalid ledger state | Block the operation and show a clear error state |
| Persistence | LocalStorage write fails | Keep the previous state and show that the operation was not saved |
| Data integrity | Stored snapshot is invalid | Disable writes and show a recovery state |
| Not found | Route ID does not exist | Show a not-found page or state |

Use reusable components for inline errors, empty states, confirmation dialogs, and toast feedback.

Do not show fake loading states for synchronous LocalStorage operations. Use a pending state only when a real asynchronous operation exists.

## 14. Folder Structure

Use feature-oriented folders with separate domain, application, and infrastructure layers.

```text
src/
├── app/
│   ├── (workspace)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sales-analytics/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [productId]/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── suppliers/
│   │   │   ├── page.tsx
│   │   │   └── [supplierId]/page.tsx
│   │   ├── purchase-invoices/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [invoiceId]/page.tsx
│   │   ├── stock-out/page.tsx
│   │   ├── transactions/
│   │   │   ├── page.tsx
│   │   │   └── [transactionId]/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
│
├── components/
│   ├── ui/                 # Generic shadcn/ui primitives
│   ├── layout/             # App shell, sidebar, topbar
│   └── shared/             # Shared application-level components
│
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── queries/
│   │   └── types/
│   ├── sales-analytics/
│   │   ├── components/
│   │   ├── data/           # Static SalesMockEntry data
│   │   ├── queries/
│   │   └── types/
│   ├── products/
│   │   ├── components/
│   │   ├── forms/
│   │   ├── schemas/
│   │   └── hooks/
│   ├── categories/
│   ├── suppliers/
│   ├── purchase-invoices/
│   ├── stock-out/
│   ├── transactions/
│   └── settings/
│
├── domain/
│   ├── entities/
│   ├── rules/
│   ├── calculations/
│   ├── schemas/
│   └── errors/
│
├── application/
│   ├── commands/
│   ├── queries/
│   └── ports/              # Repository contracts
│
├── infrastructure/
│   └── storage/
│       ├── local-storage-app.repository.ts
│       ├── storage-envelope.schema.ts
│       ├── migrations/
│       └── storage-errors.ts
│
├── store/
│   ├── app-store.ts
│   ├── app-store.types.ts
│   └── selectors/
│
├── lib/
│   ├── formatting/
│   ├── dates/
│   └── utils/
│
└── test/
    ├── fixtures/
    └── helpers/
```

Keep files close to the feature when they are only used by that feature. Keep domain entities and shared business rules in the domain layer. Avoid creating empty folders before they are needed.

## 15. Rendering and Browser Boundaries

Use Server Components by default for route shells and static structure. Use Client Components only where browser state or interaction is required.

The application data provider/store must initialize on the client because LocalStorage is a browser API.

Rules:

- Do not read LocalStorage during server rendering.
- Do not access `window`, `document`, or browser storage from domain functions.
- Keep client boundaries as small as practical.
- Render a real initialization state until local data has been read and validated.
- Do not allow a server-rendered empty state to overwrite browser data during hydration.
- Do not create API routes or Server Actions for inventory operations in the MVP.

## 16. Testing Strategy

### 16.1. Domain Unit Tests

Test all important business rules, including:

- MWAC receipt calculations.
- Partial Stock OUT and round-half-up behavior.
- Full Stock OUT carrying-value removal.
- Negative-stock prevention.
- Safe-integer and overflow handling.
- Low-stock boundary rules.
- Latest purchase-price ordering and tie-break behavior.
- Product, Category, and Supplier deletion rules.
- Immutable invoice and transaction behavior.
- Sales Analytics formulas and date-range boundaries.

### 16.2. Repository Tests

Test:

- Empty-storage initialization.
- Snapshot serialization and loading.
- Schema validation.
- Sequential data migrations.
- Invalid JSON and unsupported schema versions.
- Storage access and quota errors.
- Failed saves do not change the in-memory state.
- Purchase Invoice posting persists a complete snapshot in one write.

### 16.3. Component Tests

Test important user-visible behavior:

- Form labels and validation messages.
- Product and Supplier selectors.
- Purchase Invoice line editing and review.
- Stock OUT confirmation and reason validation.
- Empty, error, and unavailable states.
- Keyboard use and accessible dialog behavior.

### 16.4. End-to-End Tests

Cover these main workflows:

1. Create a Supplier and a Product.
2. Link the Product to the Supplier.
3. Create a Product with opening stock and a valid opening cost.
4. Post a Purchase Invoice and verify stock and transaction history.
5. Verify the latest purchase price for the Product-Supplier pair.
6. Record Stock OUT and verify the quantity and MWAC cost.
7. Attempt invalid operations and verify that data does not change.
8. Delete an eligible zero-stock Product and verify that historical records remain readable.
9. Verify that Stock OUT and Purchase Invoice operations do not change Sales Analytics mock data.
10. Refresh the browser and verify that saved inventory data remains available.

## 17. Performance and Accessibility

- Use pagination for long lists.
- Avoid recalculating the full ledger in every component render.
- Memoize expensive derived selectors when the data volume makes it useful.
- Keep charts responsive and provide a text or table alternative.
- Use semantic HTML and visible keyboard focus.
- Support keyboard operation for dialogs, menus, tables, and forms.
- Do not use color as the only way to communicate stock status.
- Use CSS logical properties and test both the approved text direction and narrow viewports.

## 18. Security and Data Limitations

- There are no account credentials or server secrets in this MVP.
- LocalStorage data is tied to the current browser profile and origin.
- Data does not sync between devices or browser profiles.
- Browser storage is not encrypted by this application.
- Clearing browser data can remove the user's inventory data.
- Do not claim that LocalStorage provides backup, multi-user access, or database-level durability.

Show a clear note in Settings that inventory data is stored in the current browser profile and is not synced to other devices.

## 19. Architecture Decision Register

| ID | Decision | Proposed status |
|---|---|---|
| ADR-001 | Use Next.js App Router | Proposed |
| ADR-002 | Keep the MVP frontend-only with no API or server database | Fixed by product scope |
| ADR-003 | Use Zustand for in-memory application state | Proposed |
| ADR-004 | Persist one versioned application snapshot in LocalStorage | Proposed |
| ADR-005 | Use layered, feature-oriented folders | Proposed |
| ADR-006 | Use React Hook Form and Zod for forms and validation | Proposed |
| ADR-007 | Use Tailwind CSS and project-owned shadcn/ui components | Proposed |
| ADR-008 | Use Recharts for Sales Analytics charts | Proposed |
| ADR-009 | Use Vitest, React Testing Library, and Playwright | Proposed |
| ADR-010 | Use static SalesMockEntry data outside the inventory snapshot | Fixed by business rules |
| ADR-011 | Keep the inventory transaction ledger as the stock and valuation source of truth | Fixed by business rules |
| ADR-012 | Confirm the UI language, direction, calendar, and digit style | Open |

## 20. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| LocalStorage has limited capacity | A large dataset may fail to save | Keep the MVP dataset reasonable; handle quota errors; evaluate IndexedDB only if a real limit is reached and approve the scope change first. |
| Stored data becomes invalid after a code change | User data may become unreadable | Use schema versions, migrations, validation, and tests. Never reset invalid data silently. |
| A multi-record operation is saved in parts | Inventory and history can become inconsistent | Build a complete next snapshot and persist it with one key write. |
| Business logic leaks into components | Different pages may calculate different values | Keep domain calculations in pure shared functions and test them directly. |
| Multiple browser tabs write stale snapshots | A newer change may be overwritten | Detect storage revision changes and block stale writes until reload. |
| Sales mock records are mixed with inventory records | Analytics may look like real transactions | Keep a separate static dataset and separate query path. |

## 21. Definition of Done

The Frontend Architecture phase is complete when:

- [ ] The product constraints in all approved documents are reflected in this architecture.
- [ ] App Router and route responsibilities are approved.
- [ ] The technology stack is approved.
- [ ] Folder structure and dependency boundaries are approved.
- [ ] Zustand responsibilities are clear.
- [ ] LocalStorage snapshot format and save flow are approved.
- [ ] Purchase Invoice posting is designed as one logical persistence operation.
- [ ] Domain calculations are separated from UI components.
- [ ] Sales mock data is isolated from inventory data.
- [ ] Validation, error handling, and data migration strategies are defined.
- [ ] Testing strategy covers critical business rules and user workflows.
- [ ] UI language, direction, calendar, and digit style are resolved or explicitly deferred with an implementation-safe default.
- [ ] No Critical or High architecture review issue remains.

Only after this checklist passes should Storix move to **Phase 5 — Project Setup**.

## 22. References

### Project Documents

- `docs/PRD.md`
- `docs/BUSINESS_RULES_AND_DATA_MODEL.md`
- `docs/UI_UX_SPECIFICATION.md`
- `docs/OPEN_DECISIONS_REVIEW.md`

### Technical Documentation

- Next.js App Router: https://nextjs.org/docs/app
- Next.js Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- Zustand Persisting Store Data: https://pmndrs.github.io/zustand/reference/integrations/persisting-store-data
- React Hook Form: https://react-hook-form.com/docs
- Zod: https://zod.dev/
- Tailwind CSS with Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- shadcn/ui with Next.js: https://ui.shadcn.com/docs/installation/next
- Recharts: https://recharts.github.io/en-US/guide/

## 23. Change Log

| Version | Date | Changes |
|---|---|---|
| 0.1 | 2026-11-12 | Initial architecture proposal based on the approved PRD, Business Rules & Data Model, UI/UX Specification, and product decisions D-01 through D-09. |
