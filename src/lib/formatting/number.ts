import { assertNonNegativeSafeInteger } from "@/lib/utils/numbers";

const persianNumberFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

/**
 * Formats a non-negative safe integer quantity with Persian digits.
 * The count unit (`عدد`) is added by the presenting component.
 */
export function formatQuantity(value: number): string {
  assertNonNegativeSafeInteger(value, "Quantity");
  return persianNumberFormatter.format(value);
}

/**
 * Formats a non-negative safe integer toman amount with Persian digits.
 * The currency label is explicit; the application never relies on an
 * `IRT` currency symbol from the browser.
 */
export function formatMoneyIrt(value: number): string {
  assertNonNegativeSafeInteger(value, "Money amount");
  return `${persianNumberFormatter.format(value)} تومان`;
}
