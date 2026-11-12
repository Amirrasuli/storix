import { describe, expect, it } from "vitest";

import { formatMoneyIrt, formatQuantity } from "./number";

describe("formatQuantity", () => {
  it("formats whole quantities with Persian digits and grouping", () => {
    expect(formatQuantity(0)).toBe("۰");
    expect(formatQuantity(1200)).toBe("۱٬۲۰۰");
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid quantity %s",
    (value) => {
      expect(() => formatQuantity(value)).toThrow(RangeError);
    },
  );

  it("rejects values outside the safe integer range", () => {
    expect(() => formatQuantity(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      RangeError,
    );
  });
});

describe("formatMoneyIrt", () => {
  it("formats toman amounts with Persian digits and the toman label", () => {
    expect(formatMoneyIrt(160000)).toBe("۱۶۰٬۰۰۰ تومان");
    expect(formatMoneyIrt(0)).toBe("۰ تومان");
  });

  it("rejects negative and decimal money values", () => {
    expect(() => formatMoneyIrt(-1)).toThrow(RangeError);
    expect(() => formatMoneyIrt(10.5)).toThrow(RangeError);
  });
});
