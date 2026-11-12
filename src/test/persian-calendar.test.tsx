import { render, screen } from "@testing-library/react";
import { DayPicker } from "@daypicker/persian";
import { describe, expect, it } from "vitest";

describe("Persian date picker", () => {
  it("renders the Jalali month with Persian numerals", () => {
    render(
      <DayPicker mode="single" defaultMonth={new Date(2026, 2, 21)} />,
    );

    expect(screen.getByText(/فروردین/)).toBeInTheDocument();
    expect(screen.getByText(/۱۴۰۵/)).toBeInTheDocument();
  });
});
