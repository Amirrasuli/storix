# Storix — UI/UX Specification

**Document:** UI/UX Specification  
**Version:** 1.2  
**Status:** Draft for cross-document review — not approved for implementation  
**Last Updated:** 2026-11-11  
**Primary Reference:** [`PRD.md`](./PRD.md)  
**Business Rules:** [`BUSINESS_RULES_AND_DATA_MODEL.md`](./BUSINESS_RULES_AND_DATA_MODEL.md)

---

## 1. Introduction

### 1.1. Purpose

This document defines the user interface and user experience requirements for the Storix MVP.

It describes:

- Application navigation and page structure.
- The content and behavior of each MVP page.
- Product, category, supplier, purchase invoice, and stock-removal forms.
- Tables, filters, reusable interface components, and page states.
- Responsive behavior and accessibility requirements.
- Data presentation rules that follow the PRD and Business Rules document.

This document does not define the frontend folder structure, state management library, final component architecture, backend, or server database.

### 1.2. Product Overview

Storix is a general-purpose inventory management application with sales analytics.

The MVP has two separate data areas:

1. **Inventory management:** Interactive Products, Categories, Suppliers, Purchase Invoices, Stock OUT operations, and inventory transaction history.
2. **Sales Analytics:** Read-only presentation of simulated sales information.

The MVP is frontend-focused, single-user, and single-warehouse. It has no backend, server database, authentication, or external business integrations. Editable inventory data is stored in browser LocalStorage. Sales Analytics uses static mock data.

### 1.3. Design Goals

The interface must:

- Make current inventory status easy to understand.
- Make incoming stock traceable to a supplier invoice.
- Show the latest purchase price separately for each linked supplier.
- Show the current selling price separately from historical purchase prices.
- Make product and stock operations clear and efficient.
- Keep inventory transactions traceable.
- Present sales information without implying that Storix processes real sales.
- Keep sales mock data separate from editable inventory records.
- Use consistent page layouts and interaction patterns.
- Give clear feedback after user actions.
- Support desktop, tablet, and mobile screens.

### 1.4. Document Authority

The PRD defines product scope and functional requirements. Business Rules defines domain rules, data relationships, validation, and calculations. This document defines the user-facing presentation and interaction behavior.

A UI decision must not change a business rule. If the documents conflict, record the conflict and resolve it across the documents before implementation. Do not use this document to approve an open product-owner decision.

## 2. MVP Scope

### 2.1. Included Modules

| Module | Purpose | Data source |
|---|---|---|
| Dashboard | Summary of inventory status and selected sales indicators | Local inventory data + sales mock data |
| Sales Analytics | Read-only sales quantity, revenue, charts, and product comparisons | Static sales mock data |
| Products | Manage product catalog, package description, selling price, and relationships | LocalStorage |
| Categories | Manage product categories | LocalStorage |
| Suppliers | Manage supplier records and related products | LocalStorage |
| Purchase Invoices | Record supplier documents and receive stock | LocalStorage |
| Stock OUT | Record non-sale stock removal | LocalStorage |
| Inventory Transactions | Review stock movement history | LocalStorage |
| Settings | Manage basic display preferences | LocalStorage |

There is no standalone manual Stock IN form. The Purchase Invoice flow is the Stock IN flow.

### 2.2. Product Constraints

| Constraint | UI/UX implication |
|---|---|
| One warehouse | Do not show warehouse selection or multi-warehouse stock views. |
| One local user | Do not show sign-in, registration, user roles, permissions, or user administration. |
| No backend | Do not present server integrations or server-dependent workflows as MVP features. |
| LocalStorage | Explain that data stays in the current browser profile and does not sync between devices. |
| Sales mock data | Clearly label Sales Analytics as sample or simulated data. |
| One stock unit | Display quantities as `عدد` or with the product package description. Do not show unit conversion. |
| Currency | Display all money as تومان. Do not show a currency selector. |
| General-purpose product | Do not make industry-specific workflows mandatory. |
| Purchase invoice | Treat invoice posting as an inventory receipt. Do not imply payment, accounting, or purchase-order management. |

### 2.3. Excluded Pages and Actions

Do not show these as implemented MVP features:

- Sales order creation or management.
- Customer management or customer details.
- Real sales transactions.
- Sales invoice creation or payment processing.
- Purchase order management.
- Supplier balances or payments.
- Shipment management.
- Invoice-level tax, discount, shipping, or other charge allocation until D-05 is approved.
- Posted Purchase Invoice edit, delete, void, or reversal actions until D-07 is approved.
- General inventory transaction edit, delete, or reversal actions until D-08 is approved.
- Authentication, user profiles, and role management.
- Multi-warehouse workflows.
- Barcode scanning.
- Advanced analytics and report exports.

## 3. Users and Main Tasks

### 3.1. Design Personas

These personas are design references, not account types or permission levels.

| Persona | Main task |
|---|---|
| Business Owner | Review inventory status and sales indicators. |
| Inventory Operator | Manage products, suppliers, purchase invoices, and Stock OUT operations. |
| Sales Viewer | Review simulated sales quantities, revenue, and product performance. |

All features are available in one local user context.

### 3.2. Main User Tasks

A user must be able to:

1. Review inventory and sales summaries on the Dashboard.
2. Review sales mock data for a selected date range.
3. Create and maintain products, categories, and suppliers.
4. Assign multiple categories and suppliers to a product.
5. Record opening stock during product creation, subject to the approved opening-cost rule.
6. Record received stock by posting a Purchase Invoice.
7. Record Stock OUT with an approved reason.
8. Review current stock levels and low-stock products.
9. Review supplier-specific latest purchase prices.
10. Find and review inventory transactions and posted purchase invoices.
11. Change supported application display preferences.

## 4. Information Architecture and Navigation

### 4.1. Primary Navigation

Use a persistent sidebar on desktop. Group the MVP destinations as follows:

| Group | Navigation item | Destination |
|---|---|---|
| Overview | Dashboard | `/` |
| Analytics | Sales Analytics | `/sales-analytics` |
| Inventory | Products | `/products` |
| Inventory | Categories | `/categories` |
| Inventory | Suppliers | `/suppliers` |
| Inventory | Purchase Invoices | `/purchase-invoices` |
| Inventory | Stock OUT | `/stock-out` |
| Inventory | Transactions | `/transactions` |
| General | Settings | `/settings` |

The route names are proposed UI routes. Frontend Architecture may adjust route structure, but page responsibilities must remain the same.

### 4.2. Navigation Rules

- Make the active navigation item visually clear.
- Use plain-language labels.
- Provide access to all MVP modules.
- Use breadcrumbs where they help show page hierarchy.
- Do not show links to excluded modules.
- On mobile, use a collapsible drawer or another compact navigation pattern.
- Do not include a user profile menu.
- Do not create a separate Stock IN destination. The Purchase Invoice page is the entry point for incoming stock.

## 5. Dashboard

### 5.1. Purpose

The Dashboard gives the user a short overview of current inventory and selected sales information.

It must not imply that sales values come from real transactions entered into Storix.

### 5.2. Inventory Summary

Display these inventory metrics:

- Total Products.
- Total Units in Stock.
- Low-Stock Products.
- Estimated Inventory Value only after D-01, D-04, and D-05 are approved.

For Estimated Inventory Value, use a clear unavailable or hidden state while its calculation is blocked. Never display zero when the cost is unknown.

### 5.3. Sales Summary and Trend

Display sales mock data for the selected date range.

Requirements:

- Show sales information for the active date range.
- Provide readable axis labels and tooltips.
- Identify the information as sample or simulated data.
- Keep sales values separate from inventory records and transactions.
- Handle an empty or unavailable mock dataset.
- Do not calculate historical revenue from the current Product selling price.

### 5.4. Recent Inventory Transactions

Show the latest inventory transactions, including:

- Transaction date and time.
- Product name or historical product label.
- Transaction type.
- Quantity.
- A link to transaction details.

Do not show sales orders or recent orders.

### 5.5. Best-Selling Products

Display best-selling products using sales mock data. The default ranking is by revenue, descending. Clearly label the metric and the mock-data source.

### 5.6. Dashboard Interactions

- Clicking a Product metric or list item may open the Product list with a relevant filter.
- Clicking a transaction opens its details.
- Changing the sales date range updates all date-dependent sales widgets.
- Do not make inventory cards change the sales mock data.

## 6. Sales Analytics

### 6.1. Purpose

Sales Analytics presents read-only sample sales information. It does not create sales records or process sales.

### 6.2. Sales Metrics

Display:

- Sales quantity for the selected date range.
- Sales revenue for the selected date range.
- Product performance comparisons.
- Gross Profit and Gross Margin only after the product owner confirms their visible inclusion in the MVP.

Use the definitions and formulas in Business Rules. Do not use current Product selling price or Stock OUT transactions to build historical sales totals.

### 6.3. Date-Range Selection

Provide quick ranges:

- Last 7 days.
- Last 30 days.
- Last 90 days.
- Last 12 months.

A custom date range may be provided.

Date rules:

- Use browser-local calendar dates.
- Include today in quick ranges.
- Include both selected dates in a custom range.
- Do not allow the start date to be after the end date.
- Use the same range for all Sales Analytics widgets.
- Do not include future dates in the current reporting period.

### 6.4. Charts and Comparisons

- Use clear labels and tooltips.
- Identify the compared metric, such as `Revenue (تومان)` or `Quantity (عدد)`.
- Display product/package context for quantity comparisons.
- Keep empty and invalid states clear.
- Do not label mock records as confirmed orders or payments.

### 6.5. Sales Analytics Interactions

- Date-range changes update all date-dependent metrics and charts.
- Tooltips show the value represented by a chart element.
- Comparison controls state which metric is selected.
- Empty data or invalid ranges show a clear message.
- All Sales Analytics interactions are read-only.

## 7. Products

### 7.1. Purpose

The Products module provides access to the product catalog, current stock, selling price, category assignments, supplier links, and supplier-specific purchase-price history.

### 7.2. Product List

The page must provide:

- Page title and short description.
- Primary action to create a Product.
- Search by product name and SKU.
- Category and stock-status filters.
- Product table.
- Sorting controls.
- Pagination.
- Empty state when no products exist.

### 7.3. Product Table

Use these columns where the viewport allows:

| Column | Description |
|---|---|
| Product | Product name and optional package description. |
| SKU | Unique product identifier. |
| Category | Assigned category labels; use a compact count or overflow treatment when there are many. |
| Stock | Current whole-number quantity with `عدد` or package context. |
| Minimum Stock | Configured low-stock threshold. |
| Status | In Stock, Low Stock, or Out of Stock. |
| Selling Price | Current selling price in تومان, or `Not set`. |
| Actions | View, edit, and delete. |

Do not show one ambiguous purchase-price column on the Product table when a Product can have several Suppliers. Show supplier-specific prices in Product Details.

### 7.4. Search, Filter, Sort, and Pagination

The Product list must support:

- Search by product name.
- Search by SKU.
- Filter by one or more categories.
- Filter by stock status.
- Sort by product name, stock quantity, and selling price when the value is set.
- Pagination for long lists.
- Clearing active filters.

### 7.5. Create and Edit Product

The form must include:

| Field | Requirement |
|---|---|
| Product name | Required. |
| SKU | Required and unique. |
| Description | Optional. |
| Package description | Optional. Describes one countable item/package. |
| Categories | Multi-select. Zero, one, or multiple categories are allowed. |
| Suppliers | Multi-select. Zero, one, or multiple suppliers are allowed. |
| Selling price | Integer toman value or Not set. Zero behavior depends on D-03. |
| Minimum stock | Non-negative whole number. Default depends on D-02. |
| Stock unit | Fixed to `عدد`. Do not show an editable unit selector. |
| Opening stock | Non-negative whole number. Default is zero. |
| Opening unit cost | Show when opening stock is greater than zero, subject to D-04. |
| Opening supplier | Optional when known; must be linked to the Product if selected. |

Do not provide a direct editable current-stock field. Opening stock is a one-time initial movement.

When opening stock is greater than zero, explain that saving the Product will also create one opening-stock transaction. Apply the final cost requirement only after D-04 is approved.

If saving the Product or opening transaction fails, keep the form open and do not report success.

### 7.6. Product Details

Show these sections:

**Product information**

- Product name and SKU.
- Description and package description, when provided.
- Assigned categories.
- Current selling price, or `Not set`.

**Inventory status**

- Current stock quantity.
- Minimum stock threshold.
- Stock status.
- Actions for Stock OUT and purchase invoice creation.

**Suppliers and purchase-price history**

For each linked Supplier, show:

- Supplier name.
- Supplier product code, when available.
- Latest recorded unit purchase price, when invoice history exists.
- Invoice date.
- Relative age of the invoice date.
- `No recorded purchase` when there is no invoice line for the pair.

Do not show an unlabelled latest purchase price. A product may have several supplier prices.

**Recent inventory history**

Show recent inventory transactions for this Product. Keep this history readable after Product deletion or edits.

Do not include Sales Orders, customer data, or real sales history.

### 7.7. Delete Product

- Ask for confirmation.
- State that the Product can be deleted only when current stock is zero.
- Block deletion while stock is positive.
- Explain that historical transactions and purchase invoice records remain.
- Do not silently remove historical records.

## 8. Categories

### 8.1. Purpose

Categories group Products for navigation and filtering.

### 8.2. Category List

Provide:

- Page title.
- Create Category action.
- Category list or table.
- Product count for each Category.
- Edit and delete actions.
- Empty state.

### 8.3. Create and Edit Category

- Category name is required.
- Description is optional.
- Enforce uniqueness without case sensitivity after trimming.
- Show field-level validation.
- Keep entered values when validation fails.

### 8.4. Delete Category

- Ask for confirmation.
- Show the number or names of linked Products where useful.
- Block deletion while ProductCategory links exist.
- Ask the user to remove category assignments first.
- Do not silently remove or reassign Products.

## 9. Suppliers

### 9.1. Purpose

The Suppliers module maintains supplier contact information and shows which products can be purchased from each supplier.

### 9.2. Supplier List

Provide:

- Page title.
- Create Supplier action.
- Supplier list or table.
- Search by supplier name and available contact fields.
- Related product count.
- Edit, view, and delete actions.
- Empty state.

### 9.3. Supplier Details

Show:

- Supplier name.
- Contact name, email, phone, address, and notes when available.
- Related Products.
- Latest recorded purchase price and invoice date for each related Product, when available.
- Link to Purchase Invoice history for this Supplier.

Do not show purchase orders, balances, payments, or accounts-payable data.

### 9.4. Create and Edit Supplier

- Supplier name is required.
- Other contact fields are optional.
- Validate email format when an email is provided.
- Store phone as text.
- Show success and error feedback.

### 9.5. Delete Supplier

- Ask for confirmation.
- Block deletion while ProductSupplier links exist.
- Block deletion when Purchase Invoice history exists.
- Explain that historical invoices need the Supplier record to remain readable.
- Do not cascade-delete invoice history.

## 10. Purchase Invoices and Stock IN

### 10.1. Purpose

The Purchase Invoices module records a supplier document and receives stock into the one Storix warehouse.

This is the only Stock IN flow in the MVP. It is not a purchase order, supplier payment, accounting, or sales invoice workflow.

### 10.2. Purchase Invoice List

Provide:

- Page title and short description.
- Primary action: `Record Purchase Invoice`.
- Search by supplier name or invoice number.
- Filter by supplier and invoice date range, where practical.
- List or table of posted invoices.
- Empty state.

Suggested columns:

| Column | Description |
|---|---|
| Invoice Date | Date printed on the supplier document. |
| Invoice Number | Supplier invoice number, or `—`. |
| Supplier | Supplier name snapshot. |
| Items | Number of product lines. |
| Products Subtotal | Sum of line amounts before any invoice-level adjustments. Do not label as final payable total while D-05 is open. |
| Recorded At | Date/time when Storix posted the invoice. |
| Action | Open read-only details. |

### 10.3. Create Purchase Invoice Form

**Invoice details**

- Supplier: required, select one Supplier.
- Invoice date: required, valid calendar date.
- Invoice number: optional.
- Note: optional.

**Product lines**

Each line must include:

- Product selection.
- Current stock quantity for context.
- Quantity received as a positive whole number.
- Unit purchase price in integer tomans.
- Derived line amount.
- Remove-line action before posting.

Rules:

1. At least one product line is required.
2. Do not allow the same Product twice on one invoice.
3. Only show Products linked to the selected Supplier.
4. If a needed Product is not linked, provide a clear path to add the Product-Supplier link before posting. Do not silently create a relationship.
5. Do not include invoice-level discounts, taxes, shipping, or other charges until D-05 is approved.
6. Label the sum of line amounts as a product subtotal, not as final invoice payable amount.
7. Show a clear summary of the stock quantities that will be received.

### 10.4. Posting Confirmation

Before posting, show a confirmation summary:

- Supplier.
- Supplier invoice date and number, when available.
- Product lines.
- Quantity received per Product.
- Unit purchase price and line amount.
- Total units that will be added to stock.

The confirmation must explain that posting will update inventory and create transaction records. The user must confirm the action.

### 10.5. Save and Failure Behavior

On successful posting:

1. Save the Purchase Invoice header.
2. Save all invoice lines.
3. Create exactly one Stock IN transaction for each line.
4. Update the affected Product stock quantities.
5. Persist all related changes as one logical operation.
6. Show success feedback and open invoice details or return to the invoice list.

During save:

- Disable the submit action to prevent duplicate submission.
- Do not report success before persistence succeeds.
- If validation or persistence fails, keep the entered form values and show a useful error.
- Do not leave a saved invoice without all its lines and Stock IN transactions.

### 10.6. Purchase Invoice Details

Show:

- Supplier name snapshot.
- Invoice date.
- Invoice number, when available.
- Recorded date and time.
- Note, when available.
- Product lines with product-name snapshot, SKU snapshot, package snapshot, quantity, unit purchase price, and line amount.
- Total units received.
- Product subtotal before any invoice-level adjustments.

Posted invoice details are read-only in this draft. Do not show Edit, Delete, Void, or Reverse actions until D-07 is approved.

## 11. Stock OUT

### 11.1. Purpose

Stock OUT records the removal of units from available inventory for a non-sale reason.

It does not record a sale and does not update Sales Analytics.

### 11.2. Stock OUT Form

The form must include:

- Product selection.
- Current available quantity.
- Quantity to remove.
- Reason, using the approved D-06 values.
- Optional note.

Proposed reason values are:

| Value | Display label |
|---|---|
| `DAMAGE` | Damaged |
| `INTERNAL_USE` | Internal use |
| `ADJUSTMENT` | Stock adjustment |
| `OTHER` | Other |

Do not include `SALE`.

The list above remains proposed until D-06 is approved. The reason field and its final labels must not be treated as final before approval.

### 11.3. Validation

- Product is required.
- Quantity must be a positive whole number.
- Quantity must not exceed available stock.
- Resulting stock must not be negative.
- Reason is required after D-06 is approved.
- Note is optional.

### 11.4. Successful Submission

1. Decrease the Product stock quantity.
2. Create exactly one Stock OUT transaction.
3. Keep the transaction immutable.
4. Show success feedback.
5. Update visible stock and transaction lists.
6. Do not change Sales Analytics data.

On failure, keep the form open and explain the problem. Do not change stock or create a transaction.

## 12. Inventory Transactions

### 12.1. Purpose

The Transactions module provides a traceable history of inventory movements. It contains Opening Stock, Stock IN from Purchase Invoice lines, and Stock OUT records.

It does not contain sales orders or real sales transactions.

### 12.2. Transaction List

Provide:

- Page title and short description.
- Transaction type filter.
- Product filter.
- Search where useful.
- Transaction list or table.
- Pagination when needed.
- Empty state.

Suggested columns:

| Column | Description |
|---|---|
| Date | Transaction date and time. |
| Product | Product name snapshot. |
| SKU | SKU snapshot. |
| Type | Opening Stock, Stock IN, or Stock OUT. |
| Quantity | Quantity moved, shown as a whole number. |
| Before | Quantity before movement. |
| After | Quantity after movement. |
| Source | Purchase Invoice reference for Stock IN, when applicable. |
| Reason | Approved reason for Stock OUT. |
| Action | Open transaction details. |

### 12.3. Filters

- Filter by transaction type.
- Filter by Product.
- Combine filters.
- Clear active filters.
- A date filter is optional and must be implemented only if it can use the transaction timestamp rules consistently.

### 12.4. Transaction Details

Show the available information:

- Transaction type.
- Product name and SKU snapshots.
- Package description snapshot, when available.
- Quantity.
- Quantity before and after.
- Date and time.
- Supplier and Purchase Invoice reference for invoice-based Stock IN.
- Unit purchase price when stored and applicable.
- Stock OUT reason when applicable.
- Note, when provided.

Details must remain readable after the related Product or Supplier changes or is deleted.

### 12.5. Transaction History Rules

- Every stock movement must be traceable.
- Opening stock appears as a transaction when initial quantity is positive.
- Every Purchase Invoice line creates one Stock IN transaction.
- Posted transactions cannot be edited or deleted.
- Deleting a Product must not delete its historical transactions.
- Historical records must not be presented as confirmed sales.

## 13. Settings

### 13.1. Purpose

Settings provides basic local display preferences only. It does not provide account settings or user management.

### 13.2. MVP Preferences

| Preference | Options | Default | Effect |
|---|---|---|---|
| Theme | Light, Dark, System | System | Visual presentation only. |
| Table Density | Comfortable, Compact | Comfortable | Table spacing only. |

Currency is fixed to IRT/toman. Do not add a currency selector.

## 14. Reusable Interface Components

These are conceptual component responsibilities. Final component names and composition belong to Frontend Architecture.

### 14.1. Layout Components

- `AppSidebar`
- `Topbar`
- `PageContainer`
- `PageHeader`
- `Breadcrumbs`

### 14.2. Data Display Components

- `DataTable`
- `SearchInput`
- `FilterControl`
- `FilterChip`
- `Pagination`
- `EmptyState`
- `LoadingState`
- `ErrorState`

### 14.3. Dashboard and Analytics Components

- `InventorySummaryCard`
- `SalesMetricCard`
- `SalesTrendChart`
- `TopProductsList`
- `ProductPerformanceComparison`
- `RecentTransactionsTable`

Do not create `RecentOrdersTable` or order-status components for the MVP.

### 14.4. Inventory Components

- `StockStatusBadge`
- `TransactionTypeBadge`
- `ProductForm`
- `CategoryForm`
- `SupplierForm`
- `ProductSupplierSelector`
- `CategoryMultiSelect`
- `PurchaseInvoiceForm`
- `PurchaseInvoiceLineEditor`
- `StockOutForm`
- `TransactionDetails`
- `PurchaseInvoiceDetails`
- `SupplierPurchasePriceList`

### 14.5. Feedback Components

- `Tooltip`
- `Modal`
- `ConfirmationDialog`
- `ToastNotification`
- `InlineValidationMessage`

Components must support accessible interaction and predictable behavior. Do not add loading indicators for synchronous operations unless they represent a real pending state.

## 15. Interaction and Feedback Rules

### 15.1. Forms

- Every input must have a visible label.
- Identify required fields.
- Explain how to correct validation errors.
- Preserve valid values after validation failure.
- Prevent submit when required validation fails.
- Prevent duplicate submission.
- Show success feedback only after data is saved.
- Show an error when validation or persistence fails.

### 15.2. Tables

- Keep important information easy to scan.
- Align numeric values consistently.
- Use clear sort and filter labels.
- Show active filters and allow the user to clear them.
- Provide a useful empty-results state.
- Keep row actions understandable.

### 15.3. Destructive Actions

- Require confirmation before deleting a Product, Category, or Supplier.
- State which record will be deleted.
- Explain why deletion is blocked when a business rule prevents it.
- Explain that Product history and purchase invoices remain after Product deletion.
- Do not perform unapproved cascading deletes.
- Do not show destructive actions for posted Purchase Invoices in this draft.
- Do not show edit, delete, undo, or reversal actions for posted inventory transactions in this draft.

### 15.4. Action Feedback

Provide clear feedback for:

- Successful create, update, and delete operations.
- Successful Purchase Invoice posting.
- Successful Stock OUT.
- Validation errors.
- Persistence failures.
- Empty search results.
- Unsaved form changes, where relevant.

## 16. Data Presentation Rules

### 16.1. Stock Status

Let `Q` be current stock and `M` be the Product minimum stock threshold.

| Display status | Condition | Notes |
|---|---|---|
| Out of Stock | `Q = 0` | Use this visible label when no units are available. |
| Low Stock | `Q > 0` and `Q <= M` | Show the threshold where useful. |
| In Stock | `Q > M` | Normal available state. |

Dashboard Low-Stock Products uses `Q <= M` and includes zero-stock Products. The visible status for zero stock remains `Out of Stock`.

The default minimum stock value is pending D-02.

### 16.2. Numeric Values

- Use whole-number quantities only.
- Display `عدد` or the product package description.
- Do not show decimal quantity inputs.
- Use consistent number formatting.
- Reject negative and invalid numeric values.

### 16.3. Currency and Prices

- Display money as تومان.
- Format integer toman amounts consistently.
- Do not convert toman to rial.
- Show selling price as the current Product price.
- Show purchase price with its Supplier and invoice date.
- Do not show a single ambiguous latest purchase price for a Product with multiple Suppliers.
- Show `Not set` for a null selling price.
- Do not settle the zero-price validation until D-03 is approved.

### 16.4. Purchase Invoice Amounts

- Display unit purchase price and line amount.
- Label a sum of invoice line amounts as `Products Subtotal` or equivalent.
- Do not label that subtotal as final payable amount until D-05 is approved.
- Do not show invoice tax, discount, shipping, or additional charge fields before their rules are approved.

### 16.5. Sales Data

- Identify Sales Analytics as sample or simulated data.
- Keep sales data visually distinct from inventory transactions.
- Do not show Stock OUT as a sale.
- Use one selected date range across all sales widgets.
- Use the Business Rules formulas for any displayed derived metrics.
- Do not display Gross Profit or Gross Margin as committed MVP cards until their visible inclusion is confirmed.

### 16.6. Relative Purchase-Price Age

For each Product-Supplier latest purchase record, show the invoice date and a relative age such as `3 days ago` or `2 months ago`. Calculate the relative age from the invoice date at display time. Do not store the relative phrase as historical data.

## 17. Responsive Behavior

### 17.1. Desktop

- Use a persistent sidebar.
- Use multi-column dashboard layouts where space allows.
- Display full data tables.
- Keep primary actions and filters easy to access.

### 17.2. Tablet

- Allow the sidebar to collapse.
- Adapt dashboard cards to the available width.
- Keep forms readable.
- Adapt tables without hiding essential stock or price information.

### 17.3. Mobile

- Use compact navigation.
- Use single-column page layouts.
- Stack KPI cards.
- Use horizontally scrollable tables only when a card layout is not suitable.
- Keep primary actions visible and touch-friendly.
- Ensure forms and dialogs fit the viewport.
- Do not remove essential transaction, supplier, or purchase-price context.

## 18. UI States

Every data-driven page must define applicable states:

| State | Required behavior |
|---|---|
| Initial empty state | Explain what data is missing and provide a relevant next action. |
| Empty search result | Explain that no records match the current query or filters. |
| Validation error | Identify the field and explain how to fix the value. |
| Save success | Confirm only after persistence succeeds. |
| Save failure | Preserve user input and explain that data was not saved. |
| Disabled action | Explain the business rule that prevents the action. |
| Unavailable calculation | Explain that the calculation is not available until its business rule is approved. |

Do not display a fake loading state for an operation that completes synchronously.

## 19. Accessibility Requirements

- Use sufficient color contrast.
- Show a visible keyboard focus indicator.
- Support keyboard navigation for all interactive controls.
- Use accessible labels for form fields.
- Use meaningful button and link text.
- Do not use color as the only way to communicate stock or transaction status.
- Give charts a text summary or accessible data alternative.
- Manage focus in dialogs and support keyboard closing where appropriate.
- Use semantic page headings and table headers.

## 20. Frontend and Data Presentation Considerations

This section records UI constraints. It does not make final architecture decisions.

- Keep page-level behavior separate from shared presentation components.
- Define Product, Category, Supplier, ProductSupplier, PurchaseInvoice, PurchaseInvoiceItem, InventoryTransaction, AppSettings, and SalesMockEntry types in the relevant architecture phase.
- Keep SalesMockEntry separate from editable inventory data.
- Do not place sample records directly inside reusable UI components.
- Keep the interface independent from the LocalStorage implementation details.
- Use one shared money-formatting rule and one shared quantity-formatting rule.
- Do not implement a business calculation that is still marked as pending in Business Rules.
- Final choices for routing, state management, forms, validation, data access, and folder structure belong to Frontend Architecture.

## 21. Decisions Required Before Final Implementation

These items are open in Business Rules. This UI document records their impact but does not approve them.

| ID | Topic | UI impact | Required action |
|---|---|---|---|
| D-01 | Inventory valuation method | Estimated Inventory Value KPI and Stock OUT cost details | Hide or mark the calculation unavailable until approved. |
| D-02 | Default minimum stock | Product create/edit default and low-stock behavior | Confirm the default value. |
| D-03 | Zero selling price | Product selling-price validation and display | Confirm whether zero is allowed only for intentionally free products. |
| D-04 | Opening stock cost | Product creation form and opening transaction details | Confirm whether positive opening stock requires a unit acquisition cost. |
| D-05 | Invoice-level adjustments | Purchase Invoice form, line-price wording, and cost values | Confirm how discounts, taxes, shipping, and other charges are handled. |
| D-06 | Stock OUT reasons | Stock OUT reason field and validation | Confirm the allowed reason list. |
| D-07 | Purchase Invoice correction | Purchase Invoice details actions | Confirm whether posted invoices are read-only in the MVP or need a reversal workflow. |
| D-08 | Inventory transaction correction | Transaction details and stock correction actions | Confirm whether the MVP excludes transaction correction or needs a dedicated adjustment/reversal workflow. Do not use a manual Stock IN to reverse Stock OUT. |

Other display choices:

- Confirm whether Gross Profit and Gross Margin appear as visible Sales Analytics metrics.
- Confirm final pagination defaults during UI design. These defaults do not change business data rules.

## 22. UI/UX Acceptance Criteria

The UI/UX work for the MVP is complete when the following items are satisfied.

### 22.1. Application Shell

- [ ] The application has a consistent sidebar, top bar, and main content area.
- [ ] Navigation contains only MVP destinations.
- [ ] The current page is identifiable.
- [ ] No user profile, authentication, customer, sales order, payment, or purchase order navigation is present.
- [ ] There is a Purchase Invoices destination for stock receipts.
- [ ] There is no separate manual Stock IN destination.
- [ ] The layout works on desktop, tablet, and mobile.

### 22.2. Dashboard and Sales Analytics

- [ ] Dashboard displays Total Products.
- [ ] Dashboard displays Total Units in Stock.
- [ ] Dashboard displays Low-Stock Products using the Business Rules threshold calculation.
- [ ] Estimated Inventory Value is hidden or marked unavailable until D-01, D-04, and D-05 are approved.
- [ ] Dashboard displays sales charts using mock data.
- [ ] Dashboard displays recent inventory transactions.
- [ ] Dashboard displays best-selling products using mock data.
- [ ] Sales Analytics displays sales quantity and sales revenue for a selected date range.
- [ ] Sales Analytics displays charts and product comparisons.
- [ ] Gross Profit and Gross Margin appear only after product-owner confirmation.
- [ ] Sales mock data is clearly identified and remains separate from inventory transactions.
- [ ] No real order, customer, sales invoice, or payment workflow is presented as an MVP feature.

### 22.3. Products, Categories, and Suppliers

- [ ] Product list supports create, view, update, and rule-based delete actions.
- [ ] Product list supports search, category and stock filters, sorting, and pagination.
- [ ] Product form supports package description and current selling price.
- [ ] Product form supports multiple category assignments.
- [ ] Product form supports multiple supplier links.
- [ ] Product stock unit is fixed and displayed as `عدد`.
- [ ] Product details show current stock and supplier-specific latest purchase-price history.
- [ ] Product details show `No recorded purchase` when a supplier has no invoice history.
- [ ] Category deletion is blocked while Product links exist.
- [ ] Supplier details show related Products and their latest supplier-specific purchase prices.
- [ ] Supplier deletion is blocked while product links or invoice history exist.
- [ ] Product deletion is blocked while stock is positive.
- [ ] Historical transactions and invoice records remain readable after Product deletion.

### 22.4. Purchase Invoices and Stock IN

- [ ] Purchase Invoice list supports opening posted invoice details.
- [ ] Purchase Invoice form requires one Supplier, a valid invoice date, and at least one line.
- [ ] Invoice number and note are optional.
- [ ] Each line requires a Product, positive whole-number quantity, and integer-toman unit purchase price.
- [ ] The Product must be linked to the selected Supplier.
- [ ] Duplicate Product lines are prevented.
- [ ] The form clearly shows the total stock quantity that will be received.
- [ ] The line sum is labelled as a product subtotal, not a final payable total while D-05 is open.
- [ ] Posting confirmation explains the inventory effect.
- [ ] Each invoice line creates exactly one Stock IN transaction.
- [ ] Invoice, lines, transactions, and stock changes are saved as one logical operation.
- [ ] A persistence failure does not leave partial data.
- [ ] Posted invoice details are read-only until D-07 is approved.

### 22.5. Stock OUT and Transactions

- [ ] Stock OUT form shows the selected Product and current available quantity.
- [ ] Stock OUT quantity must be a positive whole number.
- [ ] Quantity greater than available stock is rejected.
- [ ] Stock OUT reason follows the approved D-06 values.
- [ ] Successful Stock OUT creates exactly one transaction.
- [ ] Stock OUT does not update Sales Analytics.
- [ ] Transaction history supports filtering by type and Product.
- [ ] Transaction details show quantity before and after the movement.
- [ ] Invoice-based Stock IN details link to their source Purchase Invoice.
- [ ] Historical transaction details remain readable after Product deletion.
- [ ] Transaction details do not show unapproved edit, delete, undo, or reversal actions.

### 22.6. Settings, Feedback, and Quality

- [ ] Settings contains only approved basic display preferences.
- [ ] Supported preferences persist in LocalStorage.
- [ ] Forms provide validation and clear feedback.
- [ ] Destructive actions require confirmation.
- [ ] Loading, empty, error, success, and disabled states are handled where applicable.
- [ ] Tables and charts remain readable at supported screen sizes.
- [ ] Keyboard focus, labels, and status text are accessible.
- [ ] No undefined business calculation is presented as a confirmed value.

## 23. PRD Requirement Traceability

| PRD requirement | UI area | Coverage |
|---|---|---|
| FR-01 to FR-07 | Dashboard | Inventory KPIs, recent transactions, and sales mock-data widgets. FR-04 is gated by D-01, D-04, and D-05. |
| FR-08 to FR-16, FR-46 to FR-51 | Products | Product CRUD, list controls, package description, selling price, multiple categories/suppliers, and supplier-specific latest prices. |
| FR-17 to FR-20 | Categories | Category CRUD and relationship-aware deletion. |
| FR-21 to FR-25, FR-52 | Suppliers | Supplier CRUD, related Products, and purchase-price history. |
| FR-26, FR-53 to FR-60 | Purchase Invoices | Invoice capture, validation, posting, Stock IN transaction creation, and read-only history. |
| FR-27 to FR-31, FR-61 to FR-62 | Stock OUT and Product forms | Stock OUT, threshold behavior, opening cost, and reasons. Some behavior depends on D-02, D-04, and D-06. |
| FR-32, FR-33 to FR-38, FR-63 | Products and Transactions | Opening stock and full transaction history. |
| FR-39 to FR-43, FR-64 to FR-67 | Sales Analytics | Sales mock data, date range, charts, comparisons, and optional derived metrics. |
| FR-44 to FR-45 | Settings | Basic local display preferences. |

NFR-01 to NFR-12 are covered by the application shell, responsive layouts, forms, tables, validation, persistence behavior, accessibility, feedback, and historical traceability rules.

## 24. Future Considerations

The following items are outside the current MVP. They may be reviewed in a future scope update:

- Sales order management.
- Customer management.
- Sales invoices and payment processing.
- Purchase order management.
- Supplier payments and accounts payable.
- Purchase invoice correction and reversal workflow, unless D-07 brings a limited version into the MVP.
- Multiple warehouses.
- Barcode scanning.
- Lot, batch, expiry, and serial-number tracking.
- Advanced inventory workflows.
- Advanced analytics and exports.
- Notifications.
- User accounts and permissions.
- Backend, server database, and synchronization.

Their presence in this section does not make them MVP commitments.

## 25. Document Control

| Property | Value |
|---|---|
| Document | Storix UI/UX Specification |
| Version | 1.2 |
| Status | Draft for cross-document review — not approved for implementation |
| Last Updated | 2026-11-11 |
| Primary Reference | `docs/PRD.md` |
| Business Rules | `docs/BUSINESS_RULES_AND_DATA_MODEL.md` |
| Next Step | Resolve D-01 through D-08, then complete final UI/UX and cross-document review. |

## 26. Change Log

| Version | Date | Changes |
|---|---|---|
| 1.2 | 2026-11-11 | Added Purchase Invoice pages and Stock IN flow, product pricing and package fields, multi-select category and supplier relationships, supplier-specific purchase-price display, whole-number quantity rules, invoice-based transaction history, deletion constraints, and decision gates. Aligned navigation, forms, acceptance criteria, and PRD traceability. |
| 1.1 | 2026-11-10 | Initial UI/UX specification aligned with PRD v2.0. |
