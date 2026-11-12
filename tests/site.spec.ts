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
