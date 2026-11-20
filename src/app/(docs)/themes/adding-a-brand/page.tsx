import { MdPage } from "@/site/md-page";

export const metadata = { title: "Adding a brand" };

export default function Page() {
  return (
    <MdPage
      file="docs/NEW-BRAND.md"
      href="/themes/adding-a-brand/"
      title="Adding a brand"
      eyebrow="Themes"
      summary="A new product or client brand is one new token mode, not a redesign."
    />
  );
}
