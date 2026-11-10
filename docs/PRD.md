# Storix
## Product Requirements Document (PRD)

**Version:** 2.1  
**Status:** Draft for cross-document review — not approved for implementation  
**Last Updated:** 2026-11-11  
**Related Documents:** [`BUSINESS_RULES_AND_DATA_MODEL.md`](./BUSINESS_RULES_AND_DATA_MODEL.md) · [`UI_UX_SPECIFICATION.md`](./UI_UX_SPECIFICATION.md)

---

## 1. Product Overview

### 1.1. Product Description

Storix is a general-purpose, frontend-focused web application. It combines inventory management with sales information and analytics.

The MVP gives one local user a unified interface to:

- Manage products, categories, and suppliers.
- Track stock levels and inventory movements.
- Record supplier purchase invoices as the source of incoming stock and purchase-price history.
- Review supplier-specific latest purchase prices.
- View simulated sales quantities, revenue, and product performance.

Storix is not designed for one specific industry or business type.

### 1.2. Problem Statement

Businesses need a clear way to manage stock, understand product availability, record supplier receipts, and review sales information.

Separate or manual records can make it difficult to understand current stock, trace stock changes, compare supplier purchase prices, and review product performance.

Storix aims to present these activities in one organized interface. The MVP uses local browser data for inventory operations and mock data for sales analytics.

### 1.3. Product Vision

Provide a practical and extensible frontend application for inventory management and sales monitoring.

### 1.4. Product Focus

The project focuses on:

- User interface and user experience.
- Frontend development.
- Client-side interactions.
- Inventory and sales information presentation.
- Client-side data validation and persistence.

The MVP does not include backend development, a server database, or real business integrations.

## 2. Target Users

### 2.1. Target Market

Storix is a general-purpose application. It is not restricted to one industry or business type.

### 2.2. Design Personas

These personas are design references. They are not separate accounts or roles in the MVP.

| Persona | Primary need |
|---|---|
| Business Owner | Review inventory status and sales information. |
| Inventory Operator | Manage products, suppliers, purchase receipts, and stock removals. |
| Sales Viewer | Review simulated sales quantities, revenue, and product performance. |

### 2.3. User Constraints

The MVP supports one local user context.

It does not include registration, authentication, multiple accounts, roles, permissions, or user administration. All MVP features are available in the same local interface.

## 3. Product Goals

1. Show a clear overview of current inventory.
2. Support product and category management.
3. Support supplier management and product-supplier relationships.
4. Record incoming stock through supplier purchase invoices.
5. Record outgoing stock with a clear reason.
6. Keep an understandable history of inventory transactions.
7. Identify low-stock and out-of-stock products.
8. Show supplier-specific latest purchase prices.
9. Display simulated sales statistics and product performance.
10. Provide a consistent, responsive, and accessible interface.

## 4. Scope Definition

### 4.1. Included in the MVP

| Module | Scope |
|---|---|
| Dashboard | Inventory summary, stock status, recent transactions, and selected sales indicators. Inventory value is conditional on approved valuation rules. |
| Products | Create, view, update, search, filter, sort, and delete products. Show selling price and package description. |
| Categories | Create, view, update, assign, and delete categories, subject to relationship rules. |
| Suppliers | Create, view, update, and delete supplier records, subject to relationship and history rules. |
| Product-Supplier Links | Link one product to multiple suppliers and one supplier to multiple products. |
| Purchase Invoices | Record a basic supplier invoice with one or more product lines. Posting the invoice records incoming stock. |
| Purchase Price History | Show the latest recorded purchase price and invoice date for each product-supplier pair. |
| Stock OUT | Record non-sale stock removals and their approved reason. |
| Inventory Transactions | Review opening stock, invoice-based Stock IN, and Stock OUT history. |
| Sales Analytics | Display read-only sales mock data with date-range filtering and product comparisons. |
| Settings | Manage basic local display preferences. |
| Responsive UI | Support desktop, tablet, and mobile screens. |
| Local Persistence | Store editable inventory data and supported preferences in LocalStorage. |

Purchase Invoice capture is a limited inventory-receipt feature. It is not a full purchasing or accounting module.

### 4.2. Excluded from the MVP

**Infrastructure and accounts**

- Backend development.
- Server-side business logic.
- Server database integration.
- External business API integrations.
- Authentication and registration.
- Multiple user accounts, roles, and permissions.

**Inventory extensions**

- Multiple warehouses.
- Warehouse transfers.
- Barcode scanning.
- Purchase order creation and approval.
- Supplier payment or accounts-payable management.
- Advanced lot, batch, serial-number, or expiry tracking.
- Unit conversion between items, kilograms, liters, or other measures.

**Sales operations**

- Customer management.
- Sales order creation or management.
- Real sales transaction entry.
- Sales invoice generation.
- Payment processing.
- Shipment and delivery management.
- Treating Stock OUT as a sale.

**Invoice extensions**

- Purchase order matching.
- Full tax and accounting treatment.
- Invoice-level discount, tax, shipping, or other charge allocation until D-05 is approved.
- Posted purchase invoice editing, deletion, voiding, or reversal until D-07 is approved.

**Advanced features**

- Advanced analytics.
- Excel or PDF exports.
- Notifications.
- Automated online supplier price updates.

### 4.3. Project Constraints

| Constraint | Definition |
|---|---|
| Warehouse | One warehouse |
| User context | One local user |
| Backend | Not included |
| Database | No server database |
| Editable data persistence | Browser LocalStorage |
| Sales data | Static mock data |
| Currency | Application identifier `IRT`, displayed as تومان |
| Money storage | Integer toman amounts |
| Stock quantity | Whole countable items/packages only |
| Application focus | Frontend-focused |
| Business domain | General-purpose |

`IRT` is the application's internal currency identifier. The UI displays `تومان`; do not convert to rial.

### 4.4. Inventory Management Scope

Inventory management is interactive in the MVP.

Users must be able to:

- Create and maintain products, categories, and suppliers.
- Assign multiple categories to a product.
- Link a product to multiple suppliers.
- Record opening stock when creating a product.
- Record incoming stock by posting a Purchase Invoice.
- Record non-sale Stock OUT operations.
- View current stock and low-stock status.
- Review inventory transaction history.
- Review purchase-price history by supplier.

There is no separate manual Stock IN form. A Purchase Invoice is the supported source of Stock IN.

### 4.5. Purchase Invoice Scope

The MVP Purchase Invoice flow must:

- Use one supplier for each invoice.
- Record the supplier invoice date.
- Support an optional supplier invoice number and note.
- Contain one or more product lines.
- Record a whole-number quantity and a unit purchase price for each line.
- Require each product to be linked to the selected supplier before posting.
- Prevent a product from appearing more than once on the same invoice.
- Create exactly one Stock IN transaction for each invoice line.
- Save the invoice, lines, transactions, and stock changes as one logical operation.
- Keep posted invoice history read-only until an approved correction workflow exists.

This feature records received stock and entered acquisition prices. It does not create purchase orders, payments, supplier balances, or accounting entries.

### 4.6. Sales Analytics Scope

Sales Analytics is read-only and uses static mock data.

Included:

- Sales quantity for a selected date range.
- Sales revenue for a selected date range.
- Sales charts.
- Best-selling products.
- Product performance comparisons.
- Date-range filtering.
- Optional Gross Profit and Gross Margin display after product-owner confirmation of visible placement.

Excluded:

- Real sales processing.
- Sales order creation.
- Customer management.
- Sales invoice generation.
- Payment processing.
- Real sales transaction records.

Sales mock data must remain separate from inventory transactions. Stock OUT does not increase sales quantity or revenue.

## 5. Functional Requirements

Each requirement has a stable ID. The status column identifies whether the behavior is ready for implementation or depends on an open decision.

### 5.1. Dashboard

| ID | Requirement | Status |
|---|---|---|
| FR-01 | Display the total number of active products. | Defined |
| FR-02 | Display the total number of stock units across active products. | Defined |
| FR-03 | Display the number of low-stock products, including products with zero stock when they meet the threshold rule. | Defined |
| FR-04 | Display estimated inventory value using the approved inventory valuation method. | Blocked by D-01, D-04, and D-05 |
| FR-05 | Display sales charts using sales mock data. | Defined |
| FR-06 | Display recent inventory transactions. | Defined |
| FR-07 | Display best-selling products using sales mock data. | Defined |

### 5.2. Product Management

| ID | Requirement | Status |
|---|---|---|
| FR-08 | Create a Product with a name and unique SKU. | Defined |
| FR-09 | Update editable Product information. | Defined |
| FR-10 | Delete a Product only when its current stock is zero. | Defined |
| FR-11 | View Product details, current stock, categories, suppliers, and relevant price history. | Defined |
| FR-12 | Display a list of active Products. | Defined |
| FR-13 | Search Products by name and SKU. | Defined |
| FR-14 | Filter Products by category and stock status. | Defined |
| FR-15 | Sort Products by supported fields. | Defined |
| FR-16 | Paginate long Product lists. | Defined |
| FR-46 | Store and display an optional package description for one stock unit. | Defined |
| FR-47 | Store the current selling price for one stock unit. | Defined; zero-price validation depends on D-03 |
| FR-48 | Allow the user to assign zero, one, or multiple categories to a Product. | Defined |
| FR-49 | Allow the user to link a Product to zero, one, or multiple Suppliers. | Defined |
| FR-50 | Display the latest recorded purchase price, invoice date, and relative age for each linked Supplier. | Defined |
| FR-51 | Display `No recorded purchase` when a Product-Supplier pair has no invoice history. | Defined |

### 5.3. Category Management

| ID | Requirement | Status |
|---|---|---|
| FR-17 | Create a Category. | Defined |
| FR-18 | Update a Category. | Defined |
| FR-19 | Delete a Category only when no ProductCategory link refers to it. | Defined |
| FR-20 | Display a list of Categories and their product counts. | Defined |

### 5.4. Supplier Management

| ID | Requirement | Status |
|---|---|---|
| FR-21 | Create a Supplier. | Defined |
| FR-22 | Update Supplier information. | Defined |
| FR-23 | Delete a Supplier only when it has no active ProductSupplier links and no Purchase Invoice history. | Defined |
| FR-24 | Display a list of Suppliers. | Defined |
| FR-25 | View Supplier details and related Products. | Defined |
| FR-52 | Display the latest purchase price for each supplied Product, with invoice date and relative age. | Defined |

### 5.5. Stock Management and Purchase Invoices

| ID | Requirement | Status |
|---|---|---|
| FR-26 | Record incoming stock by posting a Purchase Invoice. A separate manual Stock IN form is not part of the MVP. | Defined |
| FR-27 | Record Stock OUT for a non-sale reason. | Reason values depend on D-06 |
| FR-28 | Display current stock quantity for each Product. | Defined |
| FR-29 | Prevent Stock OUT operations that exceed available stock. | Defined |
| FR-30 | Allow a user note on Stock OUT transactions and Purchase Invoices. | Defined |
| FR-31 | Identify Products at or below their minimum stock level. | Default threshold depends on D-02 |
| FR-32 | Support opening stock quantity when a Product is created. | Opening-cost behavior depends on D-04 |
| FR-53 | Create a Purchase Invoice with one Supplier, invoice date, optional invoice number, optional note, and at least one line. | Defined |
| FR-54 | Require each Purchase Invoice line to reference a Product linked to the selected Supplier. | Defined |
| FR-55 | Record a positive whole-number quantity and a non-negative integer-toman unit purchase price on each invoice line. | Defined; price basis depends on D-05 |
| FR-56 | Prevent duplicate Product lines within one Purchase Invoice. | Defined |
| FR-57 | Create exactly one Stock IN transaction for each saved invoice line. | Defined |
| FR-58 | Save the Purchase Invoice, its lines, its Stock IN transactions, and the resulting stock changes as one logical operation. | Defined |
| FR-59 | Display a list and read-only details for posted Purchase Invoices. | Defined |
| FR-60 | Keep posted Purchase Invoices and their lines immutable. | Edit/void behavior depends on D-07; read-only is the current proposal |
| FR-61 | Show opening-stock acquisition cost when opening quantity is greater than zero. | Depends on D-04 |
| FR-62 | Require a reason for each Stock OUT operation. | Reason values depend on D-06 |

### 5.6. Transaction Management

| ID | Requirement | Status |
|---|---|---|
| FR-33 | Display inventory transaction history. | Defined |
| FR-34 | Filter transactions by type. | Defined |
| FR-35 | Filter transactions by Product. | Defined |
| FR-36 | View transaction details. | Defined |
| FR-37 | Display transaction date, quantity, and before/after stock values. | Defined |
| FR-38 | Display opening stock records when an initial quantity is provided. | Defined |
| FR-63 | Keep historical transaction details readable after a Product or Supplier is edited or deleted. | Defined |

### 5.7. Sales Analytics

| ID | Requirement | Status |
|---|---|---|
| FR-39 | Display sales quantity for a selected date range using mock data. | Defined |
| FR-40 | Display sales revenue for a selected date range using mock data. | Defined |
| FR-41 | Display sales charts. | Defined |
| FR-42 | Display best-selling Products. | Defined |
| FR-43 | Compare Product performance by a clearly labelled metric. | Defined |
| FR-64 | Apply the same selected date range to all date-dependent Sales Analytics widgets. | Defined |
| FR-65 | Clearly label Sales Analytics as simulated or sample data. | Defined |
| FR-66 | Keep Sales Analytics independent from inventory transactions and Purchase Invoices. | Defined |
| FR-67 | Display Gross Profit and Gross Margin as visible metrics. | Needs product-owner confirmation; formulas are defined in Business Rules |

### 5.8. Settings

| ID | Requirement | Status |
|---|---|---|
| FR-44 | Display a basic application settings page. | Defined |
| FR-45 | Allow the user to manage approved basic display preferences. | Defined |

Settings must not include accounts, roles, permissions, billing, integrations, or a currency selector.

## 6. Non-Functional Requirements

| ID | Requirement | Description |
|---|---|---|
| NFR-01 | Responsive design | Support desktop, tablet, and mobile screens. |
| NFR-02 | Performance | Keep page rendering, filtering, sorting, and local interactions responsive for the MVP data volume. |
| NFR-03 | Usability | Use clear labels, predictable workflows, and understandable validation messages. |
| NFR-04 | Accessibility | Use semantic structure, keyboard support, visible focus, labels, and sufficient contrast. |
| NFR-05 | Maintainability | Keep business rules separate from presentation details. Final structure belongs to Frontend Architecture. |
| NFR-06 | Consistency | Use consistent layouts, controls, number formatting, and feedback patterns. |
| NFR-07 | Data persistence | Preserve supported editable data after a page refresh in the same browser profile. |
| NFR-08 | Error handling | Show a useful error when validation or persistence fails. |
| NFR-09 | Validation | Validate data before a change is committed. |
| NFR-10 | Feedback | Give clear feedback after create, update, delete, invoice posting, and stock operations. |
| NFR-11 | Data integrity | Related local data changes must be saved as one logical operation. |
| NFR-12 | Historical traceability | Keep posted transaction and invoice history readable after related catalog changes. |

## 7. Business Rules Summary

The detailed source for these rules is [`BUSINESS_RULES_AND_DATA_MODEL.md`](./BUSINESS_RULES_AND_DATA_MODEL.md).

### 7.1. Product and Relationship Rules

1. Each Product must have a unique SKU after normalization.
2. Product-Category is many-to-many.
3. Product-Supplier is many-to-many.
4. A Product has one fixed count unit: `unit`, displayed as `عدد`.
5. Package description is descriptive. It does not convert quantity.
6. Current selling price is stored on Product. Historical sales mock values are not recalculated from it.
7. Latest purchase price is derived from invoice history per Product-Supplier pair.

### 7.2. Inventory Rules

1. Current stock is derived from the transaction ledger.
2. Current stock must never be negative.
3. Movement quantities are positive whole numbers.
4. Incoming stock is recorded only through a Purchase Invoice.
5. Each Purchase Invoice line creates exactly one Stock IN transaction.
6. Stock OUT must not exceed available stock.
7. Stock OUT is not a sale and does not change Sales Analytics.
8. Transactions and posted invoice lines are immutable in the MVP.
9. Product deletion is allowed only at zero stock. Historical transactions and invoice records remain available.
10. Category and Supplier deletion must respect active links and historical invoice references.

### 7.3. Price and Currency Rules

1. Display money as تومان.
2. Store money as integer toman amounts.
3. Do not convert between toman and rial.
4. Purchase prices come from supplier invoice lines.
5. Do not manually overwrite a latest purchase price.
6. Do not show a price without supplier context when more than one supplier exists.
7. Inventory valuation is not final until D-01, D-04, and D-05 are approved.

### 7.4. Sales Analytics Rules

1. Sales Analytics uses mock data only.
2. It is read-only in the MVP.
3. It remains independent from inventory transactions and Purchase Invoices.
4. All widgets use the same selected date range.
5. Stock OUT never counts as a confirmed sale.

## 8. User Experience Requirements

### 8.1. Navigation

- Provide direct access to Dashboard, Sales Analytics, Products, Categories, Suppliers, Purchase Invoices, Stock OUT, Transactions, and Settings.
- Do not show navigation for Customers, Sales Orders, Sales Invoices, Payments, Purchase Orders, or Warehouse Management.
- Keep active navigation state clear.
- Support compact navigation on mobile.

### 8.2. Forms

- Show a visible label for every input.
- Mark required fields.
- Explain validation errors in plain language.
- Preserve valid values after validation errors.
- Prevent duplicate submissions.
- Do not report success before local persistence succeeds.

### 8.3. Tables and Data Display

- Make key values easy to scan.
- Align quantity and money values consistently.
- Identify the currency as تومان.
- Show active filters and a way to clear them.
- Provide useful empty states.
- Keep historical product and supplier snapshots readable.

### 8.4. Interaction Feedback

- Successful create, update, delete, and stock actions must show confirmation feedback.
- Purchase Invoice posting must confirm that stock will increase before final submission.
- Failed validation or persistence must show an error and must not partially change data.
- Destructive actions must require confirmation.

### 8.5. Page States

Data-driven pages must support applicable loading, empty, error, success, and disabled states. A frontend-only LocalStorage app does not need to show a fake network-loading state when no asynchronous operation exists.

## 9. Data Persistence

Editable inventory data and basic preferences are stored in browser LocalStorage under one application namespace.

The application must preserve:

- Products and their current catalog fields.
- Categories and ProductCategory links.
- Suppliers and ProductSupplier links.
- Purchase Invoice headers and lines.
- Inventory transactions and derived stock balances.
- Supported application preferences.

Sales mock data may be static application data. It does not need to be stored in LocalStorage.

### 9.1. Persistence Limitations

- Data is stored only in the current browser profile.
- Data is not synchronized between devices.
- There is no shared database or multi-user concurrency.
- Clearing browser storage can remove application data.
- LocalStorage is not a replacement for a server database.

## 10. MVP Acceptance Criteria

The MVP must satisfy the scenarios below. Scenarios that depend on an open decision are marked as conditional and cannot pass final sign-off until the relevant decision is approved.

### 10.1. Product and Supplier Setup

1. Create a Category named `Electronics`.
2. Create two Suppliers.
3. Create a Product named `Keyboard` with a unique SKU and a package description.
4. Assign the Product to more than one Category.
5. Link the Product to both Suppliers.
6. Verify the Product shows one count unit as `عدد`.
7. Verify decimal quantities are rejected.

### 10.2. Purchase Invoice and Stock Receipt

1. Create a Purchase Invoice for Supplier A.
2. Set a valid invoice date and an optional invoice number.
3. Add a Keyboard line with quantity 20 and a unit purchase price.
4. Add another Product line with a positive whole-number quantity.
5. Save the invoice.
6. Verify that every line creates exactly one Stock IN transaction.
7. Verify the stock of each Product increases by its line quantity.
8. Verify the invoice and all related transactions persist after refresh.
9. Verify the latest purchase price view identifies Supplier A and the invoice date.
10. Try to add a duplicate Product line. Verify the UI blocks it.
11. Try to add a Product that is not linked to Supplier A. Verify the relationship must be created first.
12. Simulate a persistence failure. Verify the invoice, lines, transactions, and stock changes are not partially saved.

### 10.3. Supplier-Specific Price History

1. Record a later invoice for Keyboard from Supplier A at a different price.
2. Verify the later invoice date determines Supplier A's latest price.
3. Record an invoice for Keyboard from Supplier B.
4. Verify the UI shows a separate latest price for Supplier B.
5. Verify old invoice prices remain unchanged.
6. Verify relative price age is based on the invoice date.

### 10.4. Stock OUT

1. Select a Product with available stock.
2. Enter a positive whole-number quantity that is not greater than current stock.
3. Select a reason after D-06 is approved.
4. Submit the operation.
5. Verify current stock decreases and exactly one Stock OUT transaction is created.
6. Attempt to remove more than the available quantity.
7. Verify the invalid operation is rejected and stock remains unchanged.
8. Verify Sales Analytics values do not change.

### 10.5. Opening Stock

1. Create a Product with opening stock zero. Verify no transaction is created.
2. Create a Product with positive opening stock.
3. Apply the approved D-04 acquisition-cost rule.
4. Verify exactly one OPENING_STOCK transaction is created.
5. Verify Product creation and opening stock are saved together.

### 10.6. Deletion and History

1. Try to delete a Product with positive stock. Verify deletion is blocked.
2. Delete a zero-stock Product. Verify invoice lines and transactions remain readable.
3. Try to delete a Category that still has Product links. Verify deletion is blocked.
4. Try to delete a Supplier that has Product links or invoice history. Verify deletion is blocked.

### 10.7. Sales Analytics

1. Display sales mock data for a selected date range.
2. Verify sales quantity, revenue, charts, and product comparisons use only mock data.
3. Change a Product selling price. Verify historical mock revenue and cost remain unchanged.
4. Record a Purchase Invoice and a Stock OUT. Verify neither operation changes sales mock data.
5. Change the date range. Verify all date-dependent widgets use the same range.
6. If Gross Profit and Gross Margin are approved for visible display, verify the formulas and zero-revenue behavior.

### 10.8. Persistence and Recovery

1. Refresh the browser after successful local changes.
2. Verify supported data remains available.
3. Simulate malformed or unsupported stored data.
4. Verify the application does not silently overwrite it.
5. Simulate a failed write.
6. Verify the previous persisted state remains intact and the UI shows an error.

## 11. Open Decisions and Implementation Gates

The following decisions remain open. Their recommendations are recorded in the Business Rules document. A recommendation is not an approval.

| ID | Decision | Impact | Gate |
|---|---|---|---|
| D-01 | Inventory valuation method | Inventory value and Stock OUT cost calculations | Blocks FR-04 and related cost calculations |
| D-02 | Default minimum stock | Product creation and low-stock defaults | Blocks final default value only |
| D-03 | Zero selling price | Product selling-price validation | Blocks final zero-price validation |
| D-04 | Opening stock acquisition cost | Opening stock form and inventory valuation | Blocks final opening-cost behavior and FR-61 |
| D-05 | Invoice-level discounts, taxes, shipping, and other charges | Meaning of effective unit cost and inventory valuation | Blocks final acquisition-cost basis and FR-04 |
| D-06 | Stock OUT reason values | Stock OUT form validation | Blocks final reason options and FR-62 |
| D-07 | Posted Purchase Invoice corrections | Edit, void, and reversal behavior | Blocks invoice correction workflow; posted invoices remain read-only in this draft |
| D-08 | Inventory transaction correction | Whether users can reverse or adjust an already-posted inventory movement | Blocks any general transaction correction action; do not use a manual Stock IN to reverse Stock OUT |

**Implementation rule:** Do not implement a blocked calculation or workflow as if its decision were approved. Keep the affected UI state hidden, disabled with an explanation, or clearly marked unavailable.

The current draft keeps inventory transactions immutable and does not provide a general correction or reversal workflow. This avoids a conflict with the rule that incoming stock can only be created by posting a Purchase Invoice. A dedicated stock adjustment or reversal workflow needs approval under D-08.

## 12. Technology Direction

The initial frontend direction is:

| Technology | Intended purpose |
|---|---|
| Next.js | React framework |
| TypeScript | Static type checking |
| Tailwind CSS | Styling |
| React Hook Form | Form management |
| Zod | Schema validation |
| Zustand | Client-side state management |
| Recharts | Data visualization |
| LocalStorage | Client-side persistence |

This is a proposed technology direction, not a final architecture decision. Final choices for routing, state ownership, data access, validation boundaries, and folder structure belong to Frontend Architecture.

## 13. Project Success Criteria

The MVP is successful when:

- All approved MVP requirements work as expected.
- All approved business rules are enforced.
- Stock quantities match the transaction ledger.
- Each posted Purchase Invoice line creates exactly one Stock IN transaction.
- Purchase-price history is accurate for each Product-Supplier pair.
- Historical invoices and transactions remain readable after catalog changes.
- Data persists after page refresh in the same browser profile.
- Sales Analytics displays the expected mock data and remains separate from inventory operations.
- The interface works on desktop, tablet, and mobile.
- Forms, tables, and interactive components provide clear feedback.
- No unapproved calculation is displayed as a confirmed business value.

## 14. Document Control

| Property | Value |
|---|---|
| Document | Storix Product Requirements Document |
| Version | 2.1 |
| Status | Draft for cross-document review — not approved for implementation |
| Last Updated | 2026-11-11 |
| Primary Related Document | `docs/BUSINESS_RULES_AND_DATA_MODEL.md` |
| UI/UX Reference | `docs/UI_UX_SPECIFICATION.md` |
| Next Step | Approve or defer D-01 through D-08, then complete cross-document review. |

## 15. Change Log

| Version | Date | Changes |
|---|---|---|
| 2.1 | 2026-11-11 | Added supplier Purchase Invoice capture as the only Stock IN source, invoice-line purchase prices, supplier-specific latest price history, current selling price, package descriptions, many-to-many product relationships, integer toman and stock units, deletion constraints, and decision gates. Aligned MVP exclusions and acceptance criteria with Business Rules. |
| 2.0 | 2026-11-02 | Established the general-purpose, frontend-focused inventory and sales analytics product scope. |
