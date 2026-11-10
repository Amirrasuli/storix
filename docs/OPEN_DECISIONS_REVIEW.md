# Storix — Approved Product Decisions

**Document:** Approved Product Decisions  
**Version:** 1.0  
**Status:** Approved  
**Approval Date:** 2026-11-11  
**Authority:** Product Owner  
**Related Documents:** [`PRD.md`](./PRD.md) · [`BUSINESS_RULES_AND_DATA_MODEL.md`](./BUSINESS_RULES_AND_DATA_MODEL.md) · [`UI_UX_SPECIFICATION.md`](./UI_UX_SPECIFICATION.md)

---

## 1. Purpose

This document records the product-owner approval of decisions D-01 through D-09. The approved rules are incorporated into all three product documents. The Business Rules document is the detailed source of truth for calculations, validation, and domain behavior.

## 2. Approved Decision Register

| ID | Topic | Approved decision |
|---|---|---|
| D-01 | Inventory valuation | Use Moving Weighted Average Cost (MWAC). Store carrying-value totals as integer toman amounts. Use round-half-up for partial Stock OUT cost. A full Stock OUT removes the full remaining carrying value. |
| D-02 | Default minimum stock | Default minimum stock to `0`. Allow a non-negative whole-number threshold per Product. Low-stock count uses `Q <= M`; zero-stock status remains `Out of Stock`. |
| D-03 | Zero selling price | Allow `0` to mean Free. Use `null` to mean Not set. Reject negative, decimal, non-finite, and unsafe integer values. |
| D-04 | Opening stock cost | Require a known, non-negative integer-toman unit acquisition cost when opening quantity is positive. Supplier is optional. |
| D-05 | Invoice-level adjustments | Do not capture or allocate invoice-level discounts, taxes, shipping, or other charges. The entered invoice-line unit price is the cost basis for MWAC. Label the total as `Recorded Purchase Subtotal`, not final payable amount. |
| D-06 | Stock OUT reasons | Allow `DAMAGE`, `INTERNAL_USE`, and `OTHER`. Do not include `SALE` or `ADJUSTMENT`. Require a note for `OTHER`. |
| D-07 | Posted Purchase Invoice correction | Posted invoices are immutable. No edit, delete, void, or reversal actions in the MVP. |
| D-08 | Inventory transaction correction | Posted transactions are immutable. No edit, delete, undo, adjustment, or reversal actions in the MVP. Show a warning before Stock OUT posting. |
| D-09 | Gross Profit and Gross Margin | Show both metrics on Sales Analytics using SalesMockEntry only. Do not add them as required Dashboard KPI cards. |

## 3. Known MVP Limitations

1. The inventory-cost estimate excludes invoice-level charges that Storix does not capture.
2. A user cannot correct a posted Purchase Invoice or inventory transaction in the MVP. The UI must show a review and confirmation step before posting.
3. Gross Profit and Gross Margin are simulated metrics. They are not actual net profit or complete business profitability.
4. Storix does not support unit conversion, multiple warehouses, or real sales operations in the MVP.

## 4. Change Control

If a decision changes, update this record and all affected sections in the PRD, Business Rules, and UI/UX Specification. Keep the existing decision ID for traceability. Do not treat a proposed future feature as part of the MVP without an explicit scope update.
