import { flatNav } from "@/site/content";
import { FigmaPageView } from "@/site/figma-page";

export const metadata = { title: "Themes & brands" };

export default function Page() {
  return <FigmaPageView item={flatNav.find((i) => i.href === "/themes/")!} specs={[]} eyebrow="Themes" />;
}
