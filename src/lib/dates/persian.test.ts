import { describe, expect, it } from "vitest";

import {
  formatCalendarDate,
  formatDateTime,
  formatRelativeAge,
  parseIsoDateOnly,
} from "./persian";

describe("parseIsoDateOnly", () => {
  it("parses a date-only value without time-zone shifting", () => {
    const date = parseIsoDateOnly("2026-03-21");

    expect(date.toISOString()).toBe("2026-03-21T00:00:00.000Z");
  });

  it("rejects malformed and impossible dates", () => {
    expect(() => parseIsoDateOnly("2026-02-30")).toThrow(RangeError);
    expect(() => parseIsoDateOnly("21-03-2026")).toThrow(RangeError);
  });
});

describe("formatCalendarDate", () => {
  it("formats a Gregorian date in the Persian calendar", () => {
    expect(formatCalendarDate("2026-03-21")).toBe("۱ فروردین ۱۴۰۵");
  });
});

describe("formatDateTime", () => {
  it("rejects invalid timestamps", () => {
    expect(() => formatDateTime("not-a-date")).toThrow(RangeError);
  });
});

describe("formatRelativeAge", () => {
  const now = new Date("2026-11-12T12:00:00");

  it("formats recent invoice ages in days", () => {
    expect(formatRelativeAge("2026-11-09", now)).toBe("۳ روز پیش");
    expect(formatRelativeAge("2026-11-12", now)).toBe("امروز");
  });

  it("formats older invoice ages in months", () => {
    expect(formatRelativeAge("2026-09-12", now)).toBe("۲ ماه پیش");
  });
});
