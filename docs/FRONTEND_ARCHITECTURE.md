# Storix — Frontend Architecture

**Document:** Frontend Architecture  
**Version:** 1.0

**Status:** Approved for Project Setup  
**Last Updated:** 2026-11-12  
**Primary References:** `docs/PRD.md`, `docs/BUSINESS_RULES_AND_DATA_MODEL.md`, `docs/UI_UX_SPECIFICATION.md`, `docs/OPEN_DECISIONS_REVIEW.md`

---

## 1. Purpose

This document defines the reviewed frontend architecture for the Storix MVP.

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
9. Deliver a Persian-language interface with right-to-left layout as the default and only MVP language.

## 3. Architecture Constraints

The following constraints are fixed by the approved product documents:

| Area | Constraint |
|---|---|
| Product | General-purpose inventory management with read-only sales analytics |
| Framework direction | Next.js and TypeScript |
| Router | Next.js App Router |
| User context | One local user; no authentication or roles |
| Warehouse | One warehouse |
| Backend | Not included |
| Server database | Not included |
| Editable data | Browser LocalStorage |
| Sales data | Static mock data; read-only |
| Interface language | Persian (`fa`) |
| Text direction | Right-to-left (`rtl`) across the application |
| Currency | Store integer toman amounts; display `تومان`; application identifier is `IRT` |
| Quantity | Positive or non-negative whole-number quantities as defined by each operation; one countable item or package |
| Inventory source of truth | Immutable inventory transaction ledger |
| Stock IN | Created only by posting a Purchase Invoice or by the approved opening-stock flow |
| Stock OUT | Non-sale removal with an approved reason |
| Posted invoices and transactions | Immutable in the MVP |

Do not add APIs, a server database, authentication, real sales processing, customer management, purchase orders, supplier payments, or multiple warehouses.

## 4. Selected Technology Stack

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
| Locale | `fa-IR` | Persian UI copy, number formatting, and date presentation. Keep machine-readable data independent from display formatting. |
| Direction support | shadcn/ui RTL support with `rtl: true` and a direction provider | Use logical CSS properties and test portals, navigation, and directional controls. |

### 4.1. Dependencies Not Required for the MVP

Do not add these unless a clear requirement appears:

- TanStack Query or SWR: there is no remote data source to fetch or cache.
- Axios: there are no application API requests.
- Prisma, Drizzle, or an ORM: there is no server database.
- Authentication libraries: authentication is out of scope.
- A second global state library: Zustand is sufficient for the local application snapshot.
- A large all-in-one UI framework: use project-owned components and design tokens.
- An internationalization framework: the MVP has one language. Keep Persian UI strings in the project; do not add a multi-locale framework until the scope requires it.
- Automatic persistence middleware for Zustand: persistence must go through the repository and application use cases, not through store subscriptions.

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

Create the Zustand store with `createStore` inside a client-side provider and expose it through React Context. Do not create a module-level global store. This keeps the store scoped to the application tree and avoids sharing server module state. Server Components must not read or write the store.

The store should expose:

- The hydrated application snapshot.
- Initialization status.
- A persistence or data-integrity error state.
- Selectors for reading the current snapshot.
- Actions that call application use cases and update in-memory state only after a successful repository save.

Do not place all business rules inside Zustand actions. Keep use cases and domain functions independently testable.

Do not use Zustand `persist` middleware for application data. The store is an in-memory client cache. Commands must call the application use case, which validates and persists the next snapshot through the repository. Update the store only after the repository confirms a successful write.

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

Key:

```text
storix:app-data
```

Use the flat versioned shape defined in `BUSINESS_RULES_AND_DATA_MODEL.md` (currently `StorixDataV2`). Do not add a second wrapper object or move the approved collections under a nested `data` property unless the Business Rules document is updated at the same time.

```ts
interface StorixDataV2 {
  schemaVersion: 2;
  products: Product[];
  categories: Category[];
  productCategories: ProductCategory[];
  suppliers: Supplier[];
  productSuppliers: ProductSupplier[];
  purchaseInvoices: PurchaseInvoice[];
  purchaseInvoiceItems: PurchaseInvoiceItem[];
  inventoryTransactions: InventoryTransaction[];
  settings: AppSettings;
  updatedAt: string;
}
```

`SalesMockEntry[]` is deliberately not part of this snapshot. `schemaVersion` supports sequential migrations. `updatedAt` records the timestamp of the last successful save. Keep the persisted property names and meanings aligned with the approved Business Rules data model.

### 9.3. Repository Contract

The application layer should depend on a repository contract, not on LocalStorage directly.

Proposed responsibilities:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: StorageError };

interface AppRepository {
  load(): Result<StorixDataV2 | null>;
  save(nextSnapshot: StorixDataV2): Result<void>;
}
```

`load()` returns `null` only when the key does not exist. The application layer creates the approved empty initial snapshot in that case. The contract must expose failure. It must not silently return success when storage fails. The adapter keeps the raw value it last loaded and checks it again before writing. After a successful write, it updates the remembered raw value to the new serialized snapshot. This detects many stale-tab writes, but it is not a compare-and-swap lock and does not guarantee safe simultaneous writes from two tabs.

### 9.4. Save Flow

Every write operation must follow this sequence:

1. Read the current in-memory snapshot.
2. Run the relevant application use case and domain validation.
3. Build a new immutable snapshot without changing the current one.
4. Validate the new snapshot with the storage schema.
5. Serialize the complete snapshot.
6. Write the complete serialized snapshot with one `localStorage.setItem` call.
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
- Stable IDs for the invoice, invoice lines, and transactions, plus the next per-product transaction sequence values.

The command must validate all product-supplier links, duplicate product lines, quantities, prices, and safe-integer arithmetic before saving. Calculate line totals and carrying-value changes with exact integer arithmetic. Do not rely on a JavaScript `number` multiplication when the intermediate result may exceed `Number.MAX_SAFE_INTEGER`.

The complete next snapshot is persisted once. Do not save each record separately.

Product creation with positive opening stock must follow the same pattern: create the Product and its `OPENING_STOCK` transaction in one command and one snapshot write. Do not save the Product first and its opening transaction later.

### 9.6. Storage Initialization and Validation

At application startup:

1. Read the snapshot in the browser after client initialization.
2. If no snapshot exists, create an empty valid dataset with approved default settings.
3. Parse the JSON and validate it with the current storage schema.
4. Run sequential migrations from each supported older schema version to the current `schemaVersion: 2`. Reject unknown future schema versions without overwriting the stored value.
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

The MVP supports one active editing tab. It does not provide collaborative or multi-user editing.

- Use the browser `storage` event to detect when another same-origin tab changes the Storix snapshot. The event is delivered to other tabs, not to the tab that performed the write.
- When an external change is detected, mark the current tab as stale, disable write commands, and require a reload before editing again.
- Before each write, compare the current stored raw value with the value last loaded by this tab. Reject the write if they differ.
- This is best-effort stale-write detection. LocalStorage does not provide a transactional compare-and-swap operation or a full multi-tab locking guarantee. Do not claim that revision checks prevent every race condition.

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
- Preserve the average unit cost as an exact rational value (`carryingValue / quantity`) during calculations. Do not round the average unit cost before a later Stock OUT calculation.
- Use `BigInt` for intermediate multiplication, division, and round-half-up calculations. For a receipt, calculate `quantity × unitPurchasePriceIrt` without a floating-point intermediate. For a partial Stock OUT, calculate the exact integer numerator before division.
- Convert a result back to `number` only after checking that it is a non-negative safe integer.
- Use the approved round-half-up rule for partial Stock OUT cost.
- Remove the full remaining carrying value when Stock OUT removes the full remaining quantity.
- Reject unsafe stored values, arithmetic overflow, and negative stock or carrying value.
- Keep `bigint` values inside calculation functions only. Do not put them in domain records or LocalStorage JSON because `JSON.stringify` does not serialize `bigint` by default.

For non-negative values, implement round-half-up with integer quotient and remainder. Do not use `Math.round` on a floating-point division:

```ts
function roundHalfUp(numerator: bigint, denominator: bigint): bigint {
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  return quotient + (2n * remainder >= denominator ? 1n : 0n);
}

const receivedValue = BigInt(quantity) * BigInt(unitPurchasePriceIrt);
const nextCarryingValue = BigInt(carryingValueBefore) + receivedValue;
const partialCostRemoved = roundHalfUp(
  BigInt(stockOutQuantity) * BigInt(carryingValueBefore),
  BigInt(quantityBefore),
);
```

Handle a full Stock OUT separately by removing the full remaining carrying value. Before saving any calculated value, compare it with `BigInt(Number.MAX_SAFE_INTEGER)` and only then convert it to `number`.

Do not reimplement this formula in a Dashboard card, table, or form.

### 10.3. Purchase-Price History

Derive the latest purchase price separately for each Product-Supplier pair.

Sort by:

1. `invoiceDate` descending.
2. `recordedAt` descending when invoice dates are equal.

`invoiceDate` is a date-only `YYYY-MM-DD` string. It can be compared as a validated ISO calendar-date value; do not parse it as a UTC timestamp for ordering. Do not store the latest price on Product or ProductSupplier. Do not show a single unqualified purchase price for a product with multiple suppliers.

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
- Show Gross Profit and Gross Margin only on Sales Analytics. Do not add them as required Dashboard KPI cards.
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
- Accept Persian digits (`۰۱۲۳۴۵۶۷۸۹`), Arabic-Indic digits (`٠١٢٣٤٥٦٧٨٩`), and ASCII digits in quantity and money inputs. Normalize them to ASCII digits before parsing and Zod validation.
- Use text inputs with a suitable numeric `inputMode` where browser number inputs do not accept the required Persian digit input consistently. Do not allow decimal quantities.
- Keep formatted display strings separate from numeric domain values.
- `sellingPriceIrt: null` means Not set.
- `sellingPriceIrt: 0` means Free.
- Never convert toman to rial.
- Validate safe-integer constraints before calculations and persistence.

## 12. Persian Locale, RTL, Formatting, and Dates

The product owner confirmed that the MVP interface language is Persian and the default text direction is RTL.

### 12.1. Root Document and Direction

- Set the root element to `<html lang="fa" dir="rtl">`.
- Wrap direction-aware Radix/shadcn primitives in the project's `DirectionProvider` with `direction="rtl"`.
- Set `rtl: true` in `components.json` before generating shadcn/ui components. Use a current shadcn style that supports the RTL transform; manually review Sidebar, Calendar, and Pagination because these components need extra RTL checks.
- Place the desktop application sidebar at the inline start edge (the right side in RTL).
- Use CSS logical properties such as `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, and `text-align: start` instead of hard-coded left/right properties.
- Review directional icons, dropdowns, popovers, tooltips, dialogs, sidebars, pagination, and calendars. The shadcn RTL tooling does not remove the need to check every component.
- Render user-facing labels, validation messages, empty states, errors, and confirmations in Persian.

### 12.2. Mixed Persian and Latin Content

- Keep SKUs, IDs, email addresses, URLs, phone numbers, and supplier product codes in their original form.
- Isolate left-to-right values with `dir="ltr"` or `<bdi dir="ltr">` so punctuation and digits do not reorder inside Persian sentences or tables.
- Keep machine values, enum values, route segments, and persisted field names in stable English/ASCII form. Translate only their user-facing labels.

### 12.3. Number and Currency Formatting

Use shared formatting utilities. Do not format money, dates, or quantities independently in each feature.

Proposed utilities:

- `formatMoneyIrt(value)`
- `formatQuantity(value)`
- `formatCalendarDate(value)`
- `formatDateTime(value)`
- `formatRelativeAge(invoiceDate)`

Use `Intl.NumberFormat` and `Intl.DateTimeFormat` behind these utilities with the Persian locale (`fa-IR`). Use Persian digits for user-facing quantities and amounts by default. Accept Persian, Arabic-Indic, and ASCII digits in numeric form inputs, then normalize them to ASCII before validation. Keep identifiers, SKUs, and phone numbers in their source digit style. Display the currency as `تومان`; do not rely on the browser to display an `IRT` currency symbol. Keep stored amounts as integer numbers in toman.

### 12.4. Calendar and Date Storage

- Keep `invoiceDate` and SalesMockEntry `date` in the approved Gregorian ISO date-only format (`YYYY-MM-DD`). They are not timestamps.
- Keep event timestamps in ISO 8601 UTC.
- Do not parse a date-only string with a method that shifts it across time zones.
- For the Persian interface, use Persian-calendar date presentation (`fa-IR-u-ca-persian`) and a Persian-calendar-aware date input. Convert user selection to the Gregorian ISO date-only value before it reaches the domain layer.
- Choose and verify the date-picker package during Project Setup. Do not use a native browser date input unless its Persian-calendar display and RTL behavior pass the cross-browser check.
- Calculate relative purchase-price age from the invoice date at display time. Do not persist phrases such as “۳ روز پیش”.

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
│       ├── persisted-app-data.schema.ts
│       ├── migrations/
│       └── storage-errors.ts
│
├── store/
│   ├── app-store.ts           # Store factory; no module-level singleton
│   ├── app-store-provider.tsx # Client Context provider
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
- Create the Zustand store inside the client provider, not as a server-shared module singleton.
- Keep the server render and first client render on the same initialization state. Load LocalStorage after the client has mounted, then hydrate the store.
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
- A stale tab detects a known external change and blocks its next write.
- Exact BigInt calculation results match the approved MWAC examples and reject unsafe final values.

### 16.3. Component Tests

Test important user-visible behavior:

- Form labels and validation messages.
- Product and Supplier selectors.
- Purchase Invoice line editing and review.
- Stock OUT confirmation and reason validation.
- Empty, error, and unavailable states.
- Keyboard use and accessible dialog behavior.
- RTL navigation, portal alignment, directional icon behavior, and mixed Persian/Latin values.
- Numeric inputs accept Persian, Arabic-Indic, and ASCII digits and persist normalized numeric values.

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
11. Open the app in a second tab, save from one tab, and verify that the other tab becomes stale and blocks further writes until reload.

## 17. Performance and Accessibility

- Use pagination for long lists.
- Avoid recalculating the full ledger in every component render.
- Memoize expensive derived selectors when the data volume makes it useful.
- Keep charts responsive and provide a text or table alternative.
- Use semantic HTML and visible keyboard focus.
- Support keyboard operation for dialogs, menus, tables, and forms in RTL layouts.
- Verify that focus order, arrow-key behavior, menu placement, and directional icons make sense in RTL.
- Use logical CSS properties and test responsive layouts in Persian at desktop, tablet, and mobile widths.
- Verify numeric tables and charts in RTL. Do not reverse chronological data or chart series unless the chart's time-axis design explicitly requires it.
- Do not use color as the only way to communicate stock status.

## 18. Security and Data Limitations

- There are no account credentials or server secrets in this MVP.
- LocalStorage data is tied to the current browser profile and origin.
- Data does not sync between devices or browser profiles.
- Browser storage is not encrypted by this application.
- Clearing browser data can remove the user's inventory data.
- Do not claim that LocalStorage provides backup, multi-user access, or database-level durability.

Show a clear note in Settings that inventory data is stored in the current browser profile and is not synced to other devices.

## 19. Architecture Decision Register

| ID | Decision | Status |
|---|---|---|
| ADR-001 | Use Next.js App Router | Approved |
| ADR-002 | Keep the MVP frontend-only with no API or server database | Fixed by product scope |
| ADR-003 | Use a provider-scoped Zustand store for in-memory application state | Approved |
| ADR-004 | Persist one flat, versioned application snapshot in LocalStorage using the approved `StorixDataV2` shape | Approved |
| ADR-005 | Use layered, feature-oriented folders | Approved |
| ADR-006 | Use React Hook Form and Zod for forms and validation | Approved |
| ADR-007 | Use Tailwind CSS v4 and project-owned shadcn/ui components with RTL enabled | Approved |
| ADR-008 | Use Recharts for Sales Analytics charts | Approved |
| ADR-009 | Use Vitest, React Testing Library, and Playwright | Approved |
| ADR-010 | Use static SalesMockEntry data outside the inventory snapshot | Fixed by business rules |
| ADR-011 | Keep the inventory transaction ledger as the stock and valuation source of truth | Fixed by business rules |
| ADR-012 | Use Persian as the MVP UI language and RTL as the default direction | Approved by product owner |
| ADR-013 | Display user-entered dates in the Persian calendar while storing Gregorian ISO date-only values | Proposed default; validate in the first UI prototype. Date-picker package selected during Project Setup |

## 20. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| LocalStorage has limited capacity | A large dataset may fail to save | Keep the MVP dataset reasonable; handle quota errors; evaluate IndexedDB only if a real limit is reached and approve the scope change first. |
| Stored data becomes invalid after a code change | User data may become unreadable | Use schema versions, migrations, validation, and tests. Never reset invalid data silently. |
| A multi-record operation is saved in parts | Inventory and history can become inconsistent | Build a complete next snapshot and persist it with one key write. |
| Business logic leaks into components | Different pages may calculate different values | Keep domain calculations in pure shared functions and test them directly. |
| Multiple browser tabs attempt to write | A stale tab may overwrite a newer snapshot because LocalStorage does not provide transactional compare-and-swap | Support one active editing tab. Detect storage events, compare the last loaded raw snapshot before writing, and block known-stale tabs. Document that this is best-effort detection, not a multi-tab concurrency guarantee. |
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
- [ ] Persian UI language and RTL direction are implemented at the root document and component-library level.
- [ ] Persian number and currency formatting is shared across the application.
- [ ] Numeric inputs accept Persian, Arabic-Indic, and ASCII digits and normalize them before validation.
- [ ] Persian-calendar display is converted to Gregorian ISO date-only values before domain use.
- [ ] Mixed-direction identifiers remain readable.
- [ ] LocalStorage limitations and the single-active-editing-tab assumption are clear.
- [ ] No Critical or High architecture review issue remains.

Only after this checklist passes should Storix move to **Phase 5 — Project Setup**. The selected date-picker package and Persian font must be verified there before implementation.

## 22. References

### Project Documents

- `docs/PRD.md`
- `docs/BUSINESS_RULES_AND_DATA_MODEL.md`
- `docs/UI_UX_SPECIFICATION.md`
- `docs/OPEN_DECISIONS_REVIEW.md`

### Technical Documentation

- Next.js App Router and Root Layout: https://nextjs.org/docs/app
- Zustand with Next.js: https://zustand.docs.pmnd.rs/learn/guides/nextjs
- React Hook Form: https://react-hook-form.com/docs
- Zod: https://zod.dev/
- Tailwind CSS with Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- shadcn/ui RTL support: https://ui.shadcn.com/docs/rtl
- shadcn/ui Direction Provider: https://ui.shadcn.com/docs/components/radix/direction
- Recharts: https://recharts.github.io/en-US/guide/
- MDN BigInt: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
- MDN Storage event: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
- MDN Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

## 23. Architecture Review Record

**Review date:** 2026-11-12  
**Review outcome:** Approved for Project Setup  
**Unresolved Critical issues:** 0  
**Unresolved High issues:** 0

| Review ID | Finding | Severity | Resolution |
|---|---|---|---|
| AR-01 | Persian language and RTL behavior were not defined. | High | Confirmed Persian UI, root `lang="fa"`, `dir="rtl"`, RTL component configuration, mixed-direction handling, and RTL test requirements. |
| AR-02 | MWAC intermediate arithmetic could rely on imprecise JavaScript `number` operations. | High | Require `BigInt` for exact intermediate integer calculations and safe-range checks before converting persisted results to `number`. |
| AR-03 | The original revision-based LocalStorage description implied stronger cross-tab safety than LocalStorage provides. | High | Removed the unsupported revision guarantee. Defined stale-tab detection as best effort and stated that only one active editing tab is supported. |
| AR-04 | The proposed nested storage envelope differed from the approved flat `StorixDataV2` shape. | Medium | Aligned the repository contract and persisted snapshot with the Business Rules data model. |
| AR-05 | A module-level Zustand store could cause SSR and hydration problems. | High | Require a store factory scoped to a client-side provider; Server Components cannot access the store. |
| AR-06 | Dashboard and Sales Analytics metric ownership needed an explicit D-09 guard. | Medium | Gross Profit and Gross Margin are restricted to Sales Analytics; they are not required Dashboard KPI cards. |
| AR-07 | RTL support requires manual review of some shadcn/ui components and portals. | Medium | Added RTL CLI configuration and explicit manual checks for sidebar, calendar, pagination, portals, and directional icons. |

All High findings have a defined resolution in this document. The Persian-calendar display is the proposed default, not a new business rule. Validate it in the first UI prototype. The exact date-picker package and font are deferred to Project Setup and visual implementation. They do not block the approved architecture.

## 24. Change Log

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-11-12 | Completed architecture review. Confirmed Persian and RTL requirements; strengthened MWAC arithmetic; aligned persistence with `StorixDataV2`; scoped Zustand to a client provider; clarified LocalStorage multi-tab limitations; approved architecture for Project Setup. |
| 0.1 | 2026-11-12 | Initial architecture proposal based on the approved PRD, Business Rules & Data Model, UI/UX Specification, and product decisions D-01 through D-09. |
