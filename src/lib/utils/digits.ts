const DIGIT_PATTERN = /[\u06F0-\u06F9\u0660-\u0669]/g;

/**
 * Converts Persian and Arabic-Indic digits to ASCII digits.
 *
 * Machine-readable values stay ASCII; Persian digits are only a display and
 * input convenience.
 */
export function normalizeDigits(value: string): string {
  return value.replace(DIGIT_PATTERN, (digit) => {
    const code = digit.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

/**
 * Parses a whole-number form input after digit normalization.
 *
 * Accepts Persian, Arabic-Indic, and ASCII digits plus common thousands
 * separators. Returns `null` for decimals, negatives, blanks, and unsafe
 * integers so callers can show a field-level validation error.
 */
export function parseWholeNumberInput(value: string): number | null {
  const normalized = normalizeDigits(value)
    .trim()
    .replace(/[\s\u00A0\u202F\u066C,]/g, "");

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : null;
}
