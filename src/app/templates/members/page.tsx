import { AcmeShell } from "@/templates/shell";
import { MembersTemplate } from "@/templates/members";

export const metadata = { title: "Members" };
export default function Page() {
  return <AcmeShell><MembersTemplate /></AcmeShell>;
}
