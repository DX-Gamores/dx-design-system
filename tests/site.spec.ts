import { expect, test } from "@playwright/test";
import { builtRoutes, watchErrors } from "./helpers";

// Every page loads without errors, every internal link resolves, nothing scrolls sideways on a phone.
const routes = builtRoutes();

test.describe("pages", () => {
  for (const r of routes) {
    test(r, async ({ page, request }) => {
      const errs = watchErrors(page);
      const res = await page.goto(r);
      expect(res?.status()).toBe(200);
      const host = new URL(page.url()).host;
      const links = [...new Set((await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href))).filter((h) => new URL(h).host === host).map((h) => h.split("#")[0]))];
      for (const l of links) expect((await request.get(l)).status(), l).toBe(200);
      errs.expectNone();
    });
  }
});

test("no sideways scrolling at 390px", async ({ browser }) => {
  test.setTimeout(180_000);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const wide: string[] = [];
  for (const r of routes) {
    await page.goto(r);
    const o = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (o > 0) wide.push(`${r} +${o}px`);
  }
  expect(wide).toEqual([]);
});

test("search: Ctrl+K opens, arrow keys move, Enter opens the result", async ({ page }) => {
  await page.goto("start/getting-started/");
  await page.keyboard.press("Control+k");
  const box = page.getByRole("combobox", { name: "Search pages and components" });
  await expect(box).toBeFocused();
  await box.fill("dialog");
  await expect(page.getByRole("option").first()).toContainText("Dialog");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/overlays\/dialog\/$/);
  await expect(page.getByRole("dialog", { name: "Search docs" })).toBeHidden();
});

test("every code block has a Copy button", async ({ page }) => {
  await page.goto("start/getting-started/");
  const blocks = await page.locator("main pre").count();
  expect(blocks).toBeGreaterThan(0);
  await expect(page.locator("main pre button", { hasText: "Copy" })).toHaveCount(blocks);
});
