import { expect, test } from "@playwright/test";

// The shadcn registry served at /r/v4/ is complete and installable:
// every item parses, every dependency points at an item that exists, and file contents are self-contained.
type File = { path: string; type: string; target?: string; content?: string };
type Item = { name: string; type: string; title?: string; description?: string; registryDependencies?: string[]; files: File[] };

test("registry index lists init, modules, app shell and all 63 components", async ({ request }) => {
  const res = await request.get("r/v4/registry.json");
  expect(res.status()).toBe(200);
  const index = (await res.json()) as { name: string; items: Item[] };
  expect(index.name).toBe("dx");
  const names = index.items.map((i) => i.name);
  expect(names).toContain("init");
  expect(names).toContain("app-shell");
  expect(names.filter((n) => n.startsWith("ui-")).length).toBeGreaterThanOrEqual(12);
  expect(index.items.filter((i) => !i.name.startsWith("ui-") && !["init", "app-shell", "agents"].includes(i.name)).length).toBe(63);
  expect(names).toContain("agents");
});

test("every item resolves: dependencies exist, files have content, imports are portable", async ({ request }) => {
  const index = (await (await request.get("r/v4/registry.json")).json()) as { items: Item[] };
  const names = new Set(index.items.map((i) => i.name));
  for (const { name } of index.items) {
    const item = (await (await request.get(`r/v4/${name}.json`)).json()) as Item;
    expect(item.name, name).toBe(name);
    for (const dep of item.registryDependencies ?? []) {
      const m = dep.match(/\/r\/v4\/([\w-]+)\.json$/);
      expect(m, `${name} → ${dep}`).not.toBeNull();
      expect(names.has(m![1]), `${name} → ${dep}`).toBe(true);
    }
    for (const f of item.files) {
      expect(f.content?.length, `${name}: ${f.path}`).toBeGreaterThan(0);
      if (f.type === "registry:file") expect(f.target, `${name}: ${f.path} needs a target`).toBeTruthy();
      expect(f.content, `${name}: ${f.path} imports the repo-only @dxform alias`).not.toMatch(/from "@dxform\//);
      for (const [, rel] of f.content!.matchAll(/from "\.\/([\w.-]+)"/g)) {
        // a relative import must be installed by this item or one it depends on (directly or through init)
        const mod = `ui-${rel}`;
        expect(names.has(mod), `${name}: ./${rel}`).toBe(true);
      }
    }
  }
});

test("component items point at the module that exports them", async ({ request }) => {
  const button = (await (await request.get("r/v4/button.json")).json()) as Item & { meta: { export: string } };
  expect(button.meta.export).toBe("Button");
  expect(button.registryDependencies?.[0]).toMatch(/\/ui-button\.json$/);
  const mod = (await (await request.get("r/v4/ui-button.json")).json()) as Item;
  expect(mod.files[0].content).toContain("export const Button");
  expect(mod.registryDependencies?.some((d) => d.endsWith("/init.json"))).toBe(true);
});
