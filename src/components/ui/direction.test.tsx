import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DirectionProvider, useDirection } from "./direction";

function DirectionProbe() {
  const direction = useDirection();

  return <span>{direction ?? "none"}</span>;
}

describe("DirectionProvider", () => {
  it("provides right-to-left direction to descendants", () => {
    render(
      <DirectionProvider direction="rtl">
        <DirectionProbe />
      </DirectionProvider>,
    );

    expect(screen.getByText("rtl")).toBeInTheDocument();
  });
});
