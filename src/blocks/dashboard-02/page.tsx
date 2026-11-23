/**
 * @title Analytics overview with tabs
 * @description A header-only layout: top navigation, a date-range action, tabs for Overview / Analytics / Reports, key numbers, monthly revenue and recent sales.
 * @route /dashboard
 * @height 900
 */
import { TopBar } from "../_parts/top-bar";
import { Overview } from "./components/overview";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <TopBar current="Overview" />
      <main id="main" className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6">
        <Overview />
      </main>
    </div>
  );
}
