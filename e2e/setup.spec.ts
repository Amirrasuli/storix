import { expect, test } from "@playwright/test";

test("renders the Persian RTL setup page", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(
    page.getByRole("heading", { name: "زیرساخت پروژه آماده است" }),
  ).toBeVisible();
  await expect(page.getByText("۱۶۰٬۰۰۰ تومان")).toBeVisible();
  await expect(page.getByText("SKU-1001")).toBeVisible();

  const fontFamily = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).fontFamily);

  expect(fontFamily).toContain("Vazirmatn");
});
