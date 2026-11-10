# Storix — Business Rules & Data Model

**Document:** Business Rules & Data Model  
**Version:** 1.4  
**Status:** Approved for Frontend Architecture  
**Last Updated:** 2026-11-11  
**Product:** Storix  
**Primary Reference:** [`PRD.md`](./PRD.md)  
**Related Reference:** [`UI_UX_SPECIFICATION.md`](./UI_UX_SPECIFICATION.md)

---

## 1. Purpose and Authority

This document defines the domain concepts, data relationships, validation rules, inventory rules, and calculations for the Storix MVP.

Use this document with the PRD and UI/UX Specification:

- The **PRD** defines the product scope and the functional and non-functional requirements.
- This document defines the business meaning, data rules, and calculations behind those requirements.
- The **UI/UX Specification** defines how users see and use the approved product behavior.
- Frontend Architecture will define implementation details. It must not change the business rules in this document.

All decisions D-01 through D-09 in this document have product-owner approval. Treat them as binding MVP rules. Any change requires an explicit product decision and updates to all affected documents.

If documents conflict, do not choose a rule by assumption. Record the conflict and resolve it across all affected documents.

## 2. Product Scope and Constraints

Storix is a general-purpose, frontend-focused application that combines inventory management with sales information and analytics.

| Area | MVP rule |
|---|---|
| Business domain | General-purpose. The product is not limited to one industry. |
| Warehouse | One warehouse only. |
| User context | One local user context. No authentication, accounts, or roles. |
| Backend | Not included. |
| Server database | Not included. |
| Editable data | Stored in browser LocalStorage. |
| Sales information | Static mock data. Read-only in the MVP. |
| Currency | Application currency identifier `IRT`; display as `تومان`. Store integer toman amounts. |
| Stock unit | One countable product item or package. |
| Quantity precision | Whole numbers only. |
| Stock receipt | Recorded through a supplier Purchase Invoice. There is no separate manual Stock IN form in the MVP. |
| Stock removal | Recorded through Stock OUT. It is not a sale. |
| Purchase invoices | Basic supplier invoice capture for stock receipt and purchase-price history only. |
| Sales operations | Real sales, sales orders, customers, sales invoices, and payments are outside the MVP. |

`IRT` is an application-level identifier in this project. The interface must display `تومان`. Do not convert values to rial or apply a factor of ten.

Purchase prices are entered by the user from supplier documents. Storix does not fetch prices from supplier websites or live market feeds.

The purchase-invoice feature is not a complete purchasing, accounting, tax, or accounts-payable module. It records the supplier document details needed to explain incoming stock and the entered unit purchase prices.

## 3. Approved Product-Owner Decisions

The following decisions are recorded as approved in the current project documentation.

| ID | Decision | Approved rule |
|---|---|---|
| A-01 | Currency | Use application currency identifier `IRT`; display amounts as تومان; store integer toman amounts. |
| A-02 | Product-category relationship | Many-to-many. A product can belong to zero, one, or many categories. A category can contain many products. |
| A-03 | Product-supplier relationship | Many-to-many. A product can be linked to more than one supplier. A supplier can supply many products. |
| A-04 | Stock unit | One countable item or package. The stored unit code is `unit`; the Persian display label is `عدد`. |
| A-05 | Quantity precision | Stock quantities and movement quantities are whole numbers only. |
| A-06 | Package contents | Package size or contents are descriptive. They do not change stock quantity or trigger unit conversion. |
| A-07 | Price support | Product records support a current selling price. Supplier purchase prices are recorded from invoice lines. |
| A-08 | Purchase-price source | Purchase prices are entered by the user from supplier invoices. No online price feed is used. |
| A-09 | Latest purchase price | Derive the latest recorded price and invoice date for each product-supplier pair. Derive its age from the invoice date. |
| A-10 | Purchase invoice capture | Basic supplier invoice header and line capture is part of Stock IN. Each saved invoice line creates one Stock IN transaction. |

Examples of the stock unit:

| Product | Package description | Stock quantity | Stored unit |
|---|---|---:|---|
| Rice | 5 kg bag | 25 | `unit` |
| Water | 1.5 L bottle | 48 | `unit` |
| Pen | Single pen | 120 | `unit` |
| Batteries | Pack of 4 | 15 | `unit` |

`25` rice bags means 25 packages. Storix does not convert that quantity to kilograms.

## 4. Domain Concepts

### 4.1. Product

A Product represents one distinct stock-keeping item or package. It has a unique SKU, a count-based stock unit, a current selling price, a minimum stock threshold, and optional package information.

A Product does not have one universal purchase price. Purchase price can vary by supplier and by invoice. Do not store a manually editable purchase price on Product or ProductSupplier.

### 4.2. Category

A Category groups products for navigation, filtering, and reporting. Product-category membership is many-to-many.

### 4.3. Supplier

A Supplier stores supplier contact information. Supplier-product relationships and purchase-invoice history identify the products supplied by that supplier.

### 4.4. Product-Supplier Relationship

This relationship identifies that a product can be purchased from a supplier. It may store a supplier-specific product code. It does not store a purchase price.

The latest purchase price is derived from Purchase Invoice history.

### 4.5. Purchase Invoice

A Purchase Invoice is a record of a supplier document entered by the user. One invoice belongs to one supplier and contains one or more product lines.

Each line stores:

- One product.
- A positive whole-number quantity.
- The entered purchase price for one countable product unit, in integer tomans.

The invoice date comes from the supplier document. The record time is the time when the user saves the invoice in Storix.

A saved invoice posts stock. It is not a purchase order, payment record, or accounts-payable entry.

### 4.6. Inventory Transaction

An Inventory Transaction is an immutable record of a stock balance change. The MVP supports these types:

- `OPENING_STOCK`: the initial quantity entered when a product is created.
- `STOCK_IN`: a receipt created by one Purchase Invoice line.
- `STOCK_OUT`: a quantity removed from available stock for a non-sale reason.

A Stock OUT record is not a sales transaction. It must not update Sales Analytics.

### 4.7. Sales Mock Entry

A Sales Mock Entry is a static sample record used only for Sales Analytics. It is not an inventory transaction and it does not represent an order or payment processed by Storix.

### 4.8. Price Concepts

| Price | Source | Meaning | History rule |
|---|---|---|---|
| Unit purchase price | Purchase Invoice Item | Entered purchase price for one countable unit on one supplier invoice line. | Immutable after posting. |
| Latest purchase price per supplier | Derived from invoice history | Latest recorded unit price for one product from one supplier. | Recalculated from invoice history. |
| Current selling price | Product | Current list/default selling price for one unit. | Can change. Do not rewrite sales mock history. |
| Cost of goods sold | Sales Mock Entry | Historical cost attached to the sample sales record. | Static mock-data value. |

Do not present these values as interchangeable.

## 5. Entity Relationships

```mermaid
erDiagram
    PRODUCT ||--o{ PRODUCT_CATEGORY : has
    CATEGORY ||--o{ PRODUCT_CATEGORY : classifies
    PRODUCT ||--o{ PRODUCT_SUPPLIER : can_be_bought_from
    SUPPLIER ||--o{ PRODUCT_SUPPLIER : supplies
    SUPPLIER ||--o{ PURCHASE_INVOICE : issues
    PURCHASE_INVOICE ||--|{ PURCHASE_INVOICE_ITEM : contains
    PRODUCT ||--o{ PURCHASE_INVOICE_ITEM : appears_on
    PURCHASE_INVOICE_ITEM ||--|| INVENTORY_TRANSACTION : creates
    PRODUCT ||--o{ INVENTORY_TRANSACTION : has_history
```

| Relationship | Cardinality | Rule |
|---|---|---|
| Product ↔ Category | Many-to-many | Use ProductCategory as the junction entity. |
| Product ↔ Supplier | Many-to-many | Use ProductSupplier as the junction entity. |
| Supplier → Purchase Invoice | One-to-many | Each invoice has exactly one supplier. |
| Purchase Invoice → Purchase Invoice Item | One-to-many | Each posted invoice has one or more lines. |
| Product → Purchase Invoice Item | One-to-many | A product may appear on many invoices over time. |
| Purchase Invoice Item → Inventory Transaction | One-to-one | Each invoice line creates exactly one Stock IN transaction. |
| Product → Inventory Transaction | One-to-many | A product can have many historical transactions. |

## 6. Data Model

These are conceptual TypeScript shapes. Final file names, folder locations, state management, and persistence implementation belong to Frontend Architecture.

### 6.1. Product

| Field | Type | Required | Rule |
|---|---|---:|---|
| `id` | `string` | Yes | Stable unique identifier. |
| `name` | `string` | Yes | Trim whitespace. Must not be empty. |
| `sku` | `string` | Yes | Required. Unique after trimming and case normalization. |
| `description` | `string \| null` | No | Plain text. |
| `packageDescription` | `string \| null` | No | Description of one stock unit, such as `5 kg bag`. Does not affect quantity calculations. |
| `sellingPriceIrt` | `number \| null` | No | Non-negative safe integer in toman for one stock unit. `null` means Not set; `0` means Free. |
| `stockUnitCode` | `"unit"` | Yes | Fixed in the MVP. Display as `عدد`. The user cannot change it. |
| `minimumStockLevel` | `number` | Yes | Non-negative safe integer. Default: `0`. User may set a product-specific threshold. |
| `createdAt` | `string` | Yes | ISO 8601 UTC timestamp. |
| `updatedAt` | `string` | Yes | ISO 8601 UTC timestamp. |

Current stock is derived from Inventory Transactions. Do not store a user-editable stock quantity on Product.

### 6.2. Category

| Field | Type | Required | Rule |
|---|---|---:|---|
| `id` | `string` | Yes | Stable unique identifier. |
| `name` | `string` | Yes | Trimmed; unique without case sensitivity. |
| `description` | `string \| null` | No | Plain text. |
| `createdAt` | `string` | Yes | ISO 8601 UTC timestamp. |
| `updatedAt` | `string` | Yes | ISO 8601 UTC timestamp. |

A category cannot be deleted while ProductCategory links reference it. The user must first remove its product assignments.

### 6.3. ProductCategory

| Field | Type | Required | Rule |
|---|---|---:|---|
| `productId` | `string` | Yes | References an active Product. |
| `categoryId` | `string` | Yes | References an active Category. |
| `assignedAt` | `string` | Yes | ISO 8601 UTC timestamp. |

The pair `productId + categoryId` must be unique. A product can have multiple categories. Removing a link does not delete either parent record.

### 6.4. Supplier

| Field | Type | Required | Rule |
|---|---|---:|---|
| `id` | `string` | Yes | Stable unique identifier. |
| `name` | `string` | Yes | Trimmed; must not be empty. |
| `contactName` | `string \| null` | No | Contact person, if known. |
| `email` | `string \| null` | No | Validate format when provided. |
| `phone` | `string \| null` | No | Store as text to preserve prefixes and formatting. |
| `address` | `string \| null` | No | Plain text. |
| `notes` | `string \| null` | No | Plain text. |
| `createdAt` | `string` | Yes | ISO 8601 UTC timestamp. |
| `updatedAt` | `string` | Yes | ISO 8601 UTC timestamp. |

### 6.5. ProductSupplier

| Field | Type | Required | Rule |
|---|---|---:|---|
| `productId` | `string` | Yes | References an active Product. |
| `supplierId` | `string` | Yes | References an active Supplier. |
| `supplierProductCode` | `string \| null` | No | Product code used by this supplier, if available. |
| `createdAt` | `string` | Yes | ISO 8601 UTC timestamp. |
| `updatedAt` | `string` | Yes | ISO 8601 UTC timestamp. |

Rules:

1. The pair `productId + supplierId` must be unique.
2. A product can link to several suppliers. A supplier can link to several products.
3. Do not store a reference price or latest price on this relationship.
4. Derive the latest purchase price from Purchase Invoice history.
5. A link can be removed without deleting the Product or Supplier. Historical invoices and transactions must retain their snapshots.
6. Removing a link must not change historical invoice lines or historical purchase prices.

### 6.6. PurchaseInvoice

| Field | Type | Required | Rule |
|---|---|---:|---|
| `id` | `string` | Yes | Stable unique identifier. |
| `supplierId` | `string` | Yes | References the supplier selected for the invoice. Retain as a historical identifier if the supplier is later unavailable. |
| `supplierNameSnapshot` | `string` | Yes | Supplier name when the invoice was posted. |
| `invoiceNumber` | `string \| null` | No | Number printed by the supplier, if available. |
| `invoiceDate` | `string` | Yes | Valid calendar date in `YYYY-MM-DD` format. |
| `note` | `string \| null` | No | Optional plain-text note. |
| `recordedAt` | `string` | Yes | ISO 8601 UTC timestamp when the invoice was saved and stock was posted. |

Rules:

1. One invoice has exactly one supplier and at least one line.
2. A product can appear only once on an invoice in the MVP.
3. The pair `purchaseInvoiceId + productId` must be unique.
4. The supplier name is snapshotted for historical readability.
5. `invoiceDate` determines the date used for latest-price ordering. `recordedAt` records when Storix received the data.
6. A posted invoice and its lines are immutable in the MVP. Do not provide edit, delete, void, or reversal actions.
7. The MVP does not capture or allocate invoice-level discounts, taxes, shipping, or other charges. Use the entered line unit price as the recorded acquisition-cost basis. Label the sum of line amounts as `Recorded Purchase Subtotal`, not as the supplier’s final payable amount.

### 6.7. PurchaseInvoiceItem

| Field | Type | Required | Rule |
|---|---|---:|---|
| `id` | `string` | Yes | Stable unique identifier. |
| `purchaseInvoiceId` | `string` | Yes | References the parent invoice. |
| `productId` | `string` | Yes | References the product received. Retain as a historical identifier if the active product is deleted. |
| `productNameSnapshot` | `string` | Yes | Product name when the invoice was posted. |
| `skuSnapshot` | `string` | Yes | Product SKU when the invoice was posted. |
| `packageDescriptionSnapshot` | `string \| null` | No | Package description when the invoice was posted. |
| `quantity` | `number` | Yes | Positive safe integer count of product units. |
| `unitPurchasePriceIrt` | `number` | Yes | Entered unit purchase price in integer tomans. This is the acquisition-cost basis used by MWAC. Invoice-level adjustments are not captured in the MVP. |

The line amount is `quantity × unitPurchasePriceIrt`. The invoice total is the sum of line amounts and must be labelled `Recorded Purchase Subtotal`. It is not represented as the supplier’s final payable amount because invoice-level adjustments are outside the MVP.

Rules:

1. The product must be linked to the invoice supplier before the invoice is posted.
2. Quantity must be a positive safe integer.
3. Unit purchase price must be a non-negative safe integer in toman.
4. Each posted line creates exactly one `STOCK_IN` transaction.
5. The same product cannot appear twice on one invoice in the MVP.
6. Posted invoice lines are immutable.
7. Store product snapshots so invoice history remains readable after product edits or deletion.

### 6.8. InventoryTransaction

| Field | Type | Required | Rule |
|---|---|---:|---|
| `id` | `string` | Yes | Stable unique identifier. |
| `productId` | `string` | Yes | Active or historical product identifier. |
| `productNameSnapshot` | `string` | Yes | Product name at the time of the movement. |
| `skuSnapshot` | `string` | Yes | SKU at the time of the movement. |
| `packageDescriptionSnapshot` | `string \| null` | No | Package description at the time of the movement. |
| `type` | `InventoryTransactionType` | Yes | `OPENING_STOCK`, `STOCK_IN`, or `STOCK_OUT`. |
| `purchaseInvoiceItemId` | `string \| null` | Conditional | Required for `STOCK_IN`; unique across transactions. |
| `sequence` | `number` | Yes | Increasing sequence for this product. |
| `quantity` | `number` | Yes | Positive safe integer. |
| `quantityBefore` | `number` | Yes | Stock immediately before the movement. |
| `quantityAfter` | `number` | Yes | Stock immediately after the movement. |
| `supplierIdSnapshot` | `string \| null` | Conditional | Required for invoice Stock IN. Optional for opening stock if known. |
| `supplierNameSnapshot` | `string \| null` | Conditional | Required for invoice Stock IN. Optional for opening stock if known. |
| `unitPurchasePriceIrt` | `number \| null` | Conditional | Required for `OPENING_STOCK` and `STOCK_IN`. Integer toman amount per unit. |
| `costRemovedIrt` | `number \| null` | Conditional | Total cost removed for `STOCK_OUT`, calculated using the approved MWAC rule. |
| `reason` | `StockOutReason \| null` | Conditional | Required for every `STOCK_OUT`. Allowed values: `DAMAGE`, `INTERNAL_USE`, `OTHER`. |
| `note` | `string \| null` | No | Optional user note. |
| `occurredAt` | `string` | Yes | ISO 8601 UTC timestamp created by the application. |

Rules:

1. Transaction snapshots must remain readable after related records change or are deleted.
2. Transactions are immutable in the MVP.
3. Each product movement receives an increasing `sequence` value.
4. `quantityAfter` must equal `quantityBefore + quantity` for a positive movement and `quantityBefore - quantity` for Stock OUT.
5. Every saved invoice line must reference exactly one Stock IN transaction.
6. A Stock OUT transaction must not reference a purchase invoice item.

### 6.9. SalesMockEntry

| Field | Type | Required | Rule |
|---|---|---:|---|
| `id` | `string` | Yes | Stable mock record identifier. |
| `date` | `string` | Yes | Calendar date in `YYYY-MM-DD` format. |
| `productKey` | `string` | Yes | Stable key within the mock dataset. |
| `linkedProductId` | `string \| null` | No | Explicit link to an active Product, when one exists. |
| `productNameSnapshot` | `string` | Yes | Display name from the mock dataset. |
| `skuSnapshot` | `string \| null` | No | SKU shown for reference. |
| `quantity` | `number` | Yes | Positive safe integer count of sold items/packages in the sample data. |
| `revenueIrt` | `number` | Yes | Non-negative safe integer toman amount. |
| `costOfGoodsSoldIrt` | `number` | Yes | Non-negative safe integer toman amount supplied by the mock dataset. |

Rules:

1. Sales mock entries are static application data. Do not store them with editable inventory data in LocalStorage.
2. Use an explicit `linkedProductId` only when the mock record is intentionally linked to an active Product.
3. A matching product name or SKU alone is not enough to create a link.
4. Changing a Product selling price must not rewrite historical SalesMockEntry values.
5. Stock movements and Purchase Invoices must not create or update sales entries.
6. At most one entry is allowed for each `date + productKey` pair.

### 6.10. AppSettings

| Field | Type | Required | Rule |
|---|---|---:|---|
| `theme` | `"light" \| "dark" \| "system"` | Yes | Default: `system`. |
| `tableDensity` | `"comfortable" \| "compact"` | Yes | Default: `comfortable`. |

Currency is fixed to IRT for the MVP. Do not add a currency selector.

## 7. Quantity and Package Rules

### 7.1. Inventory Unit

The MVP has one stock unit: one countable product item or package. Store `unit` and display `عدد`.

Do not use kilograms, grams, liters, meters, or other physical measures as stock quantity units.

### 7.2. Package Description

`packageDescription` describes one countable stock unit. Examples: `5 kg bag`, `12-unit box`, or `1.5 L bottle`.

It is descriptive only. Storix does not multiply or divide stock quantity by package contents.

### 7.3. Quantity Validation

1. Stock quantities and minimum stock levels must be finite, non-negative safe integers.
2. Movement quantities must be positive safe integers.
3. Decimal values are invalid.
4. Reject negative values, `NaN`, infinity, and values outside the safe integer range.
5. Do not offer unit conversion in the MVP.
6. The stock unit cannot be changed by the user.

## 8. Currency and Price Rules

### 8.1. Currency Representation

- Store all money values as integer toman amounts.
- Display the currency as `تومان`.
- Do not store floating-point currency values.
- Do not mix rial and toman.
- Do not multiply or divide values by ten for storage or display.
- Use one shared formatting rule across the application.

### 8.2. Purchase Price Source and Update Rules

1. Purchase prices come from supplier invoices entered by the user.
2. Do not add manual latest-price editing.
3. When an invoice is posted, each line stores its unit purchase price and invoice date is available through the parent invoice.
4. The latest purchase price is derived separately for each product-supplier pair.
5. A newer invoice date becomes the latest record for that pair. If two records have the same invoice date, use `recordedAt` descending as the tie-breaker.
6. A product can have different latest prices from different suppliers.
7. Do not overwrite an old invoice-line price when a later invoice has a different price.
8. Show the latest price, supplier, invoice date, and relative age for each product-supplier pair.
9. Do not show a product-level purchase price without identifying its supplier.
10. If there is no invoice history for a pair, show `No recorded purchase`.

### 8.3. Selling Price

The current selling price belongs to Product. It is the current default/list price for one countable product unit.

- `null` means the price has not been set.
- `0` means the Product is intentionally free.
- A positive integer is the current selling price in toman for one stock unit.
- Negative, decimal, non-finite, and unsafe integer values are invalid.
- The UI must display `Not set` for `null` and `Free` for `0`.

This is not a historical sales price. Sales Analytics uses SalesMockEntry values and must not calculate historical revenue from the current Product selling price.

### 8.4. Invoice Line Amount

Calculate each line amount as:

`Line Amount = Quantity × Unit Purchase Price`

The invoice-level `Recorded Purchase Subtotal` is the sum of all line amounts. The MVP does not capture invoice-level discount, tax, shipping, or other charges and does not allocate these amounts to product costs. Use the recorded unit line price as the acquisition-cost basis for inventory valuation. Do not label the subtotal as the supplier’s final payable amount.

## 9. Inventory Valuation

### 9.1. Approved Method: Moving Weighted Average Cost

Storix uses Moving Weighted Average Cost (MWAC) for inventory valuation. The method applies to each Product in the single warehouse. It does not track purchase lots or serial-level cost.

Derive these values for each Product by replaying its ordered Inventory Transaction ledger:

- `quantityOnHand`: the current quantity from the transaction ledger.
- `inventoryValueIrt`: the remaining carrying value in integer tomans.
- `averageUnitCost`: the derived value `inventoryValueIrt / quantityOnHand` when quantity is greater than zero.

Do not treat these as manually editable Product fields. Keep the transaction ledger as the source of truth. Derive carrying value and average unit cost from the immutable transaction cost snapshots.

### 9.2. Receipt Calculation

Let:

- `Q` = quantity on hand before a receipt.
- `V` = inventory carrying value before a receipt, in integer tomans.
- `q` = quantity received.
- `p` = recorded unit acquisition cost in integer tomans.

For each opening-stock or invoice receipt:

```text
New Quantity = Q + q
New Carrying Value = V + (q × p)
New Average Cost = New Carrying Value / New Quantity
```

Store carrying-value totals as integer tomans. The average unit cost may be fractional. Keep the exact rational result for calculation where practical; do not round the average unit cost before calculating a later movement.

### 9.3. Stock OUT Cost and Rounding

For a partial Stock OUT:

```text
Cost Removed = round-half-up(
  Stock OUT Quantity × Carrying Value Before / Quantity Before
)
```

Rules:

1. Round a non-negative Stock OUT cost to the nearest whole toman. Exact half values round up.
2. If Stock OUT removes the full remaining quantity, remove the full remaining carrying value. Do not leave a residual value because of rounding.
3. The new carrying value must never be negative.
4. Use safe integer arithmetic. Check multiplication and totals for overflow before saving.
5. Store `costRemovedIrt` on the Stock OUT transaction as an immutable snapshot.

### 9.4. Estimated Inventory Value KPI

Calculate:

`Estimated Inventory Value = Sum(Product Inventory Carrying Value)`

Display this metric on the Dashboard. Label it as estimated acquisition cost of current stock. It is not selling value, market value, revenue, profit, or cash balance.

All opening stock with a positive quantity must have a known acquisition cost. All invoice receipts have a recorded unit purchase price. Therefore, the MVP has a cost basis for all stock created through supported flows. If stored data fails validation or a required cost is missing, show an unavailable state and report the data problem. Do not substitute zero.

## 10. Inventory Business Rules

### 10.1. Current Stock Formula

For each Product:

`Current Stock = OPENING_STOCK + STOCK_IN - STOCK_OUT`

The transaction ledger is the source of truth. Do not let the user edit current stock directly.

### 10.2. Product Creation and Opening Stock

1. Product creation may include an opening stock quantity. Its default is zero. This is separate from the minimum stock threshold, which also defaults to zero.
2. If the opening quantity is greater than zero, create exactly one `OPENING_STOCK` transaction in the same save operation as the Product.
3. The opening transaction starts with `quantityBefore = 0` and ends with `quantityAfter = initialStockQuantity`.
4. Positive opening stock requires a known, non-negative integer-toman acquisition cost per unit.
5. Supplier is optional because the original supplier may be unknown. If a supplier is selected, it must already be linked to the Product.
6. Do not create a Purchase Invoice for opening stock.
7. If the opening quantity is zero, do not create a transaction.
8. Do not create an extra `STOCK_IN` transaction for opening stock.
9. Product creation and its opening transaction must save together. A failure must not leave one without the other.

### 10.3. Purchase Invoice Posting and Stock IN

1. The selected supplier must exist.
2. The invoice date must be a valid calendar date.
3. The invoice must contain at least one line.
4. Each line must refer to an existing product linked to the selected supplier.
5. The quantity must be a positive whole number.
6. The unit purchase price must be a non-negative safe integer in tomans.
7. A product may appear only once on one invoice in the MVP.
8. Each saved invoice line creates exactly one `STOCK_IN` transaction.
9. The transaction quantity must equal its invoice-line quantity.
10. The product's stock increases by the line quantity.
11. The invoice header, all lines, all Stock IN transactions, and updated stock data must be saved together.
12. Prevent duplicate submission while the save is in progress.
13. If validation or persistence fails, do not save a partial invoice or a partial stock update.
14. A posted invoice and its lines are immutable in the MVP. Do not provide edit, delete, void, or reversal actions.
15. The unit price entered on each line is the acquisition-cost basis for that receipt. Invoice-level adjustments are not captured or allocated.
16. A posted invoice cannot be corrected in the MVP. Warn the user before final confirmation.

### 10.4. Stock OUT

1. The selected product must exist.
2. Quantity must be a positive whole number.
3. Quantity must not exceed current stock.
4. Resulting stock must not be negative.
5. Create exactly one `STOCK_OUT` transaction only after validation passes.
6. A reason is required. Allowed values are `DAMAGE`, `INTERNAL_USE`, and `OTHER`. Do not include `SALE` or `ADJUSTMENT`.
7. Require a note when the reason is `OTHER`.
8. A Stock OUT operation is not a sale and does not update SalesMockEntry.
9. Calculate and snapshot the cost removed using MWAC.
10. If validation or persistence fails, do not change stock and do not create a transaction.

### 10.5. Transaction Ordering and Immutability

1. Inventory transactions cannot be edited or deleted in the MVP.
2. Do not backdate stock movements. The application creates `occurredAt` at save time.
3. Each product transaction receives an increasing `sequence` value.
4. Use the sequence to keep transaction replay order stable.
5. The MVP does not provide transaction edit, delete, undo, adjustment, or reversal actions. Do not reverse a Stock OUT by creating a manual Stock IN; Stock IN is created only by posting a Purchase Invoice.
6. A Stock OUT error cannot be corrected in the MVP. The UI must warn the user before posting. A future version may add auditable compensating transactions; it must not mutate or delete the original ledger entry.
7. Inventory corrections must not rewrite an immutable Purchase Invoice or its purchase-price history.

### 10.6. Product Deletion

A Product can be deleted only when its current stock is zero.

When a zero-stock Product is deleted:

- Remove the active Product record.
- Remove its ProductCategory and ProductSupplier links.
- Keep all Inventory Transactions.
- Keep all PurchaseInvoice and PurchaseInvoiceItem records.
- Keep historical product name, SKU, package description, supplier, unit price, quantity, and date snapshots.
- Retain `productId` values in historical records as identifiers. Historical records must not require the active Product to exist.

### 10.7. Category Deletion

A Category cannot be deleted while one or more ProductCategory links refer to it. The user must remove those assignments first. Do not silently remove the category from products without telling the user.

### 10.8. Supplier Deletion

A Supplier cannot be deleted while it has active ProductSupplier links or Purchase Invoice history. The user must remove active product links first. A supplier with historical invoices must remain available so the invoice history can be read.

### 10.9. Purchase Invoice Correction

Posted Purchase Invoices and their lines are immutable in the MVP.

- The user may edit the form before posting.
- The UI must show a review step and require explicit confirmation before posting.
- After posting, invoice details are read-only.
- Do not offer edit, delete, void, or reversal actions.
- A posted invoice cannot be corrected in the MVP. Warn the user before posting.
- A future version may add a linked invoice reversal workflow that also reverses the related stock and cost effects. It must preserve the original invoice and transactions.

## 11. Low-Stock Rules and Dashboard Metrics

### 11.1. Stock Status

Let `Q` be current stock and `M` be the product minimum stock level.

| Display status | Condition |
|---|---|
| Out of Stock | `Q = 0` |
| Low Stock | `Q > 0` and `Q <= M` |
| In Stock | `Q > M` |

### 11.2. Low-Stock Count

The Dashboard low-stock count uses `Q <= M`. This count includes zero-stock products. The visible status for a zero-stock product remains `Out of Stock`.

### 11.3. Dashboard Metrics

| Metric | Calculation | Availability |
|---|---|---|
| Total Products | Count active Product records. | MVP |
| Total Units in Stock | Sum current stock across active products. | MVP |
| Low-Stock Products | Count active products where `Q <= M`. | MVP |
| Estimated Inventory Value | Sum the current inventory carrying value for all active Products. | MVP; calculated using MWAC. |
| Recent Inventory Transactions | Latest transactions by `occurredAt` descending, then `sequence`. | MVP |
| Best-Selling Products | Sales mock entries grouped by product and ranked by revenue descending. | MVP, mock data only |

Total Units in Stock counts items or packages. It does not mean combined kilograms, liters, or physical contents.

## 12. Sales Analytics Rules

### 12.1. Data Separation

1. Sales mock data is static application data, not editable inventory LocalStorage data.
2. Stock IN and Stock OUT do not create, update, or delete sales entries.
3. Product selling-price changes do not rewrite historical sales mock data.
4. Purchase Invoices do not rewrite historical sales mock data.
5. Product deletion does not delete SalesMockEntry records.
6. Show a product link only when `linkedProductId` points to an active Product.
7. A matching product name or SKU alone is not enough to create a product link.

### 12.2. Revenue and Cost Metrics

For a selected date range:

`Total Revenue = Sum(revenueIrt)`

`Total Cost of Goods Sold = Sum(costOfGoodsSoldIrt)`

`Gross Profit = Total Revenue - Total Cost of Goods Sold`

`Gross Margin (%) = (Gross Profit / Total Revenue) × 100`

When total revenue is zero, show `—` for Gross Margin. Gross Profit is not net profit. The MVP does not calculate tax, shipping, discounts, rent, payroll, overhead, or other operating expenses.

The mock dataset must supply revenue and cost values. Do not derive historical revenue from current Product selling prices or derive sales cost from current inventory valuation.

Gross Profit and Gross Margin are approved visible metrics on the Sales Analytics page. Do not add them as required Dashboard KPI cards. They use only SalesMockEntry data and remain clearly labelled as simulated values.

### 12.3. Best-Selling Products and Comparisons

1. Default ranking is by total revenue, descending.
2. Show quantity sold as a whole count of items/packages.
3. Revenue comparisons use IRT/toman.
4. Quantity comparisons count product units. Show package descriptions where needed.
5. Use product name as the final stable tie-breaker when revenue values are equal.
6. Label each comparison metric, for example `Revenue (تومان)` or `Quantity (عدد)`.

### 12.4. Date-Range Rules

Sales mock dates use `YYYY-MM-DD` calendar dates.

- Quick ranges include the current browser-local calendar date.
- Last 7, 30, and 90 days include today and the preceding calendar days.
- Last 12 months starts on the first day of the calendar month 11 months before the current month and ends on the current browser-local date.
- A custom range includes both selected dates.
- Start date must not be after end date.
- All Sales Analytics widgets use the same selected range.
- The end date is inclusive because mock entries use calendar dates, not timestamps.

## 13. LocalStorage Persistence

Persist editable application data under one namespaced key:

`storix:app-data`

Proposed persisted envelope:

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

SalesMockEntry is static application data and is not part of this envelope.

Persistence rules:

1. Load and validate the stored envelope before use.
2. If no saved data exists, initialize empty inventory collections and default settings.
3. Save related changes in one serialized envelope. Product creation plus opening stock, and Purchase Invoice posting plus its lines, transactions, and stock updates, must be one logical operation.
4. Do not report success until the LocalStorage write succeeds.
5. If a write fails, keep the previous persisted state and show a useful error.
6. Handle malformed or unsupported data safely. Do not silently overwrite data that cannot be parsed.
7. Keep `schemaVersion` so a future migration can be added.
8. The MVP has no cross-device synchronization or multi-user concurrency guarantees.

## 14. Validation and Data Integrity

| Data | Validation |
|---|---|
| Product name | Required after trimming. |
| SKU | Required; normalized; unique without case sensitivity. |
| Package description | Optional text. Must not affect quantity. |
| Selling price | `null` or a non-negative safe integer in toman. Zero is valid and means Free. |
| Minimum stock | Non-negative safe integer. Default is `0`. |
| ProductCategory | Both records must exist; pair must be unique. |
| Supplier name | Required after trimming. |
| ProductSupplier | Both records must exist; pair must be unique. |
| Purchase Invoice supplier | Required; supplier must exist. |
| Purchase Invoice date | Required valid `YYYY-MM-DD` calendar date. |
| Purchase Invoice lines | At least one line; no duplicate product lines. |
| Purchase Invoice line product | Product must exist and be linked to the invoice supplier. |
| Purchase Invoice quantity | Positive safe integer. |
| Purchase Invoice unit price | Non-negative safe integer toman amount. |
| Opening stock quantity | Non-negative safe integer. |
| Opening stock cost | Required as a known non-negative integer-toman unit cost when opening quantity is positive. |
| Stock quantity | Non-negative safe integer. |
| Movement quantity | Positive safe integer. |
| Stock OUT | Cannot exceed current stock. |
| Stock OUT reason | Required; one of `DAMAGE`, `INTERNAL_USE`, or `OTHER`. Require a note for `OTHER`. |
| Transaction snapshots | Required where defined; immutable after creation. |
| Sales quantity | Positive safe integer. |
| Sales revenue | Non-negative safe integer toman amount. |
| Sales cost of goods sold | Non-negative safe integer toman amount. |
| Sales date | Valid `YYYY-MM-DD` calendar date. |
| Sales mock uniqueness | At most one entry for each `date + productKey` pair. |

All numeric inputs must reject required blank values, `NaN`, infinity, prohibited negative values, decimal quantities, and values outside the safe integer range.

## 15. TypeScript Domain Types (Conceptual)

These types communicate the domain shape. They do not choose file locations or architecture.

```ts
export type CurrencyCode = "IRT";
export type StockUnitCode = "unit";

export type InventoryTransactionType =
  | "OPENING_STOCK"
  | "STOCK_IN"
  | "STOCK_OUT";

export type StockOutReason =
  | "DAMAGE"
  | "INTERNAL_USE"
  | "OTHER";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  packageDescription?: string | null;
  sellingPriceIrt: number | null;
  stockUnitCode: StockUnitCode;
  minimumStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  productId: string;
  categoryId: string;
  assignedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSupplier {
  productId: string;
  supplierId: string;
  supplierProductCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseInvoice {
  id: string;
  supplierId: string;
  supplierNameSnapshot: string;
  invoiceNumber: string | null;
  invoiceDate: string;
  note?: string | null;
  recordedAt: string;
}

export interface PurchaseInvoiceItem {
  id: string;
  purchaseInvoiceId: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  packageDescriptionSnapshot?: string | null;
  quantity: number;
  unitPurchasePriceIrt: number;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  packageDescriptionSnapshot?: string | null;
  type: InventoryTransactionType;
  purchaseInvoiceItemId?: string | null;
  sequence: number;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  supplierIdSnapshot?: string | null;
  supplierNameSnapshot?: string | null;
  unitPurchasePriceIrt?: number | null;
  costRemovedIrt?: number | null;
  reason?: StockOutReason | null;
  note?: string | null;
  occurredAt: string;
}

export interface SalesMockEntry {
  id: string;
  date: string;
  productKey: string;
  linkedProductId?: string | null;
  productNameSnapshot: string;
  skuSnapshot?: string | null;
  quantity: number;
  revenueIrt: number;
  costOfGoodsSoldIrt: number;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  tableDensity: "comfortable" | "compact";
}
```

## 16. Acceptance Scenarios

These scenarios define business outcomes. They are not UI wireframes or code-level test instructions.

### 16.1. Product and Relationship Management

1. Create a Product with a unique SKU and package description.
2. Assign more than one Category to the Product.
3. Link the Product to more than one Supplier.
4. Verify duplicate ProductCategory and ProductSupplier pairs are rejected.
5. Verify the stock unit is fixed to one countable item/package.
6. Verify decimal stock quantities are rejected.

### 16.2. Purchase Invoice and Stock IN

1. Create a Supplier and link Product A to that Supplier.
2. Create a Purchase Invoice with the Supplier, invoice date, and at least one product line.
3. Enter a positive whole-number quantity and a unit purchase price for each line.
4. Save the invoice.
5. Verify the invoice header, all lines, and exactly one Stock IN transaction per line are saved together.
6. Verify stock increases by the sum of invoice-line quantities.
7. Verify the latest purchase price view shows the price and invoice date for each product-supplier pair.
8. Try to add the same Product twice to one invoice. Verify the duplicate is blocked.
9. Try to add a Product that is not linked to the selected Supplier. Verify the user must create the relationship before posting.
10. Simulate a persistence failure. Verify that the invoice and stock transactions are not partially saved.

### 16.3. Stock OUT

1. Select a Product with available stock.
2. Enter a positive whole-number quantity that does not exceed stock.
3. Select one reason: `DAMAGE`, `INTERNAL_USE`, or `OTHER`. When `OTHER` is selected, enter a note.
4. Save the operation.
5. Verify exactly one Stock OUT transaction is created and stock is reduced.
6. Try to remove more stock than is available. Verify the operation is rejected with no data change.
7. Verify SalesMockEntry data remains unchanged.

### 16.4. Opening Stock

1. Create a Product with opening quantity zero. Verify no opening transaction is created.
2. Create another Product with positive opening quantity.
3. Enter a known, non-negative integer-toman unit acquisition cost.
4. Verify exactly one OPENING_STOCK transaction is created with the correct before and after quantities.
5. Simulate a persistence failure. Verify neither the Product nor the opening transaction is partially saved.

### 16.5. Latest Purchase Price

1. Record two invoices for the same Product-Supplier pair on different invoice dates.
2. Verify the later invoice date determines the latest purchase price.
3. Record invoices from two Suppliers for the same Product.
4. Verify Storix shows a separate latest price for each Supplier.
5. Verify invoice history values do not change after a newer invoice is added.
6. Verify the relative age is derived from invoice date and updates at display time.

### 16.6. Deletion and Historical Data

1. Try to delete a Product with positive stock. Verify deletion is blocked.
2. Delete a Product with zero stock. Verify historical transactions and invoice lines remain readable.
3. Try to delete a Category with linked Products. Verify deletion is blocked until links are removed.
4. Try to delete a Supplier with linked Products or invoice history. Verify deletion is blocked.

### 16.7. Sales Analytics

1. Load SalesMockEntry records for a selected date range.
2. Verify revenue and quantity use only the mock dataset.
3. Verify Stock OUT does not change sales quantity or revenue.
4. Change the Product selling price. Verify historical mock revenue and cost remain unchanged.
5. Verify date filters use the same range across all sales widgets.
6. When displayed, verify Gross Profit and Gross Margin use the defined formulas and zero revenue does not cause division by zero.

### 16.8. Currency Formatting

1. Enter a value such as `160000`.
2. Verify that the UI displays `۱۶۰٬۰۰۰ تومان` or a consistent equivalent.
3. Verify that stored value remains integer `160000`.
4. Verify that Storix does not convert toman to rial or apply decimal minor-unit scaling.

## 17. Approved Product Decisions

The product owner approved all decisions below on 2026-11-11. These decisions are binding for the MVP.

| ID | Decision | Approved MVP rule |
|---|---|---|
| D-01 | Inventory valuation | Use Moving Weighted Average Cost (MWAC). Store carrying-value totals as integer toman amounts. Use round-half-up for partial Stock OUT cost. A full Stock OUT removes the full remaining carrying value. |
| D-02 | Default minimum stock | Default `minimumStockLevel` to `0`. Allow a non-negative whole-number threshold per Product. Low-stock count uses `Q <= M`; zero-stock status remains `Out of Stock`. |
| D-03 | Zero selling price | Allow `0` to mean Free. Use `null` to mean Not set. Reject negative, decimal, non-finite, and unsafe integer values. |
| D-04 | Opening stock cost | Require a known, non-negative integer-toman unit acquisition cost when opening quantity is positive. Supplier is optional. |
| D-05 | Invoice-level adjustments | Do not capture or allocate invoice-level discounts, taxes, shipping, or other charges. The entered invoice-line unit price is the cost basis for MWAC. Label line totals as `Recorded Purchase Subtotal`. |
| D-06 | Stock OUT reasons | Allow `DAMAGE`, `INTERNAL_USE`, and `OTHER`. Do not include `SALE` or `ADJUSTMENT`. Require a note for `OTHER`. |
| D-07 | Posted Purchase Invoice correction | Posted invoices are immutable. No edit, delete, void, or reversal actions in the MVP. |
| D-08 | Inventory transaction correction | Posted transactions are immutable. No edit, delete, undo, adjustment, or reversal actions in the MVP. Warn before Stock OUT posting. |
| D-09 | Gross Profit and Gross Margin | Show both metrics on Sales Analytics using SalesMockEntry only. Do not add them as required Dashboard KPI cards. |

### 17.1. Implementation Constraints

- The MVP has no post-posting correction workflow for Purchase Invoices or inventory transactions. This is a deliberate limitation, not an unresolved decision.
- The UI must show a review and confirmation step before posting a Purchase Invoice or Stock OUT.
- MWAC uses only recorded opening-stock costs and invoice-line prices. It excludes invoice-level charges that the MVP does not capture.
- Gross Profit and Gross Margin are simulated metrics. They are not actual business profit figures.
- Any change to these rules requires updates to this document, the PRD, and the UI/UX Specification.

## 18. Definition of Done for This Document

- [x] Currency and money storage are defined.
- [x] Product-category relationship is many-to-many.
- [x] Product-supplier relationship is many-to-many.
- [x] Stock quantity is a whole count of items/packages.
- [x] Package contents are descriptive only.
- [x] Purchase prices come from supplier invoices.
- [x] Latest purchase price is derived per product-supplier pair.
- [x] Current selling price is separate from purchase-price history.
- [x] Purchase invoice posting creates Stock IN transactions.
- [x] Product, invoice, transaction, and sales mock concepts are separated.
- [x] Historical data and deletion rules are defined.
- [x] D-01 through D-09 are approved and recorded.
- [x] Inventory valuation and rounding are defined.
- [x] Opening stock cost and invoice-line cost rules are defined.
- [x] Stock OUT reasons and immutability rules are defined.
- [x] PRD and UI/UX traceability has been updated.
- [x] Cross-document terminology and decision status have been reviewed.

## 19. Document Control

| Property | Value |
|---|---|
| Document | Storix — Business Rules & Data Model |
| Version | 1.4 |
| Status | Approved for Frontend Architecture |
| Last Updated | 2026-11-11 |
| Primary Reference | `docs/PRD.md` |
| Related Reference | `docs/UI_UX_SPECIFICATION.md` |
| Next Step | Begin Frontend Architecture. Business rules are fixed for the MVP unless a documented product change is approved. |

## 20. Change Log

| Version | Date | Changes |
|---|---|---|
| 1.4 | 2026-11-11 | Applied product-owner approval for D-01 through D-09. Finalized MWAC valuation and rounding, minimum-stock default, zero selling-price semantics, opening-stock cost, invoice-line cost basis, Stock OUT reasons, immutable posted records, and Sales Analytics profit metrics. Removed all open-decision gates. |
| 1.2 | 2026-11-11 | Added invoice-based purchase prices, PurchaseInvoice and PurchaseInvoiceItem, latest purchase price per product-supplier pair, and purchase invoice capture as part of Stock IN. |
| 1.1 | 2026-11-11 | Applied IRT currency, many-to-many product relationships, and count-based stock quantity decisions. |
