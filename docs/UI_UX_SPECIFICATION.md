# Storix — UI/UX Specification

**Document:** UI/UX Specification  
**Version:** 1.2  
**Status:** Draft for Documentation Review  
**Last Updated:** 2026-11-11  
**Primary Reference:** [`PRD.md`](./PRD.md)  
**Business Rules:** [`BUSINESS_RULES_AND_DATA_MODEL.md`](./BUSINESS_RULES_AND_DATA_MODEL.md)

---

## 1. Purpose and Authority

This document defines the interface structure, page content, forms, interactions, feedback, and responsive behavior for the Storix MVP.

The PRD defines what the product must do. The Business Rules & Data Model document defines the rules and calculations. This document defines how the user sees and uses those capabilities.

If a conflict exists:

1. PRD controls the MVP scope.
2. Business Rules & Data Model controls calculations, validation, and data relationships.
3. This UI/UX Specification controls layout, navigation, page structure, and interaction details.

Do not add a feature to the UI unless it exists in the PRD.

## 2. Product Experience

Storix is a general-purpose inventory management interface with read-only sales analytics. The MVP focuses on:

1. Product, category, and supplier management.
2. Stock tracking with whole countable product units.
3. Supplier purchase invoices as the Stock IN workflow.
4. Supplier-specific purchase-price history and current product selling price.
5. Inventory valuation using Moving Weighted Average Cost.
6. Read-only sales analytics using clearly labelled mock data.

The MVP is frontend-only, single-user, and single-warehouse. Editable data is stored in LocalStorage. The UI must not imply server synchronization, live external prices, or real sales processing.

## 3. MVP Scope

### 3.1. Included Modules

| Module | Purpose | Data Source |
|---|---|---|
| Dashboard | Current inventory summary and sample sales indicators | Local inventory data + sales mock data |
| Sales Analytics | Read-only sample sales reports | Static mock data |
| Products | Product catalog, current stock, pricing, category and supplier links | LocalStorage |
| Categories | Product grouping | LocalStorage |
| Suppliers | Supplier contact details and related products | LocalStorage |
| Purchase Invoices | Record supplier invoices and stock receipts | LocalStorage |
| Stock Operations | Record Stock OUT | LocalStorage |
| Transactions | Review immutable inventory history | LocalStorage |
| Settings | Theme and table density | LocalStorage |

### 3.2. Excluded UI

Do not add navigation, forms, buttons, or placeholder pages for:

- Sales Orders or Sales Order Details.
- Customer Management.
- Real sales transactions.
- Sales invoices, receipts, or payment processing.
- Purchase orders, supplier balances, or payment status.
- Shipment management or warehouse transfers.
- Multiple warehouses, user accounts, or role management.
- Barcode scanning or live online purchase-price updates.
- Tax accounting, invoice-wide charges, or financial accounting.

Supplier purchase invoices are included only for incoming stock and purchase-price history. They are not sales invoices.

## 4. User Profiles and Main Tasks

The following profiles are design references, not application roles.

| Profile | Main task |
|---|---|
| Business Owner | Review stock position, estimated inventory value, and sample sales indicators. |
| Inventory Operator | Maintain products and record purchase invoices and Stock OUT movements. |
| Sales Viewer | Review sample sales quantity, revenue, and product performance. |

The user must be able to:

1. Review current stock and sales indicators on the Dashboard.
2. Create and maintain products, categories, and suppliers.
3. Assign multiple categories and suppliers to one product.
4. Record initial stock with acquisition cost.
5. Record supplier purchase invoices and incoming stock.
6. Review the latest purchase price from each supplier and its date.
7. Update the current selling price.
8. Record Stock OUT with a reason.
9. Review stock movement history.
10. Review sample sales analytics for a date range.

## 5. Information Architecture

### 5.1. Primary Navigation

Use a persistent sidebar on desktop. Group the MVP destinations as follows:

| Group | Navigation item | Route |
|---|---|---|
| Overview | Dashboard | `/` |
| Analytics | Sales Analytics | `/sales-analytics` |
| Catalog | Products | `/products` |
| Catalog | Categories | `/categories` |
| Catalog | Suppliers | `/suppliers` |
| Purchasing | Purchase Invoices | `/purchase-invoices` |
| Inventory | Stock Operations | `/stock` |
| Inventory | Transactions | `/transactions` |
| General | Settings | `/settings` |

Routes are proposed UI routes. Final route implementation belongs to Frontend Architecture.

### 5.2. Navigation Rules

- Highlight the active destination.
- Use clear labels and consistent icons.
- Show all MVP destinations in the desktop sidebar.
- Use a collapsible sidebar or navigation drawer on small screens.
- Do not show a user profile menu, customer menu, or sales order menu.
- Show breadcrumbs on nested pages when they improve orientation.

### 5.3. Global Application Shell

The application shell contains:

- Sidebar navigation.
- Top bar with page-level utility controls only.
- Main content area.
- Page title and optional supporting description.
- Breadcrumbs on nested pages where useful.

Do not show fake notifications, online status, user identity, or server-sync indicators.

## 6. Dashboard

### 6.1. Purpose

The Dashboard gives a combined view of current inventory and selected sample sales indicators. Inventory values come from editable LocalStorage data. Sales values come from the separate mock dataset.

### 6.2. Inventory KPI Cards

| KPI | Definition | PRD |
|---|---|---|
| Total Products | Count of active products. | FR-01 |
| Total Units in Stock | Sum of countable stock quantities across active products. | FR-02 |
| Low-Stock Products | Count where current quantity is less than or equal to the product minimum threshold. Includes zero-stock products. | FR-03 |
| Estimated Inventory Value | Sum of current inventory value using Moving Weighted Average Cost. | FR-04 |

All products use the same count unit (`عدد`). Package descriptions may add context, but do not change the KPI calculation.

### 6.3. Stock Status

Use these labels:

- `Out of Stock`: current quantity is zero.
- `Low Stock`: current quantity is positive and less than or equal to minimum stock.
- `In Stock`: current quantity is greater than minimum stock.

The Low-Stock Products KPI includes products with zero quantity, even though their table label is Out of Stock.

### 6.4. Sales Trend

Display a revenue trend from SalesMockEntry data. Include:

- Selected date range.
- Clear revenue label and IRT currency.
- Readable axis labels and exact-value tooltips.
- A visible `Sample Data` label.
- Empty state when the selected range has no entries.

Do not imply that the sample revenue came from the current inventory transactions.

### 6.5. Best-Selling Products

Display a ranked list or table using mock data. Suggested columns:

- Product name.
- SKU or stable display key, when available.
- Package description, when available.
- Quantity sold.
- Revenue.

Default ranking is revenue descending. Clearly identify the data as sample data. Link to Product Details only when an explicit valid product ID exists.

### 6.6. Recent Inventory Transactions

Display recent ledger records with:

- Product name snapshot.
- Transaction type.
- Quantity and package label.
- Date and time.
- Reason, when relevant.
- Related purchase invoice, when relevant.

Selecting a row opens Transaction Details. Do not present Stock OUT as a confirmed sale.

### 6.7. Dashboard Interactions

- Sales date-range changes update all sales widgets.
- Inventory KPI cards may link to relevant inventory pages.
- Recent transaction rows open Transaction Details.
- Best-selling product rows open Product Details only when a stable product link exists.
- No order, customer, or payment pages may be opened from Dashboard.

## 7. Sales Analytics

### 7.1. Purpose

Sales Analytics is a read-only reporting page for simulated sales data. It does not create or manage real sales.

### 7.2. Page Layout

The page contains:

1. Page title and visible `Sample Data` notice.
2. Date-range selector.
3. Sales quantity metric.
4. Sales revenue metric.
5. Gross profit and gross margin metrics.
6. Sales trend chart.
7. Best-selling products.
8. Product performance comparison.

### 7.3. Date Range

Provide these quick ranges:

- Last 7 days.
- Last 30 days.
- Last 90 days.
- Last 12 months.
- Custom range, when supported by the mock data.

Custom start and end dates are inclusive. Start date cannot be after end date. All charts and KPI cards must use the same selected date range. Date-only records use the browser's local calendar date.

### 7.4. Metrics

Display:

- Sales quantity as a whole count of product units.
- Sales revenue in IRT / تومان.
- Gross profit = revenue minus cost of goods sold.
- Gross margin = gross profit divided by revenue, multiplied by 100.

When revenue is zero, show `—` for gross margin. Do not display orders, average order value, customers, cancellations, or payment metrics.

### 7.5. Charts and Comparisons

- Use a revenue trend by date.
- Allow a clear metric selection for product comparison, such as quantity or revenue.
- Include exact-value tooltips.
- Include a text summary or accessible data alternative.
- Show a useful empty state for a date range with no records.
- Do not use inventory transactions as sales data.

### 7.6. Interaction Rules

All Sales Analytics controls are read-only filters. Changing a date range must not write to LocalStorage or create an inventory transaction.

## 8. Products

### 8.1. Product List

The page must contain:

- Page title and supporting text.
- Create Product action.
- Search input for name and SKU.
- Category filter supporting multiple selected categories.
- Stock status filter.
- Sort controls.
- Paginated product table.
- Empty state with Create Product action.

### 8.2. Product Table

Recommended columns:

| Column | Display |
|---|---|
| Product | Name and package description |
| SKU | Unique identifier |
| Categories | One or more category labels |
| Stock | Whole count displayed with `عدد`; package description shown separately |
| Minimum | Threshold in countable units |
| Status | In Stock, Low Stock, or Out of Stock |
| Selling Price | Current price in IRT; show Not Set or Free distinctly |
| Actions | View, Edit, Archive |

Latest supplier purchase prices are better shown in Product Details because a product may have several suppliers and several purchase histories.

### 8.3. Product Create/Edit Form

The form contains:

**Product details**
- Product name — required.
- SKU — required and unique.
- Description — optional.
- Package description — optional, for example `5 kg bag` or `12-unit box`.

**Classification**
- Categories — multi-select; zero or more categories.
- Suppliers — multi-select; zero or more suppliers.

**Pricing and stock rules**
- Current selling price — optional integer toman value.
- Empty means Not Set; zero means Free.
- Minimum stock level — whole number; default zero.
- Opening quantity — whole number; default zero, during creation only.
- Opening unit acquisition cost — required if opening quantity is positive.
- Opening supplier — optional and limited to suppliers linked to the product.

Show the fixed count unit `عدد`. For example, show `25 عدد` and display `5 kg bag` as supporting package information. Do not offer a kg/L/piece unit selector or fractional quantity input.

### 8.4. Product Form Behavior

- Validate SKU uniqueness without case sensitivity.
- Prevent negative or fractional stock values.
- Do not default an empty selling price to zero.
- If opening quantity is zero, hide or disable opening-cost fields and create no opening transaction.
- If opening quantity is positive, require unit acquisition cost.
- Save Product and Opening Stock atomically.
- Editing a product must not change current stock or historical price records.
- Do not allow a direct current-stock edit.

### 8.5. Product Details

Show the following sections:

**Product overview**
- Product name, SKU, description, package description.
- Current stock and stock status.
- Minimum stock threshold.
- Current selling price, with Not Set and Free states.

**Classification**
- All linked categories.
- All linked suppliers.

**Purchase price history**
- One latest-price row or card per supplier with valid purchase history, including historical suppliers no longer linked for new purchases.
- Supplier name.
- Latest unit purchase price.
- Supplier invoice date.
- Relative age, such as `3 days ago`.
- Link to the source Purchase Invoice Details.
- `No recorded purchase` when no valid invoice exists.
- Ignore voided invoices when calculating latest price.

**Inventory valuation**
- Current moving average cost per unit.
- Estimated current inventory value.
- Explain that this is acquisition value, not selling value.

**History**
- Recent inventory transactions for the product.
- Actions to edit product or record Stock OUT.

### 8.6. Product Removal

Use an Archive action, not a permanent delete, when history exists. Block archive while stock is greater than zero. Preserve invoice, sales mock, and transaction references.

## 9. Categories

### 9.1. Category List

Show category name, optional description, product count, and actions. Provide search when useful, Create Category, and an empty state.

### 9.2. Create/Edit

- Name is required and case-insensitively unique.
- Description is optional.
- Preserve form values when validation fails.
- Show success feedback after save.

### 9.3. Product Assignment

- A product can have multiple categories.
- A category can contain multiple products.
- Product forms must support multi-select category assignment.
- Category Details must show assigned products.
- Adding or removing an assignment must not change stock or pricing.

### 9.4. Delete

Block category deletion while one or more ProductCategory links exist. Explain that assignments must be removed first. Never silently reassign products.

## 10. Suppliers

### 10.1. Supplier List

Show supplier name, contact person, phone, email, linked-product count, and actions where data exists. Provide search and Create Supplier.

### 10.2. Supplier Details

Show:

- Supplier contact details.
- Linked products.
- Latest purchase price for each linked Product, when invoice history exists.
- Purchase invoice history.
- Link to Purchase Invoice Details.

Do not show payment status, supplier balance, purchase orders, or due dates.

### 10.3. Create/Edit Supplier

Name is required. Contact name, email, phone, address, and notes are optional. Validate email format only when a value is provided.

### 10.4. Product Linking

- A supplier can be linked to many products.
- A product can be linked to multiple suppliers.
- Prevent duplicate product-supplier links.
- Allow a supplier-product link to be created from Product form or Purchase Invoice flow.
- Do not store purchase price on the supplier-product link.

### 10.5. Delete

Block supplier deletion while it has ProductSupplier links or purchase invoice history. Explain the reason. Historical supplier snapshots must remain readable.

## 11. Purchase Invoices

### 11.1. Purpose

Purchase Invoices is the only regular Stock IN workflow. It records the supplier's invoice details, quantities received, and actual unit purchase prices. Posting an invoice increases stock and creates price history.

This page is not a purchase-order, payment, tax, accounts-payable, or supplier-balance module.

### 11.2. Purchase Invoice List

Show:

| Column | Meaning |
|---|---|
| Supplier | Supplier name snapshot |
| Invoice Number | Supplier invoice number, when provided |
| Invoice Date | Date printed on supplier invoice |
| Recorded At | Time the invoice was posted in Storix |
| Items | Number of product lines |
| Items Subtotal | Sum of quantity multiplied by unit purchase price |
| Status | Posted or Voided |
| Actions | View details; Void only when eligible |

Filters may include supplier, invoice date range, and status. Provide a New Purchase Invoice action.

### 11.3. Create Purchase Invoice Form

**Invoice details**
- Supplier — required.
- Invoice date — required.
- Invoice number — optional.
- Note — optional.

**Product lines**
- Product — required and must be linked to the selected supplier.
- Quantity — positive whole number.
- Unit purchase price — non-negative integer toman amount.
- Line subtotal — read-only calculation.
- Remove line action before posting.

Rules:

- At least one line is required.
- A product may appear once per invoice.
- If the selected product is not linked to the supplier, offer a way to add the supplier-product link before posting.
- Unit price must be the net merchandise price after any line-level discount and before tax.
- Do not include invoice-wide discount, tax, shipping, freight, or other charges.
- Label the total `Items Subtotal`, not `Invoice Total` or `Amount Due`.
- Do not show payment status or supplier balance.

### 11.4. Posting Confirmation

Before posting, show a review summary:

- Supplier.
- Invoice date and optional invoice number.
- Product lines, quantities, unit prices, and subtotals.
- Items Subtotal.
- Notice that posting updates stock and creates immutable price history.

The user must confirm the action. After confirmation, save invoice, items, Stock IN transactions, and inventory value changes as one logical operation.

### 11.5. Purchase Invoice Details

Show:

- Supplier snapshot and current supplier link when available.
- Invoice number and invoice date.
- Recorded time.
- Status.
- Item lines with product snapshots, quantities, unit prices, and subtotals.
- Items Subtotal.
- Related Stock IN transactions.
- Void reason and reversal transactions when voided.

The page must not show tax totals, shipping fees, payments, amount due, or supplier balances.

### 11.6. Invoice Immutability and Void Action

- Posted invoice fields and lines are read-only.
- Do not show Edit or Delete actions for a posted invoice.
- Show Void only when every source Stock IN transaction is the latest movement for its product.
- If void is blocked, explain that a later stock movement exists for one or more products.
- Void requires confirmation and a reason.
- Voiding creates one `PURCHASE_VOID` transaction per line and preserves original records.
- After void, show status `Voided` and retain the full history.
- Exclude voided invoices from latest purchase price projections.

## 12. Stock Operations

### 12.1. Purpose

The Stock Operations page records Stock OUT only. Stock IN is completed through Purchase Invoices.

### 12.2. Stock OUT Form

Fields:

- Product — active product only.
- Current stock — read-only.
- Quantity — positive whole number.
- Reason — Damage, Internal Use, Adjustment, or Other.
- Note — required for Adjustment and Other; optional for other reasons.

The form must show the projected quantity after the operation. It must reject a quantity greater than current stock.

### 12.3. Stock OUT Confirmation and Result

Before saving, show Product, current quantity, quantity to remove, resulting quantity, reason, and note. On success, create one Stock OUT transaction and update inventory value using Moving Weighted Average Cost.

On failure, keep the form values, do not alter stock, and show the error.

### 12.4. Stock Operation Constraints

- No separate manual Stock IN form.
- No Sale reason.
- No positive manual adjustment.
- No fractional quantities.
- No negative stock.
- Do not update Sales Analytics from Stock OUT.

## 13. Inventory Transactions

### 13.1. Transaction List

Display transaction type, product snapshot, quantity, before/after stock, date/time, reason, and related invoice when available.

Transaction types:

- Opening Stock.
- Stock IN.
- Stock OUT.
- Purchase Void.

### 13.2. Filters

Support filters by:

- Product.
- Transaction type.
- Date range.
- Supplier, where the transaction has a supplier snapshot.

Provide search by product name or SKU snapshot where practical.

### 13.3. Transaction Details

Show:

- Product name, SKU, and package snapshots.
- Type and quantity.
- Stock quantity before and after.
- Inventory value before and after.
- Unit purchase price or cost removed when relevant.
- Supplier snapshot when relevant.
- Related purchase invoice and invoice item when relevant.
- Reversed transaction reference for Purchase Void.
- Reason, note, and timestamp.

### 13.4. History Rules

Transactions are immutable. Do not show Edit or Delete actions. A correction must be represented by a supported compensating transaction. Product archive must not hide transaction history.

## 14. Settings

### 14.1. Supported Preferences

- Theme: Light, Dark, System.
- Table density: Comfortable, Compact.

### 14.2. Fixed Settings

- Currency is fixed to IRT / تومان.
- Stock quantity unit is fixed to countable items / packages.
- Do not add warehouse, account, role, online price provider, or synchronization settings.

### 14.3. Persistence

Save supported preferences in LocalStorage. Show a clear error if persistence fails. Do not show a fake server save state.

## 15. Reusable UI Components

### 15.1. Layout

- Application shell.
- Sidebar and mobile navigation drawer.
- Top bar.
- Page header and breadcrumbs.
- Responsive content grid.

### 15.2. Data Display

- KPI card.
- Status badge.
- Currency value.
- Quantity/package value.
- Data table with sorting and pagination.
- Empty state.
- Date range selector.
- Chart with tooltip and text alternative.

### 15.3. Inventory Components

- Product selector.
- Multi-select category selector.
- Multi-select supplier selector.
- Stock status indicator.
- Stock movement summary.
- Purchase invoice line editor.
- Purchase price history row.
- Invoice status indicator.
- Transaction detail panel.

### 15.4. Feedback Components

- Confirmation dialog.
- Field-level validation message.
- Success notification.
- Error notification.
- Disabled-action explanation.
- Loading skeleton for local page preparation when needed.

## 16. Interaction and Feedback Rules

### 16.1. Forms

- Mark required fields clearly.
- Keep labels visible; do not rely only on placeholders.
- Show validation beside the relevant field.
- Preserve entered values after validation errors.
- Disable submit while a save operation is in progress.
- Show success only after LocalStorage persistence succeeds.

### 16.2. Tables

- Use clear column headings and consistent value alignment.
- Keep sorting state visible.
- Show active filters and a clear-all action.
- Provide an empty state when no rows match.
- Keep important stock and price fields available on mobile, using a card layout when needed.

### 16.3. Destructive and Irreversible Actions

Require confirmation before Product archive, Category deletion, Supplier deletion, and Purchase Invoice void. The confirmation must describe the effect. A Purchase Invoice void confirmation must identify affected products and state that compensating transactions will be created.

Do not provide edit/delete actions for posted purchase invoices or inventory transactions.

### 16.4. Action Feedback

- Successful saves show a concise confirmation.
- Validation errors identify the field and corrective action.
- Persistence failures do not change displayed stock state.
- Blocked actions explain the exact rule that prevents them.
- Do not use color as the only feedback channel.

## 17. Data Presentation Rules

### 17.1. Stock Quantities

All quantities are whole counts of products or packages. Display the quantity with `عدد` and show package description separately. Never convert package count to weight or volume.

### 17.2. Currency

Display all money in IRT / تومان with integer values. Do not show decimal tomans or rial conversion.

### 17.3. Purchase Prices

- Show one latest price per Product-Supplier pair.
- Show supplier name, unit price, invoice date, and relative age.
- Derive relative age at display time.
- Ignore voided invoices.
- Show `No recorded purchase` when no valid invoice exists.
- Do not show a manual reference price.

### 17.4. Selling Price and Cost

- Null selling price = Not Set.
- Zero selling price = Free.
- Moving average cost = current acquisition cost per unit.
- Inventory value = current acquisition value of remaining stock.
- Do not use selling price to calculate inventory value.
- A selling-price versus latest-purchase-price comparison is indicative only, not actual profit.

### 17.5. Sales Data

Every Sales Analytics page and Dashboard sales widget must show a `Sample Data` label. Sales mock records do not update stock, and stock movements do not update sales metrics.

### 17.6. Dates

Show invoice date separately from invoice recorded time. Invoice date controls latest-price ordering. Transaction occurredAt controls inventory ledger order. Relative age is calculated from invoice date at display time.

## 18. Responsive Design

### 18.1. Desktop

- Persistent sidebar.
- Multi-column KPI layout.
- Full data tables.
- Page actions and filters visible.
- Purchase invoice line editor can use a table layout.

### 18.2. Tablet

- Collapsible sidebar.
- KPI cards adapt to width.
- Forms remain readable.
- Tables may scroll horizontally without hiding critical data.

### 18.3. Mobile

- Compact navigation drawer.
- Single-column page layout.
- Stacked KPI cards.
- Purchase invoice lines use stacked cards or a readable compact layout.
- Primary actions remain visible and touch-friendly.
- Destructive confirmation dialogs fit the viewport.
- Do not hide quantity, unit price, supplier, invoice date, or transaction status.

## 19. UI States

Every data-driven page must handle the states that apply to it.

### 19.1. Loading

Use a skeleton or progress indicator while local data is prepared. Do not imply a server request.

### 19.2. Empty

Examples:

- No Products exist: offer Create Product.
- No Suppliers exist: explain that a supplier is required before recording a purchase invoice.
- No Purchase Invoices exist: offer New Purchase Invoice.
- No inventory transactions exist: explain that opening stock and stock movements appear here.
- No sales data exists in the selected range: offer another range when possible.
- No purchase history exists for a supplier-product pair: show `No recorded purchase`.

### 19.3. Error

Show a useful message when LocalStorage data cannot be read or written. Do not silently reset data.

### 19.4. Success

Confirm product, category, supplier, invoice, stock, and settings actions only after persistence succeeds.

### 19.5. Validation

Show messages near invalid fields. Identify whole-number, price, relation, and date constraints.

### 19.6. Disabled and Blocked

Explain why an action is unavailable. Examples include product archive blocked by positive stock, supplier deletion blocked by invoice history, or invoice void blocked by later product movements.

## 20. Accessibility

- Provide sufficient contrast.
- Show visible keyboard focus.
- Support keyboard navigation for forms, menus, tables, selectors, and dialogs.
- Give every input an accessible label.
- Use meaningful button names.
- Do not use color alone for stock or invoice status.
- Provide text summaries or accessible tables for charts.
- Manage focus when dialogs open and close.
- Use semantic headings and table headers.
- Announce validation and save feedback to assistive technology.

## 21. Frontend and Data Presentation Boundaries

This is a UI/UX specification, not an architecture decision.

- Keep Sales Mock Data separate from editable inventory data.
- Keep business calculations out of presentational components.
- Reusable components must not contain hardcoded business sample rows.
- LocalStorage is the MVP persistence boundary.
- Routing, state management, form libraries, validation libraries, and folder structure belong to Frontend Architecture.
- No backend or external integration is required by this document.

## 22. UI/UX Acceptance Criteria

### 22.1. Application Shell

- [ ] Navigation includes all MVP pages and excludes sales orders and customer management.
- [ ] Active page is identifiable.
- [ ] Responsive navigation works on desktop, tablet, and mobile.

### 22.2. Dashboard and Sales Analytics

- [ ] Dashboard displays all four inventory KPIs using the approved formulas.
- [ ] Total Units in Stock counts packages/items, not package contents.
- [ ] Low-stock count includes zero-stock products when the threshold permits.
- [ ] Sales chart and product ranking use mock data and show Sample Data.
- [ ] Sales Analytics displays quantity, revenue, gross profit, gross margin, date range, and product comparisons.
- [ ] Sales data remains independent of inventory transactions.

### 22.3. Products, Categories, and Suppliers

- [ ] Product form supports multi-category and multi-supplier assignment.
- [ ] Product form supports package description, current selling price, minimum stock, and opening stock.
- [ ] Positive opening stock requires unit acquisition cost.
- [ ] Product details show latest purchase price per supplier, invoice date, and relative age.
- [ ] Null and zero selling prices display differently.
- [ ] Category and supplier deletion constraints are explained.
- [ ] Product archive is blocked while stock is positive and preserves history.

### 22.4. Purchase Invoices and Stock

- [ ] Purchase Invoice form captures supplier, invoice date, optional number/note, and one or more lines.
- [ ] Each line captures product, whole-number quantity, and unit purchase price in IRT.
- [ ] Items Subtotal is calculated correctly.
- [ ] No tax, freight, shipping, amount due, or payment status is shown.
- [ ] Posting creates one Stock IN transaction per line atomically.
- [ ] Posted invoice cannot be edited or deleted.
- [ ] Eligible invoice can be voided with reason and compensating transactions.
- [ ] Void is blocked when a later movement exists for any affected product.
- [ ] Stock OUT requires a reason and prevents negative stock.
- [ ] Transactions are immutable and preserve snapshots.

### 22.5. Quality

- [ ] All displayed money is IRT / integer tomans.
- [ ] All stock quantities are whole numbers.
- [ ] LocalStorage errors do not produce false success messages.
- [ ] Loading, empty, error, validation, success, and disabled states are handled.
- [ ] Keyboard, contrast, focus, and screen-reader requirements are met.

## 23. PRD Requirement Traceability

| PRD requirement | UI area |
|---|---|
| FR-01–FR-07 | Dashboard |
| FR-08–FR-16 | Products |
| FR-17–FR-20 | Categories |
| FR-21–FR-25 | Suppliers |
| FR-26–FR-32 | Stock Operations and Product Form |
| FR-33–FR-38 | Transactions and Transaction Details |
| FR-39–FR-43 | Sales Analytics |
| FR-44–FR-45 | Settings |
| FR-46–FR-49 | Purchase Invoice List, Form, and Details |
| FR-50–FR-52 | Product Details, Purchase Price History, Dashboard |
| FR-53–FR-54 | Purchase Invoice Details and Transactions |

## 24. Future Considerations

The following items are not MVP commitments: real sales, sales orders, customers, sales invoices, payment processing, purchase orders, supplier balances, tax accounting, invoice-wide freight allocation, multiple warehouses, barcode scanning, notifications, authentication, roles, backend integration, cloud synchronization, export, and scheduled reports.

A future feature must be approved in the PRD before it is added to this specification.

## 25. Document Control

| Property | Value |
|---|---|
| Document | Storix UI/UX Specification |
| Version | 1.2 |
| Status | Draft for Documentation Review |
| Primary Reference | `docs/PRD.md` |
| Business Rules | `docs/BUSINESS_RULES_AND_DATA_MODEL.md` |
| Next Step | Documentation Review across the three specification documents. |

## 26. Change Log

| Version | Date | Changes |
|---|---|---|
| 1.2 | 2026-11-11 | Added Purchase Invoice list, form, details, posting, and constrained void flows. Added supplier-specific latest purchase-price display, current selling price semantics, Moving Weighted Average presentation, IRT formatting, and count-based stock UI. Aligned all MVP pages and excluded workflows with PRD v2.1. |
| 1.1 | 2026-11-10 | Previous UI/UX baseline aligned with PRD v2.0. |