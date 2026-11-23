import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import Link from "next/link";
import { DocHeader, PrevNext } from "@/site/blocks";
import { ThemeBuilder } from "@/site/theme-builder";
import { engineVars, gallery, presets } from "@/site/theme-presets";

export const metadata = { title: "Theme builder" };

export default function Page() {
  return (
    <>
      <DocHeader
        eyebrow="Themes"
        title="Theme builder"
        summary="Make a client brand without Figma: pick a primary colour, accent, neutrals, fonts and corners. The builder makes the colour ramps, fixes contrast where it can, previews every colour mode and exports the brand for code and Figma."
      >
        <Link href="/themes/gallery/" className="rounded-sm text-label-medium text-fg-brand underline underline-offset-2 focus-visible:focus-ring">Brand gallery</Link>
        <Link href="/themes/adding-a-brand/" className="rounded-sm text-label-medium text-fg-brand underline underline-offset-2 focus-visible:focus-ring">How brands work</Link>
      </DocHeader>
      <ThemeBuilder vars={engineVars()} presets={presets()} gallery={gallery.map((g) => g.slug)} />
      <PrevNext href="/themes/builder/" />
    </>
  );
}
