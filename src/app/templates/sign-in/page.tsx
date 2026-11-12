import { AuthShell } from "@/templates/shell";
import { SignInTemplate } from "@/templates/auth";

export const metadata = { title: "Sign in" };
export default function Page() {
  return <AuthShell><SignInTemplate /></AuthShell>;
}
