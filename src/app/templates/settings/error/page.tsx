import { AcmeShell } from "@/templates/shell";
import { SettingsTemplate } from "@/templates/settings";

export const metadata = { title: "Settings · error" };
export default function Page() {
  return <AcmeShell><SettingsTemplate showError /></AcmeShell>;
}
