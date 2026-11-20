import { docFrames, figmaPage } from "@/site/content";
import { DocHeader, FigmaFrame, FigmaOutline, PrevNext, Section } from "@/site/blocks";
import { extras } from "@/site/extras";
import { IconBrowser } from "@/site/icon-browser";

export const metadata = { title: "Icons", description: "The DX icon set on Lucide: search, filter and copy as DX, React, React Native or SVG." };

export default function IconsPage() {
  const fig = figmaPage("Icons");
  const frames = docFrames("Icons");
  const Guidance = extras["Icons"];
  return (
    <>
      <DocHeader eyebrow="Foundations · Iconography" title="Icons" summary="One 24px grid with a 2px round stroke, drawn by Lucide. Use DX names in code; reach for any Lucide icon when you need more." figmaId={fig.id} />
      <Section title="Browse" description="Click an icon to copy it. Pick the format first: a DX name for <Icon>, Lucide for React or React Native, or the raw SVG.">
        <IconBrowser downloadHref={`${process.env.PAGES_BASE_PATH ?? ""}/downloads/dx-icons-svg.zip`} />
      </Section>
      {Guidance && <Guidance />}
      {frames.doDont && (
        <Section id="do-dont" title="Do & don’t">
          <FigmaFrame nodeId={frames.doDont.id} title="Icons: do and don’t" w={frames.doDont.w} h={frames.doDont.h} />
        </Section>
      )}
      <FigmaOutline sections={fig.sections} nodeId={fig.id} />
      <PrevNext href="/icons/" />
    </>
  );
}
