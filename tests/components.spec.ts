import { expect, test } from "@playwright/test";
import { focusedText, watchErrors } from "./helpers";

// Keyboard and screen-reader behaviour from each component's spec (WAI-ARIA APG patterns).

test("Combobox: filter, arrow keys, Enter picks, Create, Esc closes", async ({ page }) => {
  const errs = watchErrors(page);
  await page.goto("inputs/combobox/");
  const cb = page.getByRole("combobox", { name: "Assignee" });
  await cb.click(); await cb.fill("an");
  await expect(cb).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("listbox").getByRole("option").first()).toBeVisible();
  await cb.press("ArrowDown");
  await expect(cb).toHaveAttribute("aria-activedescendant", /.+/);
  await cb.press("Enter");
  await expect(cb).toHaveAttribute("aria-expanded", "false");
  await expect(cb).toHaveValue("Jane Cooper");
  await cb.fill("Zed Newperson");
  await expect(page.getByText("Create “Zed Newperson”")).toBeVisible();
  await cb.press("Escape");
  await expect(cb).toHaveAttribute("aria-expanded", "false");
  errs.expectNone();
});

test("Menu: Enter opens on first item, ↓ skips disabled, Esc returns focus", async ({ page }) => {
  await page.goto("overlays/menu/");
  await page.getByRole("button", { name: "More actions for Esther Howard" }).focus();
  await page.keyboard.press("Enter");
  expect(await focusedText(page)).toMatch(/^Edit role/);
  await page.keyboard.press("ArrowDown");
  expect(await focusedText(page)).toMatch(/^Copy email/);
  await page.keyboard.press("ArrowDown");
  expect(await focusedText(page)).toMatch(/^Remove from workspace/);
  await page.keyboard.press("Escape");
  expect(await focusedText(page)).toBe("More actions for Esther Howard");
});

test("Dialog: focus moves in, Esc closes and returns focus; Danger focuses Cancel", async ({ page }) => {
  await page.goto("overlays/dialog/");
  await page.getByRole("button", { name: "Invite a member" }).click();
  await expect(page.locator("dialog[open] input")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Invite a member" })).toBeFocused();
  await page.getByRole("button", { name: "Delete project" }).click();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
});

test("Date Picker: typed dates parse, calendar keys pick, bad input explains", async ({ page }) => {
  await page.goto("inputs/date-picker/");
  const df = page.getByLabel("Due date");
  const y = new Date().getFullYear() + 1;
  await df.fill(`3/14/${y}`); await df.press("Enter");
  await expect(df).toHaveValue(`Mar 14, ${y}`);
  await page.getByRole("button", { name: /^Choose date/ }).click();
  expect(await focusedText(page)).toContain("March 14");
  await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter");
  await expect(df).toHaveValue(`Mar 15, ${y}`);
  await df.fill("banana"); await df.press("Enter");
  await expect(page.getByText(/Enter a date like/)).toBeVisible();
});

test("Slider: keys step, Home/End, range thumbs can't cross", async ({ page }) => {
  await page.goto("inputs/slider/");
  const vol = page.getByRole("slider", { name: "Volume" });
  await vol.focus();
  const v0 = Number(await vol.getAttribute("aria-valuenow"));
  await page.keyboard.press("ArrowRight"); await page.keyboard.press("PageUp");
  await expect(vol).toHaveAttribute("aria-valuenow", String(v0 + 11));
  await page.keyboard.press("End");
  await expect(vol).toHaveAttribute("aria-valuenow", "100");
  const lo = page.getByRole("slider", { name: "Minimum price" });
  await lo.focus(); await page.keyboard.press("End");
  await expect(lo).toHaveAttribute("aria-valuenow", "8000");
});

test("Toast: polite region, danger is an alert, never steals focus", async ({ page }) => {
  await page.goto("feedback/toast/");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("status").getByText("Changes saved")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Fail an upload" }).click();
  await expect(page.getByRole("alert").getByText(/Upload failed/)).toBeVisible();
});

test("Tooltip: shows on focus, linked by aria-describedby, Esc hides", async ({ page }) => {
  await page.goto("feedback/tooltip/");
  const btn = page.getByRole("button", { name: "Delete Jane Cooper" });
  await btn.focus();
  await expect(page.getByRole("tooltip", { name: "Delete member" })).toBeVisible();
  await expect(btn).toHaveAttribute("aria-describedby", /.+/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("Accordion, Error Summary, Radio, label linking", async ({ page }) => {
  await page.goto("navigation/accordion/");
  const h = page.getByRole("button", { name: "Can I change plans later?" });
  await h.click();
  await expect(h).toHaveAttribute("aria-expanded", "true");

  await page.goto("patterns/form-patterns/");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "problems" })).toBeFocused();
  await page.getByRole("link", { name: "Enter your full name" }).click();
  await expect(page.getByLabel("Full name")).toBeFocused();

  await page.goto("inputs/radio/");
  await page.getByLabel("Monthly · ₱499 per member").focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByLabel(/Yearly/)).toBeChecked();
});
