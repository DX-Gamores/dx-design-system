import { expect, test } from "@playwright/test";
import { watchErrors } from "./helpers";

// The Figma templates as working screens.

test("Members: search, empty state, role filter, bulk select", async ({ page }) => {
  const errs = watchErrors(page);
  await page.goto("templates/members/");
  const search = page.getByRole("searchbox", { name: "Search members" });
  await search.fill("wade");
  await expect(page.locator("table tbody tr")).toHaveCount(1);
  await search.fill("zzz");
  await expect(page.getByRole("heading", { name: "No members match “zzz”" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("table tbody tr")).toHaveCount(5);
  await page.getByLabel("Role", { exact: true }).selectOption("Viewer");
  await expect(page.locator("table tbody tr")).toHaveCount(2);
  await page.getByLabel("Role", { exact: true }).selectOption("");
  await page.getByLabel("Select Jane Cooper").check();
  await expect(page.getByText("1 selected")).toBeVisible();
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.getByRole("status").getByText("1 member removed")).toBeVisible();
  errs.expectNone();
});

test("Settings: dirty bar, validate on submit, save, danger dialog", async ({ page }) => {
  await page.goto("templates/members/");
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("link", { name: "Settings" })).toHaveAttribute("aria-current", "page");
  const email = page.getByLabel("Email", { exact: true });
  await email.fill("jane@");
  await expect(page.getByText("You have unsaved changes")).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "problem" })).toBeFocused();
  await email.fill("jane@acme.com");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Changes saved")).toBeVisible();
  await expect(page.getByText("You have unsaved changes")).toBeHidden();
  await page.getByRole("button", { name: "Delete workspace" }).click();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
});

test("Sign up: lists every problem, password toggle, link to sign in", async ({ page }) => {
  await page.goto("templates/sign-up/");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "There are 4 problems with your form" })).toBeVisible();
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/sign-in/);
});

test("Responsive shell: rail on tablet, list + drawer on mobile", async ({ browser }) => {
  const tablet = await browser.newPage({ viewport: { width: 834, height: 1000 } });
  await tablet.goto("templates/members/");
  await expect(tablet.locator("#sidebar")).toBeVisible();
  await expect(tablet.getByRole("button", { name: "Open navigation" })).toBeHidden();
  await expect(tablet.getByRole("link", { name: "Members" })).toHaveCount(1);
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await phone.goto("templates/members/");
  await expect(phone.getByRole("list", { name: "Members" })).toBeVisible();
  await expect(phone.locator("table")).toBeHidden();
  await expect(phone.locator("#sidebar")).toHaveCSS("visibility", "hidden");
  expect(await phone.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});
