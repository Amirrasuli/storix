# Storix — Open Decisions Review

**Document:** Open Decisions Review  
**Version:** 1.0  
**Date:** 2026-11-11  
**Status:** Recommendations for product-owner approval  
**Related documents:** `PRD.md`, `BUSINESS_RULES_AND_DATA_MODEL.md`, `UI_UX_SPECIFICATION.md`

---

## 1. Purpose

This document reviews the open product decisions D-01 through D-08 in the Storix MVP documents. It gives one recommended rule for each decision and explains the effect on the product.

These recommendations are **not product-owner approvals**. Do not change a decision to `Approved` or treat it as an implementation rule until the product owner confirms it.

The current product scope remains frontend-focused, one warehouse, one local user context, LocalStorage persistence, and read-only sales mock data. This review does not add backend, accounting, real sales, or multi-warehouse features.

## 2. Decision Summary

| ID | Topic | Recommended outcome | Main impact |
|---|---|---|---|
| D-01 | Inventory valuation | Approve Moving Weighted Average Cost (MWAC), with integer-toman rounding rules. | Enables inventory cost and Stock OUT cost calculations. |
| D-02 | Default minimum stock | Approve a default of `0`; allow a user-defined non-negative whole-number threshold per Product. | Finalizes low-stock defaults. |
| D-03 | Zero selling price | Approve `0` as a valid price for a deliberately free Product; use `null` for not set. | Finalizes price validation and display. |
| D-04 | Opening stock cost | Require a known non-negative unit acquisition cost when opening quantity is greater than zero. Supplier remains optional. | Makes opening stock eligible for valuation. |
| D-05 | Invoice-level adjustments | Exclude separate invoice-level discount, tax, shipping, and charge allocation from the MVP. Use the invoice-line unit price as the recorded cost basis. | Keeps the invoice form simple; limits the meaning of inventory cost. |
| D-06 | Stock OUT reasons | Approve `DAMAGE`, `INTERNAL_USE`, and `OTHER`. Exclude `SALE` and `ADJUSTMENT`. | Finalizes the Stock OUT reason field. |
| D-07 | Posted invoice correction | Keep posted Purchase Invoices immutable. No edit, delete, void, or reversal workflow in the MVP. | Protects the invoice-to-stock ledger relationship. |
| D-08 | Inventory transaction correction | Keep posted inventory transactions immutable. Defer adjustment and reversal workflows. | Avoids ledger mutation but leaves no post-save correction path in the MVP. |

## 3. Decision Details

### D-01 — Inventory Valuation Method

**Recommendation: Approve Moving Weighted Average Cost (MWAC).**

Reason:

- Storix has one warehouse and one pooled stock balance per Product.
- The MVP does not track lots, batches, serial numbers, or expiry dates.
- The same Product can be purchased from multiple Suppliers at different prices.
- MWAC reflects the combined cost of stock on hand without requiring lot-level stock allocation.

Recommended rules:

1. Keep the current stock quantity and current inventory carrying value for each Product.
2. On opening stock or a Purchase Invoice receipt, add the movement quantity and its recorded acquisition cost to the current balance.
3. Calculate the new average cost from the new total carrying value divided by the new total quantity. Do not store a rounded per-unit average as the source of truth.
4. On Stock OUT, remove cost using the average cost immediately before the movement.
5. Store money totals as integer toman amounts.
6. Round a non-negative Stock OUT cost to the nearest whole toman, with exact half values rounded up.
7. When a Stock OUT removes the full remaining quantity, remove the full remaining carrying value. Do not let rounding leave a residual value or create a negative value.
8. Use safe integer arithmetic. Check multiplication and total values for overflow before saving.

Formula for a receipt:

```text
New Quantity = Previous Quantity + Received Quantity
New Carrying Value = Previous Carrying Value + (Received Quantity × Recorded Unit Cost)
New Average Cost = New Carrying Value / New Quantity
```

Formula for a partial Stock OUT:

```text
Cost Removed = round-half-up(
  Stock OUT Quantity × Carrying Value Before / Quantity Before
)
```

If the Stock OUT quantity equals the full quantity before the movement, set `Cost Removed` to the full carrying value before the movement.

**Display rule:** The dashboard cost metric must use a clear name and explanation. It is an estimate based on costs recorded in Storix. It is not selling value, market value, cash, or profit.

**Dependencies:** D-04 and D-05 must also be approved before the inventory cost KPI is enabled.

### D-02 — Default Minimum Stock

**Recommendation: Approve a default of `0`.**

Rules:

- New Products start with a minimum stock threshold of `0`.
- The user can set a non-negative whole-number threshold for each Product.
- Low-stock status uses `Current Stock <= Minimum Stock Level`.
- A Product with zero stock keeps the visible status `Out of Stock`.
- The Low-Stock Products KPI includes zero-stock Products when they meet the threshold rule.

Reason: Storix is general-purpose. A fixed positive threshold would imply a business rule that may not fit every product or business type.

### D-03 — Zero Selling Price

**Recommendation: Approve zero as a valid price for a deliberately free Product.**

Rules:

- `null` means that no selling price has been set.
- `0` means that the Product is intentionally free.
- A positive value is the current list/default selling price for one stock unit.
- Negative, decimal, non-finite, and unsafe integer values are invalid.
- The UI displays `Not set` for `null` and `Free` for `0`.
- Do not add a separate `isFree` field. The numeric value already expresses this state.
- Current selling price must not change historical SalesMockEntry revenue.

### D-04 — Opening Stock Acquisition Cost

**Recommendation: Require a known unit acquisition cost when opening quantity is greater than zero.**

Rules:

- Opening quantity defaults to `0`.
- If opening quantity is greater than `0`, require a non-negative integer-toman unit acquisition cost.
- A cost of `0` is valid only when the user knows that the stock was acquired at no cost. Do not use `0` to mean unknown.
- The Supplier is optional. The original Supplier may be unknown or not relevant for opening balances.
- Create the Product and its opening-stock transaction as one logical operation.
- Do not create an opening-stock transaction when opening quantity is `0`.
- Store the entered cost on the opening-stock transaction. Use it in the MWAC calculation.

Reason: The MVP should not show an apparently complete inventory-cost KPI when opening stock has no known cost.

### D-05 — Invoice-Level Discounts, Taxes, Shipping, and Other Charges

**Recommendation: Do not model or allocate separate invoice-level adjustments in the MVP.**

Rules:

- Store the unit purchase price entered for each invoice line.
- Use that recorded line price as the cost basis for the line's Stock IN transaction and MWAC calculation.
- Do not add invoice-header fields for discounts, tax, shipping, or other charges.
- Do not distribute invoice-level amounts across Product lines in the MVP.
- Calculate the line amount as `Quantity × Unit Purchase Price`.
- Label the invoice sum as `Products Subtotal` or `Recorded Purchase Subtotal`, not as the supplier's final payable amount.
- Explain that inventory cost uses recorded invoice-line prices and excludes invoice-level adjustments that Storix does not capture.

Reason: This avoids hidden allocation rules and keeps the purchase invoice flow small. It also makes the limitation clear: the resulting inventory cost is a recorded-cost estimate, not a complete landed-cost or accounting valuation.

### D-06 — Stock OUT Reasons

**Recommendation: Approve three reasons: `DAMAGE`, `INTERNAL_USE`, and `OTHER`.**

| Stored value | UI label | Meaning |
|---|---|---|
| `DAMAGE` | Damaged | The item is damaged or unusable. |
| `INTERNAL_USE` | Internal use | The item is used by the business and is not sold. |
| `OTHER` | Other | Another non-sale reason. Require a note when this reason is selected. |

Rules:

- A reason is required for every Stock OUT.
- Do not include `SALE`. Storix does not record real sales in the MVP.
- Do not include `ADJUSTMENT`. A stock adjustment is a correction/reconciliation operation, not a normal reason for consuming stock. It also conflicts with the deferred correction workflow in D-08.
- Stock OUT must not update Sales Analytics.

### D-07 — Posted Purchase Invoice Correction

**Recommendation: Keep posted Purchase Invoices immutable and exclude correction actions from the MVP.**

Rules:

- The user can review and change the form before posting.
- Before posting, show a review step with the Supplier, invoice date, lines, quantities, unit prices, and resulting stock increase.
- Require explicit confirmation before posting.
- After posting, the invoice and its lines are read-only.
- Do not provide edit, delete, void, or reverse actions in the MVP.
- A posted invoice line and its linked Stock IN transaction must remain linked and immutable.

Known limitation: A user cannot correct an invoice after posting. Show a clear warning before the final confirmation. A later version may add a linked invoice reversal workflow that also reverses the related stock and cost effects.

### D-08 — Inventory Transaction Correction

**Recommendation: Defer transaction correction and reversal workflows from the MVP.**

Rules:

- Do not edit or delete posted inventory transactions.
- Do not create a fake Purchase Invoice to reverse an incorrect Stock OUT.
- Do not add a generic positive Stock IN form. Purchase Invoice remains the only normal Stock IN source.
- Do not include `ADJUSTMENT` as a normal Stock OUT reason.
- Before posting Stock OUT, show the Product, available quantity, quantity to remove, reason, and resulting stock. Require explicit confirmation.
- After posting, show transaction details as read-only.

Known limitation: A Stock OUT entry error cannot be corrected in the MVP. This is acceptable only as an explicit prototype/MVP limitation. It is not a suitable final workflow for a production inventory system. A later version should add auditable compensating transactions, not mutate or delete the original ledger entry.

## 4. Additional Non-Blocking Decision — D-09

### Gross Profit and Gross Margin Display

**Recommendation: Include both metrics in the Sales Analytics page, but not as required Dashboard KPI cards.**

Rules:

- Calculate both metrics only from static `SalesMockEntry` records.
- `Gross Profit = Total Revenue - Total Cost of Goods Sold`.
- `Gross Margin (%) = (Gross Profit / Total Revenue) × 100`.
- When total revenue is zero, display `—` for Gross Margin.
- Label the data as simulated/sample data.
- Do not use current Product selling price, Purchase Invoice data, or Stock OUT transactions to calculate historical sales metrics.
- Explain that Gross Profit is not net profit. The MVP does not calculate operating expenses, tax, or other overhead.

Reason: These fields and formulas already exist in Business Rules and support the sales-information focus. Showing them in Sales Analytics completes that view without making them depend on inventory valuation.

## 5. Dependency and Sign-Off Matrix

| Decision | Approval enables | Remaining caveat |
|---|---|---|
| D-01 | MWAC calculations, Stock OUT cost, inventory-cost KPI | Requires D-04 and D-05. |
| D-02 | Final minimum-stock default and low-stock behavior | None after approval. |
| D-03 | Final selling-price validation and display | None after approval. |
| D-04 | Valued opening stock | Supplier can remain unknown. |
| D-05 | Defined invoice-line cost basis | Inventory cost excludes unrecorded invoice-level adjustments. |
| D-06 | Final Stock OUT reason options | `OTHER` requires a note. |
| D-07 | Final posted-invoice read-only behavior | No post-posting invoice correction in MVP. |
| D-08 | Final transaction immutability behavior | No post-posting transaction correction in MVP. |
| D-09 | Gross Profit and Gross Margin in Sales Analytics | Metrics remain simulated. |

## 6. Risks to Keep Visible

1. **No correction after posting:** D-07 and D-08 together mean that incorrect posted invoices and Stock OUT entries cannot be fixed in the MVP. The UI must warn users before posting.
2. **Incomplete acquisition-cost view:** D-05 means the inventory-cost estimate excludes invoice-level amounts that are not recorded on invoice lines.
3. **Sales metrics are simulated:** Gross Profit and Gross Margin are sample metrics. They must not be presented as actual business performance.
4. **No unit conversion:** Quantities count items or packages only. Package descriptions do not convert units.

## 7. Recommended Approval Procedure

The product owner should approve or reject each recommendation by ID. After approval:

1. Update the decision status in Business Rules.
2. Remove obsolete `pending`, `proposed`, and conditional wording from the affected PRD requirements.
3. Update the matching UI forms, labels, warnings, and acceptance criteria.
4. Update the change logs and document versions.
5. Run the final cross-document review.

Do not mark the three main documents as approved before all Critical and High issues pass final review.
