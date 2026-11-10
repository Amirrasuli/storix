# Storix — Product Requirements Document

**Document:** Product Requirements Document  
**Version:** 2.1  
**Status:** Draft for Documentation Review  
**Last Updated:** 2026-11-11  
**Product:** Storix  
**Related Documents:** [`BUSINESS_RULES_AND_DATA_MODEL.md`](./BUSINESS_RULES_AND_DATA_MODEL.md) · [`UI_UX_SPECIFICATION.md`](./UI_UX_SPECIFICATION.md)

---

## 1. Product Overview

Storix is a frontend-focused inventory management web application with sales analytics. It combines product and warehouse stock management with a clear view of sales information.

The MVP lets one local user manage products, categories, suppliers, stock movements, and supplier purchase invoices. It also provides read-only sales reports from a separate mock dataset.

The MVP is a single-user, single-warehouse application. It uses browser LocalStorage for editable inventory data. It does not include a backend, authentication, real sales processing, customer management, or payment processing.

## 2. Product Goals

1. Give the user a clear view of current inventory and stock status.
2. Keep product, category, and supplier information organized.
3. Record stock receipts from supplier purchase invoices.
4. Preserve actual purchase prices and their history for each product and supplier.
5. Keep current selling price separate from purchase price.
6. Provide a reliable estimated inventory value based on a defined cost method.
7. Present useful sales indicators without implying that the MVP processes real sales.
8. Provide a coherent, responsive, and accessible frontend experience.

## 3. Target Users and Use Context

Storix is a general-purpose product. The MVP does not require a specific industry or business type.

| User profile | Main need |
|---|---|
| Business owner | Understand stock position and review sales indicators. |
| Inventory operator | Maintain products and record inventory movements. |
| Sales viewer | Review sample sales quantities, revenue, and product performance. |

These are design profiles, not application roles. The MVP has one local user context and no role-based permissions.

## 4. MVP Scope

### 4.1. Included

- Dashboard with inventory KPIs and selected sales indicators.
- Sales Analytics using static mock data.
- Product catalog and product details.
- Multiple categories per product.
- Multiple suppliers per product.
- Supplier and category management.
- Count-based stock quantities using whole product units or packages.
- Opening stock during product creation.
- Stock OUT with a required reason.
- Supplier purchase invoice recording as the only regular Stock IN workflow.
- Product-supplier latest purchase-price history derived from invoice records.
- Current selling price per product.
- Moving Weighted Average Cost inventory valuation.
- Inventory transaction history.
- Basic local settings for theme and table density.
- LocalStorage persistence for editable inventory data.

### 4.2. Explicitly Excluded

- Real sales transactions and sales processing.
- Sales orders and sales order details.
- Customer management and customer history.
- Sales invoices, receipts, and payment processing.
- POS integration or automatic stock deduction from sales.
- Purchase orders, supplier payment tracking, accounts payable, and supplier balances.
- Tax accounting, invoice-wide freight allocation, and full accounting reports.
- Multiple warehouses, stock transfers, and multi-location availability.
- Authentication, user accounts, roles, and permissions.
- Barcode scanning, external supplier connections, and live online price updates.
- Backend APIs, database servers, and cross-device synchronization.
- Advanced export, scheduling, notifications, and financial accounting.

Supplier purchase invoices are included only to record incoming stock and actual acquisition prices. They are not sales invoices or payment records.

## 5. Product and Data Rules

The MVP must follow the following rules. Detailed rules and data structures are defined in `BUSINESS_RULES_AND_DATA_MODEL.md`.

| Area | Requirement |
|---|---|
| Currency | `IRT`, displayed as تومان. Store money as integer tomans. |
| Stock unit | Countable product unit/package. Use whole numbers only. |
| Package contents | Description only. Do not convert stock into kilograms, liters, or other measures. |
| Product-category | Many-to-many. A product may have multiple categories. |
| Product-supplier | Many-to-many. A product may have multiple suppliers. |
| SKU | Required and unique after trimming and case normalization. |
| Minimum stock | Per-product whole-number threshold; default zero. |
| Selling price | Current product-level price. Null means not set; zero means free. |
| Purchase price | Entered from supplier invoice lines. No online price source. |
| Latest purchase price | Derived per product-supplier pair from the latest valid invoice date; show date and relative age. |
| Stock IN | Recorded through a supplier purchase invoice. |
| Stock OUT | Requires a supported non-sale reason and cannot create negative stock. |
| Cost method | Moving Weighted Average Cost. |
| Sales data | Static mock data and separate from inventory transactions. |
| Persistence | LocalStorage for editable data; no server or synchronization. |

## 6. Functional Requirements

There are 54 functional requirements in this version. FR-01 to FR-45 preserve the existing MVP module structure. FR-46 to FR-54 add purchase invoice and price-history requirements.

### 6.1. Dashboard — FR-01 to FR-07

| ID | Requirement |
|---|---|
| FR-01 | The Dashboard must display the total number of active products. |
| FR-02 | The Dashboard must display total stock quantity as the sum of whole countable product units across active products. Display the count with `عدد`; show package contents separately and do not convert them into weight or volume. |
| FR-03 | The Dashboard must display the number of low-stock products. A product is low stock when current quantity is less than or equal to its minimum stock threshold, including zero-stock products. |
| FR-04 | The Dashboard must display estimated inventory value using current Moving Weighted Average Cost. |
| FR-05 | The Dashboard must display a sales trend for a selected reporting period using sales mock data. |
| FR-06 | The Dashboard must display recent inventory transactions. |
| FR-07 | The Dashboard must display best-selling products using sales mock data, ranked by revenue by default. |

### 6.2. Product Management — FR-08 to FR-16

| ID | Requirement |
|---|---|
| FR-08 | The user must be able to create a product with a name, unique SKU, package description, minimum stock level, optional selling price, category assignments, and supplier links. |
| FR-09 | The user must be able to view product details, including current stock, stock status, current selling price, associated categories, associated suppliers, latest purchase prices by supplier, and recent inventory history. |
| FR-10 | The user must be able to update product information without changing stock quantity, historical invoice prices, or historical transaction snapshots. |
| FR-11 | The user must be able to remove a product from the active catalog only when its stock is zero. Removal must preserve historical records. |
| FR-12 | The system must enforce a required, unique SKU after trimming and case normalization. |
| FR-13 | The product list must support search by product name and SKU. |
| FR-14 | The product list must support filtering by one or more categories and by stock status. |
| FR-15 | The product list must support sorting by name, SKU, stock quantity, and supported price fields. |
| FR-16 | The product list must support pagination for long lists. |

### 6.3. Category Management — FR-17 to FR-20

| ID | Requirement |
|---|---|
| FR-17 | The user must be able to view the category list and the products assigned to a category. |
| FR-18 | The user must be able to create a category with a required name and optional description. |
| FR-19 | The user must be able to update a category. |
| FR-20 | The user must be able to delete a category only after all product assignments have been removed. |

### 6.4. Supplier Management — FR-21 to FR-25

| ID | Requirement |
|---|---|
| FR-21 | The user must be able to view supplier records and related products. |
| FR-22 | The user must be able to create a supplier with a required name and optional contact details. |
| FR-23 | The user must be able to update supplier contact information without changing historical invoice or transaction snapshots. |
| FR-24 | The user must be able to delete a supplier only when no product link or purchase invoice history references it. |
| FR-25 | The user must be able to link a product to multiple suppliers and a supplier to multiple products. Duplicate product-supplier links must be prevented. |

### 6.5. Stock Management — FR-26 to FR-32

| ID | Requirement |
|---|---|
| FR-26 | The user must be able to record Stock OUT for an active product by entering a positive whole-number quantity and a required reason. |
| FR-27 | The system must prevent Stock OUT quantities that exceed current stock. Stock must never become negative. |
| FR-28 | The user must be able to add a note to a Stock OUT operation. A note is mandatory for `ADJUSTMENT` and `OTHER`. |
| FR-29 | The system must derive current stock from the inventory transaction ledger. The user must not edit current stock directly on the Product form. |
| FR-30 | The user must be able to set opening stock when creating a product. A positive opening quantity requires a unit acquisition cost and creates one opening transaction. |
| FR-31 | The system must identify stock status as In Stock, Low Stock, or Out of Stock using the minimum-stock rule. |
| FR-32 | Every successful stock operation must create an immutable inventory transaction and update stock atomically. A failed operation must not partially update stock. |

### 6.6. Inventory Transactions — FR-33 to FR-38

| ID | Requirement |
|---|---|
| FR-33 | The user must be able to view inventory transaction history. |
| FR-34 | The user must be able to filter transaction history by product and transaction type. |
| FR-35 | The user must be able to review transaction details, including product snapshots, type, quantity, before/after stock, time, reason, and related invoice when applicable. |
| FR-36 | The system must record the transaction date and time when the movement is posted. The user must not backdate stock movements. |
| FR-37 | The system must create an Opening Stock transaction when a product is created with positive initial stock. No transaction is created for zero opening stock. |
| FR-38 | The system must preserve historical transactions after a product is archived. Inventory transactions must not be presented as confirmed sales. |

### 6.7. Sales Analytics — FR-39 to FR-43

| ID | Requirement |
|---|---|
| FR-39 | The Sales Analytics page must display sample sales quantity and revenue for a selected date range. |
| FR-40 | The page must display a sales trend chart for the selected date range. |
| FR-41 | The page must display best-selling products and product performance comparisons from mock data. |
| FR-42 | The page must calculate sample gross profit as revenue minus cost of goods sold, and gross margin when revenue is greater than zero. |
| FR-43 | The Sales Analytics page must be read-only. Stock IN, Stock OUT, purchase invoices, and product price changes must not rewrite sales mock data. |

### 6.8. Settings — FR-44 to FR-45

| ID | Requirement |
|---|---|
| FR-44 | The user must be able to select a supported theme: light, dark, or system. |
| FR-45 | The user must be able to select comfortable or compact table density. Settings must persist in LocalStorage. Currency remains fixed to IRT. |

### 6.9. Purchase Invoices and Price History — FR-46 to FR-54

| ID | Requirement |
|---|---|
| FR-46 | The user must be able to create a supplier purchase invoice with one supplier, invoice date, optional invoice number, optional note, and at least one product line. |
| FR-47 | Each invoice line must reference an active product linked to the selected supplier. A product may appear only once on an invoice in the MVP. |
| FR-48 | Each invoice line must record a positive whole-number quantity and a non-negative integer-toman unit purchase price. The entered unit price must be the net merchandise price after any line-level discount and before tax. |
| FR-49 | When an invoice is posted, the system must atomically save its header, items, and exactly one Stock IN transaction per item. If any part fails, no part may be committed. |
| FR-50 | Product details must show the latest recorded purchase price, invoice date, relative age, and supplier for each product-supplier pair, including historical suppliers whose active link was later removed. The price must be derived from valid invoice history and must not update from online sources. |
| FR-51 | Product details and product forms must support a current selling price that is independent from purchase-price history. Null and zero must have different meanings. |
| FR-52 | The system must calculate current inventory value and Stock OUT cost using Moving Weighted Average Cost. The Dashboard inventory-value KPI must use this value, not current selling price. |
| FR-53 | The user must be able to void a posted purchase invoice only when no later inventory movement exists for any affected product. Voiding must create one `PURCHASE_VOID` compensating transaction per line, preserve original records, and exclude the voided invoice from latest-price calculations. |
| FR-54 | The user must be able to view purchase invoice history and invoice details, including supplier, invoice date, items, quantities, unit prices, items subtotal, status, and void information when applicable. |

## 7. Business Rules

### 7.1. Product Relationships

- Product ↔ Category is many-to-many.
- Product ↔ Supplier is many-to-many.
- Use junction records. Do not keep only one category or one supplier ID on Product.
- Purchase price belongs to invoice history, not to Product or ProductSupplier.

### 7.2. Stock Quantities

- All stock quantities are whole numbers of countable items or packages. Display the count with `عدد`; show package contents separately.
- Package contents are descriptive only.
- A different package or size that needs separate tracking has a separate Product/SKU.
- Fractional stock and unit conversion are not supported.

### 7.3. Purchase Prices and Selling Prices

- Purchase prices come from supplier invoice lines entered by the user.
- Latest purchase price is derived separately for each product-supplier pair. Historical prices remain available after a supplier-product link is removed.
- Invoice date controls latest-price ordering. Recorded time breaks ties.
- Display invoice date and a relative-age label derived at display time.
- Product selling price is a current list price, not a record of historical sales price.
- A selling price change must not rewrite sales mock data.

### 7.4. Purchase Invoice Price Basis

- Unit purchase price is the effective per-unit line price after any line-level discount.
- Invoice-wide discounts, taxes, shipping, freight, and other charges are not included in inventory cost in the MVP.
- Display `Items Subtotal`; do not present it as a full payable invoice total.
- No payment, supplier balance, or accounts-payable workflow exists.

### 7.5. Inventory Cost

- Moving Weighted Average Cost is the MVP valuation method.
- Positive opening stock requires a unit acquisition cost.
- Every Stock IN is created by a purchase invoice item.
- Stock OUT removes inventory value at the current moving average cost.
- Estimated Inventory Value is the sum of current inventory values for active products.

### 7.6. Stock OUT

- Supported reasons: DAMAGE, INTERNAL_USE, ADJUSTMENT, OTHER.
- SALE is not supported.
- ADJUSTMENT and OTHER require a note.
- Adjustment is a downward correction only. Positive manual stock corrections are not supported.

### 7.7. Purchase Invoice Immutability

- Posted invoices and lines cannot be edited or deleted.
- A constrained full-invoice void is allowed only when each source Stock IN is the latest movement for its product.
- A successful void creates compensating movements and preserves all records.
- A voided invoice is excluded from latest purchase-price calculations.

The full formulas and edge cases are defined in `BUSINESS_RULES_AND_DATA_MODEL.md`.

## 8. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | The interface must support desktop, tablet, and mobile viewports. |
| NFR-02 | Interactive controls must be keyboard accessible and have visible focus states. |
| NFR-03 | Forms must provide clear field-level validation and useful error messages. |
| NFR-04 | The UI must distinguish loading, empty, success, validation, disabled, and error states. |
| NFR-05 | LocalStorage changes involving related records must be atomic from the user's perspective. |
| NFR-06 | The application must not imply server persistence, online price updates, or cross-device synchronization. |
| NFR-07 | Money and quantity calculations must handle safe-integer boundaries and deterministic rounding. |
| NFR-08 | Historical invoice and transaction records must preserve the snapshots needed to remain understandable after product or supplier changes. |
| NFR-09 | Sales mock data must remain separate from editable inventory data. |
| NFR-10 | Data tables, forms, charts, and status labels must remain readable and accessible at supported screen sizes. |

## 9. Main User Flows

### 9.1. Create a Product

1. Open Products and select Create Product.
2. Enter name, SKU, package description, minimum stock threshold, and optional selling price.
3. Assign zero or more categories.
4. Link zero or more suppliers.
5. Enter opening quantity. The default is zero.
6. If opening quantity is positive, enter unit acquisition cost and optionally select a linked supplier.
7. Save Product and its Opening Stock transaction as one operation.

### 9.2. Record a Supplier Purchase Invoice

1. Open Purchase Invoices and select New Purchase Invoice.
2. Select a supplier.
3. Enter the invoice date and optional invoice number/note.
4. Add one or more products that are linked to the supplier.
5. Enter quantity and effective unit price per line.
6. Review Items Subtotal and validate the entries.
7. Confirm posting.
8. Save invoice, invoice items, Stock IN transactions, and inventory values atomically.
9. Show the new price history where the invoice wins the latest-date rule.

### 9.3. Record Stock OUT

1. Open Stock Operations.
2. Select an active product and enter a positive whole-number quantity.
3. Select a non-sale reason.
4. Enter a note when the reason requires it.
5. Review the current stock and projected result.
6. Confirm the movement.
7. Save one Stock OUT transaction and update inventory value atomically.

### 9.4. Review Sales Analytics

1. Open Sales Analytics.
2. Select a quick or custom date range.
3. Review sample sales quantity, revenue, gross profit, gross margin, trend, and product ranking.
4. See a clear sample-data label.
5. No inventory movement or real sale is created.

## 10. Data and Persistence

- Editable inventory records are stored in LocalStorage under a namespaced key.
- Sales mock data is static application data and is not stored with editable inventory data.
- Related data changes must be saved atomically.
- A failed write must not produce a success message or partially update stock.
- The application must handle malformed or unsupported stored data without silently replacing it.
- The MVP does not provide backup, synchronization, multi-user conflict handling, or guaranteed recovery after browser storage is cleared.

## 11. Acceptance Criteria

The MVP is acceptable when:

- [ ] All 54 functional requirements are implemented or explicitly deferred in a scope review.
- [ ] Product-category and product-supplier many-to-many relationships work.
- [ ] All stock quantities are whole countable units.
- [ ] Purchase invoices create Stock IN transactions and preserve supplier-specific price history.
- [ ] Selling price is independent from purchase prices.
- [ ] Inventory value follows Moving Weighted Average Cost.
- [ ] Stock OUT cannot create negative stock and requires a supported reason.
- [ ] Purchase invoice voiding follows the constrained reversal rule.
- [ ] Sales Analytics uses independent mock data and does not create inventory movements.
- [ ] Money uses IRT / integer tomans.
- [ ] LocalStorage persistence is safe for related writes.
- [ ] Responsive and accessibility requirements are met.
- [ ] README, PRD, UI/UX, and Business Rules documents contain no conflicting MVP scope.

## 12. Out of Scope and Future Considerations

The following are not MVP commitments: real sales, sales orders, customers, sales invoices, payment processing, purchase orders, supplier balances, tax accounting, multiple warehouses, barcode scanning, notifications, authentication, roles, backend integration, cloud synchronization, advanced export, and scheduled reporting.

A future scope change must update the PRD before the feature is added to UI/UX or implementation plans.

## 13. Requirement Traceability

| Requirement Range | Module | Primary UI Area |
|---|---|---|
| FR-01–FR-07 | Dashboard | Dashboard and Sales Analytics |
| FR-08–FR-16 | Product Management | Product List, Product Form, Product Details |
| FR-17–FR-20 | Category Management | Categories |
| FR-21–FR-25 | Supplier Management | Suppliers and Product-Supplier assignment |
| FR-26–FR-32 | Stock Management | Stock Operations, Product Form |
| FR-33–FR-38 | Inventory Transactions | Transactions and Transaction Details |
| FR-39–FR-43 | Sales Analytics | Sales Analytics |
| FR-44–FR-45 | Settings | Settings |
| FR-46–FR-54 | Purchase Invoices and Pricing | Purchase Invoice List, Form, Details, Product Details |

## 14. Document Control

| Property | Value |
|---|---|
| Document | Storix Product Requirements Document |
| Version | 2.1 |
| Status | Draft for Documentation Review |
| Scope Authority | This PRD defines the MVP feature scope. |
| Business Rules | `docs/BUSINESS_RULES_AND_DATA_MODEL.md` |
| UI/UX Specification | `docs/UI_UX_SPECIFICATION.md` |
| Next Step | Documentation Review across the three specification documents. |

## 15. Change Log

| Version | Date | Changes |
|---|---|---|
| 2.1 | 2026-11-11 | Added supplier purchase invoices as the Stock IN workflow; invoice-based latest purchase prices per supplier; current selling price; IRT and count-based quantity rules; Moving Weighted Average Cost; constrained purchase-invoice voiding; and explicit MVP exclusions. |
| 2.0 | 2026-11-10 | Previous PRD baseline. |
