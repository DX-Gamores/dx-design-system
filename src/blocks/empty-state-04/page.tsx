/**
 * @title No access, with a request form
 * @description Explains why the page is hidden and who can help, then lets the person ask for access with a note. Confirms the request without leaving the page.
 * @route /reports
 */
import { TopBar } from "../_parts/top-bar";
import { RequestAccess } from "./components/request-access";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <TopBar current="Overview" />
      <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
        <RequestAccess />
      </main>
    </div>
  );
}
