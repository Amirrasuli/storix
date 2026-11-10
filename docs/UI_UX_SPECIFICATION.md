# Storix — UI/UX Specification

**Project:** Storix  
**Document:** UI/UX Specification  
**Version:** 1.1  
**Status:** Draft — Aligned with PRD v2.0  
**Last Updated:** 2026-11-10  
**Primary Reference:** [`docs/PRD.md`](./PRD.md)  
**Related Document:** [`README.md`](../README.md)

---

## 1. Introduction

### 1.1. Purpose

This document defines the user interface and user experience requirements for the Storix MVP.

It describes:

- Application navigation and page structure.
- The content and behavior of each MVP page.
- Forms, tables, filters, and reusable interface components.
- Responsive behavior and accessibility requirements.
- Data presentation rules that follow the PRD.
- Open decisions that must be resolved before final implementation.

This document is a design specification. It does not define the frontend architecture, database schema, or backend implementation.

### 1.2. Product Overview

Storix is a general-purpose inventory management application with sales analytics.

The MVP focuses on two related areas:

1. **Inventory management:** Interactive product, category, supplier, stock, and inventory transaction features.
2. **Sales analytics:** Read-only presentation of simulated sales information.

Storix is a frontend-focused, single-user, single-warehouse application. The MVP has no backend, database integration, authentication, or external business integrations. Inventory data is stored in the browser with LocalStorage. Sales analytics use mock data.

### 1.3. Design Goals

The interface must:

- Make current inventory status easy to understand.
- Present sales information without implying that Storix processes real sales.
- Make product and stock operations clear and efficient.
- Keep inventory transactions traceable.
- Use consistent page layouts and interaction patterns.
- Give clear feedback after user actions.
- Support desktop, tablet, and mobile screens.
- Keep data presentation separate from hardcoded sample records.

### 1.4. Document Authority

The PRD defines the product scope and functional requirements. This document defines how the approved scope is presented and used in the interface.

If a conflict exists between this document and the PRD, the PRD takes priority. A change to the MVP scope must be approved in the PRD before it is added to this specification.

---

## 2. MVP Scope

### 2.1. Included Modules

The UI/UX design must cover these MVP modules:

| Module | Purpose | Data Source |
|---|---|---|
| Dashboard | Summary of inventory status and selected sales indicators | Local inventory data + sales mock data |
| Sales Analytics | Read-only sales quantity, revenue, and product performance reports | Sales mock data |
| Products | Create, view, update, search, filter, sort, and delete products | LocalStorage |
| Categories | Create, view, update, and delete product categories | LocalStorage |
| Suppliers | Create, view, update, and delete supplier records | LocalStorage |
| Stock Management | Record stock IN and stock OUT operations | LocalStorage |
| Inventory Transactions | Review stock movement history and transaction details | LocalStorage |
| Settings | Manage basic application preferences | LocalStorage |

### 2.2. Product Constraints

The design must respect the following constraints:

| Constraint | UI/UX Implication |
|---|---|
| Single warehouse | Do not show warehouse selection, warehouse switching, or multi-warehouse stock views. |
| Single user | Do not show sign-in, registration, user roles, permissions, or user administration. |
| No backend | Do not present server integrations or server-dependent workflows as MVP features. |
| LocalStorage persistence | Explain local data limitations where needed. Do not imply that data is synchronized between devices. |
| Sales mock data | Clearly identify sales analytics as sample or simulated data. |
| General-purpose product | Do not use industry-specific workflows as mandatory product behavior. |

### 2.3. Excluded from the MVP

The following pages, actions, and workflows must not appear as implemented MVP features:

- Sales order creation or management.
- Sales order details.
- Customer management or customer details.
- Real sales transactions.
- Invoice creation or payment processing.
- Order status management.
- Shipment management.
- Purchase order management.
- Authentication, user profiles, and role management.
- Multi-warehouse workflows.
- Barcode scanning.
- Advanced analytics and report exports.

These items may be considered in a future product scope review. They are not part of this specification's MVP acceptance criteria.

---

## 3. Users and Main Tasks

### 3.1. Design Personas

The personas below are design references. They are not separate system accounts or permission levels.

| Persona | Main Task |
|---|---|
| Business Owner | Review inventory status and sales indicators. |
| Sales Viewer | Review simulated sales quantities, revenue, and product performance. |
| Inventory Operator | Manage products and record stock movements. |

The MVP has one user context. All available features are accessible from the same interface.

### 3.2. Main User Tasks

A user must be able to:

1. Review inventory and sales summaries on the Dashboard.
2. Review sales mock data for a selected date range.
3. Create and maintain products, categories, and suppliers.
4. Record an opening stock quantity when creating a product.
5. Record stock IN and stock OUT operations.
6. Review current stock levels and low-stock products.
7. Find and review inventory transactions.
8. Change the supported application preferences.

---

## 4. Information Architecture and Navigation

### 4.1. Primary Navigation

Use a persistent sidebar on desktop. Group the MVP destinations as follows:

| Group | Navigation Item | Destination |
|---|---|---|
| Overview | Dashboard | `/` |
| Analytics | Sales Analytics | `/sales-analytics` |
| Inventory | Products | `/products` |
| Inventory | Categories | `/categories` |
| Inventory | Suppliers | `/suppliers` |
| Inventory | Stock Operations | `/stock` |
| Inventory | Transactions | `/transactions` |
| General | Settings | `/settings` |

The route names are proposed UI routes. They may be adjusted during Frontend Architecture, but the page responsibilities must remain the same.

### 4.2. Navigation Rules

- The active navigation item must be visually clear.
- Navigation labels must describe the destination in plain language.
- The sidebar must provide access to all MVP modules.
- Breadcrumbs must show the current page hierarchy where they help the user.
- The layout must not include links to excluded MVP modules.
- On mobile, use a collapsible navigation drawer or another compact navigation pattern.
- Do not include a user profile menu. The MVP has no account or authentication features.

### 4.3. Global Application Layout

The application shell consists of:

- Sidebar navigation.
- Top bar.
- Main content area.
- Page header with title and optional description.
- Breadcrumbs on nested pages, where useful.

The top bar may contain page-level utility controls. It must not imply unsupported features such as user administration, notifications, or account management.

---

## 5. Dashboard

### 5.1. Purpose

The Dashboard gives the user a combined view of current inventory status and selected sales indicators.

Inventory figures must come from the current local inventory data. Sales figures must come from the separate sales mock dataset.

### 5.2. Inventory Summary

Display the following inventory KPIs:

| KPI | Definition | Requirement |
|---|---|---|
| Total Products | Number of product records | FR-01 |
| Total Units in Stock | Sum of the current quantities of all products | FR-02 |
| Low-Stock Products | Number of products whose quantity is at or below the minimum stock threshold | FR-03 |
| Estimated Inventory Value | Estimated value of current inventory, using a valuation rule approved during Data Modeling | FR-04 |

The Estimated Inventory Value card is required by the PRD. Its formula and required product price field are not defined yet. Do not invent or hardcode a final valuation formula. Resolve this dependency before final implementation.

### 5.3. Sales Summary and Trend

Display a sales trend chart based on mock data.

Requirements:

- Show sales information for a selected date range.
- Provide readable axis labels and tooltips.
- Show the active reporting period.
- Handle an empty or unavailable mock dataset.
- Identify the displayed sales information as sample data.
- Keep sales values separate from live inventory records and inventory transactions.

Do not display order-based KPIs such as Total Orders, Completed Orders, or Average Order Value. The MVP does not contain sales order records.

### 5.4. Best-Selling Products

Display a ranked list or table of products from the sales mock dataset.

Suggested fields:

- Product name.
- SKU or another stable display identifier, when present in the mock dataset.
- Quantity sold.
- Sales revenue.

The list must be labelled as sample sales data. It must not imply that these quantities were deducted from current inventory.

### 5.5. Recent Inventory Transactions

Display a compact list of recent inventory transactions.

Suggested fields:

- Product name or retained product label.
- Transaction type.
- Quantity.
- Date and time.
- Optional note, when available.

Selecting a transaction must open its transaction details or the relevant transaction view.

### 5.6. Dashboard Interactions

- The user can change the reporting period for sales data.
- The sales chart updates to the selected period.
- A best-selling product can open its product page only when the mock data has a reliable product reference. Otherwise, show it as a read-only analytics row.
- A recent inventory transaction opens its transaction details.
- Inventory KPI cards may link to the related inventory page.
- Do not link a sales row to a sales order or customer page.

---

## 6. Sales Analytics

### 6.1. Purpose

The Sales Analytics page presents simulated sales information. It is a read-only reporting page. It does not create or manage real sales records.

### 6.2. Page Structure

The page should contain:

1. Page title and a short explanation that the data is simulated.
2. Date-range selector.
3. Sales quantity summary.
4. Sales revenue summary.
5. Sales trend chart.
6. Best-selling products.
7. Product performance comparison.

### 6.3. Sales Metrics

The page must display the sales metrics required by the PRD:

- Sales quantity for the selected date range.
- Sales revenue for the selected date range.

Metric labels and formulas must follow the approved sales data definitions. Do not add order counts, average order value, cancellation rate, or customer metrics.

### 6.4. Date-Range Selection

The selector must allow the user to change the reporting period.

Suggested quick ranges from the initial design draft:

- Last 7 days.
- Last 30 days.
- Last 90 days.
- Last 12 months.

A custom date range may be provided if it can be supported by the mock dataset. The exact date-boundary and time-zone rules must be defined before implementation.

### 6.5. Sales Trend Chart

The chart must:

- Display sales values over time.
- Update when the date range changes.
- Use readable labels and tooltips.
- Identify the metric and currency, where applicable.
- Display a useful empty state when there is no data for the selected range.
- Avoid implying that the chart represents live business activity.

### 6.6. Product Performance

Display best-selling products and allow a visual comparison of product performance.

The comparison may use quantity sold, sales revenue, or both, when both values exist in the mock dataset.

The page must not use stock OUT transactions as sales records. The sales mock dataset must remain independent from inventory transaction history.

### 6.7. Sales Analytics Interactions

- Date-range changes update all date-dependent sales metrics and charts.
- Tooltips provide the exact value represented by a chart element.
- Product comparison controls must state which metric is being compared.
- Empty and invalid ranges must have a clear message.
- All sales analytics remain read-only in the MVP.

---

## 7. Products

### 7.1. Purpose

The Products module provides access to the product catalog and current stock information.

### 7.2. Product List

The page must contain:

- Page title and a short description.
- Primary action to create a product.
- Search input.
- Applicable filters.
- Products table.
- Sorting controls.
- Pagination.

### 7.3. Product Table

Use the fields below when they are defined by the approved data model:

| Column | Description |
|---|---|
| Product | Product name |
| SKU | Unique product identifier |
| Category | Assigned category, when supported |
| Stock Quantity | Current quantity |
| Minimum Stock | Configured low-stock threshold, when useful in the table |
| Stock Status | In Stock, Low Stock, or Out of Stock |
| Actions | View, edit, and delete actions |

Do not add purchase price, selling price, supplier name, or sales performance columns until the data model defines those fields and relationships.

### 7.4. Search, Filter, Sort, and Pagination

The product list must support:

- Search by product name.
- Search by SKU.
- Filter by category, when categories exist.
- Filter by stock status.
- Sort by product name.
- Sort by stock quantity.
- Pagination for long lists.

Sorting by price must only be added after the relevant price field is defined in the data model.

Search and filters must work together. The user must be able to clear active filters.

### 7.5. Product Creation and Editing

Use a consistent form for product creation and editing.

The form must support the product fields approved during Data Modeling. At minimum, the UI must account for:

- Product name.
- SKU.
- Category, if the data model supports category assignment.
- Minimum stock threshold.
- Initial stock quantity during creation.
- Other approved product details.

Rules:

- SKU must be unique.
- Required fields must be clear.
- Invalid values must be rejected with field-level messages.
- Initial stock quantity must follow the opening stock rule in the PRD.
- When an initial stock quantity is supplied during product creation, record it as an opening stock transaction, as required by the PRD.
- Do not create a second stock IN transaction for the same initial quantity.
- The handling of a zero opening quantity must be confirmed during Data Modeling because the PRD also requires transaction quantities to be positive.
- Editing a product must not silently change its stock quantity. Stock changes must use Stock Management.

The exact required fields and quantity units depend on Data Modeling.

### 7.6. Product Details

The Product Details page must show the product's approved information and current inventory state.

Suggested sections:

- Product information.
- SKU and category, when available.
- Current stock quantity.
- Minimum stock threshold.
- Stock status.
- Recent inventory transactions for this product.
- Actions to edit the product or record a stock movement.

Do not include a Sales Orders tab, related customer data, or order history.

A sales performance section may only be added if the data model defines a reliable relationship between products and the independent sales mock dataset. It must remain clearly labelled as simulated data.

### 7.7. Product Actions

- View opens product details.
- Edit opens the product form with current values.
- Delete requires confirmation.
- Deleting a product must not delete its historical inventory transaction records.
- Historical transactions must retain enough product information to remain understandable after deletion.

The behavior for deleting a product that is assigned to a category or supplier must be resolved during Data Modeling.

---

## 8. Categories

### 8.1. Purpose

The Categories module allows the user to organize products into categories.

### 8.2. Category List

The page must provide:

- Page title.
- Create category action.
- Category list or table.
- Edit and delete actions.
- Empty state when no categories exist.

Display only fields defined by the data model. A category name is expected. Additional fields, such as a description, must be confirmed during Data Modeling.

### 8.3. Create and Edit Category

- Use a clear form with field labels.
- Validate required fields and any uniqueness rule defined by the data model.
- Show success feedback after saving.
- Keep the form values when validation fails.

### 8.4. Delete Category

- Ask for confirmation before deletion.
- Do not silently delete or reassign products that use the category.
- The exact behavior when a category is assigned to one or more products must be decided before implementation.

---

## 9. Suppliers

### 9.1. Purpose

The Suppliers module allows the user to maintain supplier information.

### 9.2. Supplier List

The page must provide:

- Page title.
- Create supplier action.
- Supplier list or table.
- Search when the approved supplier fields support it.
- Edit, view, and delete actions.
- Empty state when no suppliers exist.

Display only supplier fields defined during Data Modeling. Do not assume a supplier-to-product relationship until the data model confirms it.

### 9.3. Supplier Details

The Supplier Details page must display the approved supplier information.

A related-products section may be shown only if the data model defines that relationship. Do not show purchase orders, supplier order history, or payment information in the MVP.

### 9.4. Create and Edit Supplier

- Use clear field labels.
- Identify required fields.
- Validate inputs before saving.
- Show field-level validation messages.
- Provide success and error feedback.

### 9.5. Delete Supplier

- Ask for confirmation before deletion.
- Do not silently delete related product data.
- Define the behavior for suppliers linked to products during Data Modeling.

---

## 10. Stock Management

### 10.1. Purpose

Stock Management allows the user to record inventory increases and decreases.

These operations affect inventory quantity and create inventory transaction records. They are not sales operations.

### 10.2. Stock Operations Page

The page must provide two clear actions:

- Stock IN.
- Stock OUT.

The page may use separate tabs, segmented controls, or forms. The selected operation type must always be clear.

### 10.3. Stock IN Form

The form must include:

- Product selection.
- Quantity.
- Optional note.
- Current stock information for the selected product, where useful.

On successful submission:

1. Increase the product's stock quantity.
2. Create a stock IN transaction record.
3. Show success feedback.
4. Update the visible stock quantity and relevant transaction lists.

### 10.4. Stock OUT Form

The form must include:

- Product selection.
- Current available quantity.
- Quantity to remove.
- Optional note.

Validation rules:

- Quantity must be a positive value that follows the product's unit rules.
- Stock OUT quantity must not exceed the available quantity.
- The resulting stock quantity must not be negative.

On successful submission:

1. Decrease the product's stock quantity.
2. Create a stock OUT transaction record.
3. Show success feedback.
4. Update the visible stock quantity and relevant transaction lists.

On failure, keep the form open and explain the problem. Do not change stock or create a transaction record.

### 10.5. Stock Operation Rules

- Every successful stock IN or stock OUT operation creates exactly one transaction record.
- A stock operation must not create or update a sales record.
- A stock OUT operation must not increase sales quantities or revenue.
- Transaction quantities must be positive.
- The product's current quantity must match its opening stock and subsequent stock transactions.

---

## 11. Inventory Transactions

### 11.1. Purpose

The Transactions module provides a traceable history of inventory movements.

It contains opening stock, stock IN, and stock OUT records. It does not contain sales orders or real sales transactions.

### 11.2. Transaction List

The page must provide:

- Page title and short description.
- Transaction type filter.
- Product filter.
- Transaction list or table.
- Pagination when needed.
- Empty state when no transactions exist.

Suggested columns:

| Column | Description |
|---|---|
| Date | Transaction date and time |
| Product | Product name or retained historical label |
| SKU | SKU snapshot, when available |
| Type | Opening Stock, Stock IN, or Stock OUT |
| Quantity | Quantity recorded by the transaction |
| Note | Optional transaction note |
| Action | Open transaction details |

### 11.3. Filters

The page must support:

- Filter by transaction type.
- Filter by product.
- Combine filters.
- Clear active filters.

A date filter may be added only when it is included in the approved requirements and data model. It is not required by the current PRD functional requirements.

### 11.4. Transaction Details

The details view must display the information available for a transaction, including:

- Transaction type.
- Product name or historical product label.
- SKU snapshot, when available.
- Quantity.
- Date and time.
- Note, when provided.

The view must remain understandable if the related product has been deleted.

### 11.5. Transaction History Rules

- Every stock movement must be traceable.
- Opening stock must appear as a transaction when an initial stock quantity is provided.
- Deleting a product must not delete its historical transactions.
- Historical records must retain enough product information to remain useful.
- Inventory transactions must never be presented as confirmed sales.

---

## 12. Settings

### 12.1. Purpose

Settings provides basic application preferences only. It does not provide account settings or user management.

### 12.2. MVP Preferences

The MVP provides these local display preferences:

| Preference | Options | Notes |
|---|---|---|
| Theme | Light, Dark, System | Default: System. Affects visual presentation only. |
| Table Density | Comfortable, Compact | Default: Comfortable. Affects table spacing only. |

These are the basic MVP preferences defined for FR-45. Do not add user accounts, roles, permissions, billing, integrations, or multi-warehouse settings.

### 12.3. Preference Behavior

- Display the current preference value.
- Apply changes clearly.
- Persist supported preferences in LocalStorage.
- Provide a sensible default when no saved preference exists.
- Handle unavailable or invalid stored values safely.

---

## 13. Reusable UI Components

Use reusable components to keep the interface consistent. The names below are conceptual. Final component boundaries and names belong to Frontend Architecture.

### 13.1. Layout Components

- `AppSidebar`
- `Topbar`
- `PageContainer`
- `PageHeader`
- `Breadcrumbs`

### 13.2. Data Display Components

- `DataTable`
- `SearchInput`
- `FilterControl`
- `FilterChip`
- `Pagination`
- `EmptyState`
- `LoadingState`
- `ErrorState`

### 13.3. Dashboard and Analytics Components

- `InventorySummaryCard`
- `SalesMetricCard`
- `SalesTrendChart`
- `TopProductsList`
- `ProductPerformanceComparison`
- `RecentTransactionsTable`

Do not create `RecentOrdersTable` or order-status components for the MVP.

### 13.4. Inventory Components

- `StockStatusBadge`
- `TransactionTypeBadge`
- `ProductForm`
- `CategoryForm`
- `SupplierForm`
- `StockMovementForm`
- `TransactionDetails`

### 13.5. Feedback Components

- `Tooltip`
- `Modal`
- `ConfirmationDialog`
- `ToastNotification`
- `SkeletonLoader`
- `InlineValidationMessage`

Components must support consistent styling, accessible interaction, and predictable behavior.

---

## 14. Interaction and Feedback Rules

### 14.1. Forms

- Every input must have a visible label.
- Required fields must be identified.
- Validation messages must explain how to correct the input.
- Preserve valid user input when validation fails.
- Prevent submission while required validation fails.
- Show success feedback after a successful operation.
- Show an error message when an operation fails.

### 14.2. Tables

- Keep the most important information easy to scan.
- Align numeric values consistently.
- Use clear labels for sorting and filtering.
- Show active filters.
- Allow users to clear filters.
- Provide a useful empty-results state when a search or filter returns no rows.
- Keep row actions visible and understandable.

### 14.3. Destructive Actions

- Require confirmation before deleting a product, category, or supplier.
- State which record will be deleted.
- Do not imply that historical inventory transactions will be removed when a product is deleted.
- Do not perform unapproved cascading deletes.

### 14.4. Action Feedback

The interface must provide clear feedback for:

- Successful create, update, and delete operations.
- Successful stock IN and stock OUT operations.
- Validation errors.
- Failed operations.
- Empty search results.
- Unsaved form changes, where relevant.

---

## 15. Data Presentation Rules

### 15.1. Stock Status

The PRD defines a low-stock product as a product whose quantity is less than or equal to its minimum stock threshold.

Use these display labels:

| Display Status | Condition | Notes |
|---|---|---|
| Out of Stock | Quantity equals zero | Show this label as the visible status for zero quantity. |
| Low Stock | Quantity is greater than zero and less than or equal to the minimum threshold | Show the threshold or an explanatory tooltip where useful. |
| In Stock | Quantity is greater than the minimum threshold | Show as the normal available state. |

The Dashboard Low-Stock Products count must follow the PRD rule and include every product whose quantity is at or below its minimum threshold, including products with zero quantity. The Out of Stock label is a more specific visual state; it does not remove the product from the PRD low-stock count.

### 15.2. Numeric Values

- Use consistent number formatting across the application.
- Do not hide meaningful decimal values if the product unit permits decimals.
- Use the approved product unit and precision rules from Data Modeling.
- Do not assume all products use whole-number quantities.

### 15.3. Currency and Prices

- Display a currency label or symbol whenever a currency value is shown.
- Use one consistent currency presentation across the MVP unless the PRD is changed.
- Do not invent the currency, price fields, or valuation formula.
- The inventory valuation rule and sales revenue definition must be approved before final implementation.

### 15.4. Dates and Time

- Use one consistent date and time format across the application.
- Use the same date boundaries for all sales widgets that share a selected reporting period.
- Define time-zone and date-boundary behavior before implementing date filtering.
- Do not show order dates or shipment dates. Those records are outside the MVP.

### 15.5. Charts

- Every chart must identify the metric it displays.
- Axes and tooltips must use readable labels.
- Use text labels or legends in addition to color.
- Do not use a chart to imply a relationship between sales mock data and inventory transactions.
- Provide an empty state when the selected period has no data.

---

## 16. Responsive Design

The application must support desktop, tablet, and mobile layouts.

### 16.1. Desktop

- Use a persistent sidebar.
- Use multi-column dashboard layouts where space allows.
- Display full data tables.
- Keep page actions and filters easy to access.

### 16.2. Tablet

- Allow the sidebar to collapse.
- Adapt dashboard cards to the available width.
- Keep forms readable.
- Allow table layouts to adapt without hiding essential information.

### 16.3. Mobile

- Use compact navigation.
- Use single-column page layouts.
- Stack KPI cards.
- Use horizontally scrollable tables only when a card layout is not suitable.
- Keep primary actions visible and touch-friendly.
- Ensure forms and dialogs fit the viewport.
- Do not remove essential transaction or stock information.

---

## 17. UI States

Every data-driven page must define the states that apply to it.

### 17.1. Loading State

Use a skeleton or progress indicator while local data or page content is being prepared. Do not show a fake server-loading state.

### 17.2. Empty State

Explain why the page has no records and provide a relevant next step when one exists.

Examples:

- No products have been created. Provide a Create Product action.
- No transactions exist. Explain that stock movements will appear here.
- No sales data exists for the selected range. Offer another date range when possible.

### 17.3. Error State

Show a useful message when data cannot be read, validated, or saved. Provide a retry action when it is safe and useful.

### 17.4. Success State

Confirm successful actions without interrupting the user's workflow.

### 17.5. Validation State

Show validation messages close to the related fields. Use text in addition to color or icons.

### 17.6. Disabled State

Disable actions when they cannot be completed. Explain the reason when it is not clear from the context.

---

## 18. Accessibility

The interface should follow accessibility best practices.

Requirements:

- Provide sufficient color contrast.
- Show a visible keyboard focus indicator.
- Support keyboard navigation for all interactive controls.
- Use accessible labels for form fields.
- Use meaningful button and link text.
- Do not use color as the only way to communicate stock or transaction status.
- Give charts a text summary or accessible data alternative.
- Ensure dialogs manage focus and can be closed with the keyboard where appropriate.
- Use semantic page headings and table headers.

---

## 19. Frontend and Data Presentation Considerations

This section records UI constraints. It does not make final architecture decisions.

- Keep page components separate from reusable presentation components.
- Keep feature-specific behavior separate from shared UI elements.
- Define TypeScript types for product, category, supplier, inventory transaction, settings, and sales mock data during the relevant planning phases.
- Keep sales mock data separate from inventory transaction data.
- Do not place hardcoded sample records directly inside reusable UI components.
- Use a clear data access boundary so LocalStorage data can be replaced by an API in a future project phase.
- No backend implementation is required by this specification.
- Final choices for routing, state management, forms, validation, and folder structure belong to Frontend Architecture.

---

## 20. Decisions Required Before Final Implementation

The PRD defines the required behavior, but some data and business rules are not defined yet. These items must be resolved during Data Modeling and Business Rules Finalization.

| Topic | Decision Required | Why It Matters |
|---|---|---|
| Product fields | Final product fields and required/optional rules | Defines product forms, tables, and details. |
| Product units | Whether quantities can be fractional and which units are supported | Defines quantity inputs, validation, and formatting. |
| Inventory valuation | Which product value is used and how total inventory value is calculated | Required for the Dashboard Estimated Inventory Value KPI. |
| Currency | Currency used by inventory values and sales mock data | Required for consistent money display. |
| Sales revenue | Exact meaning and calculation of sales revenue | Required for sales KPIs and charts. |
| Sales mock records | Record shape, product identifiers, and date coverage | Required for consistent sales charts and product comparisons. |
| Sales date filtering | Time zone, start/end boundary, and custom range behavior | Prevents inconsistent report totals. |
| Category relationships | Whether categories can be deleted while products reference them | Prevents data loss or invalid references. |
| Supplier fields and relationships | Supplier fields and whether products can reference suppliers | Defines supplier details and related product views. |
| Product deletion | How deleted product information is retained in historical transactions | Preserves transaction history. |
| Pagination defaults | Default page size and available page-size options | Keeps list behavior consistent. |

Do not treat unresolved items as approved business rules. Record decisions in the relevant project document before implementation.

---

## 21. UI/UX Acceptance Criteria

The UI/UX work for the MVP is complete when the following items are satisfied.

### 21.1. Application Shell

- [ ] The application has a consistent sidebar, top bar, and main content area.
- [ ] Navigation contains only MVP destinations.
- [ ] The current page is identifiable.
- [ ] No user profile, authentication, customer, or sales order navigation is present.
- [ ] The layout works on desktop, tablet, and mobile.

### 21.2. Dashboard and Sales Analytics

- [ ] Dashboard displays Total Products.
- [ ] Dashboard displays Total Units in Stock.
- [ ] Dashboard displays Low-Stock Products using the PRD threshold rule.
- [ ] Dashboard displays Estimated Inventory Value after its formula is approved.
- [ ] Dashboard displays sales charts using mock data.
- [ ] Dashboard displays recent inventory transactions.
- [ ] Dashboard displays best-selling products using mock data.
- [ ] Sales Analytics displays sales quantity and sales revenue for a selected date range.
- [ ] Sales Analytics displays charts and product performance comparisons.
- [ ] Sales mock data is clearly identified and remains separate from inventory transactions.
- [ ] No order, customer, invoice, or payment workflow is presented as an MVP feature.

### 21.3. Inventory Modules

- [ ] Product list supports create, view, update, and delete actions.
- [ ] Product list supports search, applicable filters, sorting, and pagination.
- [ ] Product details show current stock information.
- [ ] Category management supports create, view, update, and delete actions.
- [ ] Supplier management supports create, view, update, and delete actions.
- [ ] Stock IN updates stock and creates one transaction record.
- [ ] Stock OUT updates stock and creates one transaction record.
- [ ] Invalid stock OUT operations are prevented.
- [ ] Opening stock creates an opening stock transaction.
- [ ] Transaction history supports filtering by type and product.
- [ ] Transaction details remain understandable after product deletion.

### 21.4. Settings, Feedback, and Quality

- [ ] Settings contains only approved basic application preferences.
- [ ] Supported preferences persist in LocalStorage.
- [ ] Forms provide validation and clear feedback.
- [ ] Destructive actions require confirmation.
- [ ] Loading, empty, error, success, and disabled states are handled where applicable.
- [ ] Tables and charts remain readable at supported screen sizes.
- [ ] Keyboard focus, labels, and status text are accessible.
- [ ] No undefined business calculation is presented as a confirmed value.

---

## 22. PRD Requirement Traceability

This table maps the PRD functional requirements to the UI areas defined in this document. It helps prevent a required MVP feature from being missed during design and implementation.

| PRD Requirement | UI Area | Coverage |
|---|---|---|
| FR-01 to FR-04 | Dashboard | Inventory summary KPIs. Inventory value remains dependent on the approved valuation rule. |
| FR-05 | Dashboard, Sales Analytics | Sales charts use mock data. |
| FR-06 | Dashboard, Transactions | Recent inventory transactions and transaction history. |
| FR-07 | Dashboard, Sales Analytics | Best-selling products use mock data. |
| FR-08 to FR-16 | Products | Product create, update, delete, details, list, search, filter, sort, and pagination. |
| FR-17 to FR-20 | Categories | Category create, update, delete, and list. |
| FR-21 to FR-25 | Suppliers | Supplier create, update, delete, list, and details. |
| FR-26 to FR-31 | Stock Management, Products | Stock IN/OUT, current quantity, stock OUT validation, notes, and low-stock identification. |
| FR-32 | Products | Initial stock quantity during product creation. |
| FR-33 to FR-38 | Transactions, Products | Transaction history, filters, details, dates, quantities, and opening stock records. |
| FR-39 to FR-43 | Sales Analytics | Sales quantity, revenue, charts, best-selling products, and product comparisons. |
| FR-44 to FR-45 | Settings | Basic settings page and the approved local display preferences. |

The non-functional requirements NFR-01 to NFR-10 are covered across the application shell, forms, tables, feedback patterns, responsive layouts, accessibility rules, and UI states in this document.

---

## 23. Future Considerations

The following items are outside the current MVP. They may be reviewed in a future scope update:

- Sales order management.
- Customer management.
- Invoices and payment processing.
- Purchase orders.
- Shipment management.
- Multiple warehouses.
- Barcode scanning.
- Advanced inventory workflows.
- Advanced analytics and exports.
- Notifications.
- User accounts and permissions.

Their presence in this section does not make them MVP commitments.

---

## 24. Document Control

| Property | Value |
|---|---|
| Document | Storix UI/UX Specification |
| Version | 1.1 |
| Status | Draft — Aligned with PRD v2.0 |
| Primary Reference | `docs/PRD.md` |
| Last Updated | 2026-11-10 |
| Next Step | Resolve the open data and business-rule decisions, then prepare detailed wireframes. |

