import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { builtRoutes } from "./helpers";

// WCAG 2.2 A/AA + best practices on every built page, in light and dark. One test per page.
const routes = builtRoutes();
test("the static export exists (npm run build:pages)", () => expect(routes.length).toBeGreaterThan(50));

for (const theme of ["light", "dark"] as const) {
  test.describe(`axe · ${theme}`, () => {
    for (const r of routes) {
      test(r, async ({ page }) => {
        await page.goto(r);
        await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
        const res = await new AxeBuilder({ page }).exclude("iframe").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
        const v = res.violations.map((x) => `${x.id} (${x.impact}) × ${x.nodes.length}: ${x.nodes[0]?.target.join(" ")} — ${x.nodes[0]?.failureSummary?.split("\n")[1] ?? ""}`);
        expect(v, v.join("\n")).toEqual([]);
      });
    }
  });
}
