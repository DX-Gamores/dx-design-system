import { AuthShell, ContentSlot } from "@/templates/shell";

export const metadata = { title: "Auth shell" };
export default function Page() {
  return <AuthShell><h1 className="text-heading-h2">Page title</h1><ContentSlot label="Form slot — replace with your form" /></AuthShell>;
}
