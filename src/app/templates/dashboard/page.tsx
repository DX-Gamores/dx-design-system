import { AcmeShell } from "@/templates/shell";
import { DashboardTemplate } from "@/templates/dashboard";

export const metadata = { title: "Dashboard" };
export default function Page() {
  return <AcmeShell><DashboardTemplate /></AcmeShell>;
}
