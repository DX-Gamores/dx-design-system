import { AuthShell } from "@/templates/shell";
import { SignUpTemplate } from "@/templates/auth";

export const metadata = { title: "Sign up" };
export default function Page() {
  return <AuthShell><SignUpTemplate /></AuthShell>;
}
