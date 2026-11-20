import { MdPage } from "@/site/md-page";

export const metadata = { title: "Installation" };

export default function Page() {
  return (
    <MdPage
      file="docs/INSTALL.md"
      href="/docs/installation/"
      title="Installation"
      summary="Add DX tokens and components to any React or Next.js project with one shadcn command. You own the code."
    />
  );
}
