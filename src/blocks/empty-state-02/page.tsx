/**
 * @title No search results
 * @description Keeps the search and filters in view, says what matched nothing, suggests fixes and offers to clear everything in one step.
 * @route /customers
 */
import { TopBar } from "../_parts/top-bar";
import { CustomerSearch } from "./components/customer-search";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <TopBar current="Customers" />
      <main id="main" className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <h1 className="text-heading-h2">Customers</h1>
        <CustomerSearch />
      </main>
    </div>
  );
}
