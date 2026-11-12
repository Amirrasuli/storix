import { describe, expect, it } from "vitest";

import { normalizeDigits, parseWholeNumberInput } from "./digits";

describe("normalizeDigits", () => {
  it("converts Persian and Arabic-Indic digits to ASCII", () => {
    expect(normalizeDigits("۱۲۳٤٥6")).toBe("123456");
  });

  it("leaves identifiers and Latin text unchanged", () => {
    expect(normalizeDigits("SKU-۱۲۳")).toBe("SKU-123");
  });
});

describe("parseWholeNumberInput", () => {
  it("accepts Persian, Arabic-Indic, and ASCII whole numbers", () => {
    expect(parseWholeNumberInput(" ۱٬۲۰۰ ")).toBe(1200);
    expect(parseWholeNumberInput("٢٠٠")).toBe(200);
    expect(parseWholeNumberInput("160000")).toBe(160000);
  });

  it("rejects decimals, negatives, blanks, and unsafe integers", () => {
    expect(parseWholeNumberInput("۱۲.۵")).toBeNull();
    expect(parseWholeNumberInput("-۱۲")).toBeNull();
    expect(parseWholeNumberInput("")).toBeNull();
    expect(parseWholeNumberInput("۹۰۰۷۱۹۹۲۵۴۷۴۰۹۹۳")).toBeNull();
  });
});
