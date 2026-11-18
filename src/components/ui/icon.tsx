import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { iconMap, type IconName } from "./icon-map";

export type { IconName };

/** Icons that point a direction flip in right-to-left layouts. Objects and time (clock, check, phone) don't. */
export const mirroredIcons = new Set<IconName>(["arrow-left", "arrow-right", "chevron-left", "chevron-right", "undo", "redo", "send", "sign-out", "sign-in", "list-view"]);

type IconProps = {
  /** A DX icon name (see icon-map.ts), or any Lucide icon component: name={Rocket} */
  name: IconName | LucideIcon;
  /** 16 = sm, 20 = md (default), 24 = lg — matches size/icon-* tokens */
  size?: 16 | 20 | 24;
  /** Give a label only when the icon carries meaning on its own. Otherwise it's decorative. */
  label?: string;
  /** Flip in right-to-left layouts. Defaults to true for directional DX icons. */
  mirror?: boolean;
  className?: string;
};

export function Icon({ name, size = 20, label, mirror, className }: IconProps) {
  const Svg = typeof name === "string" ? iconMap[name] : name;
  const flip = mirror ?? (typeof name === "string" && mirroredIcons.has(name));
  return (
    <Svg
      size={size}
      strokeWidth={2}
      absoluteStrokeWidth={false}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("shrink-0", flip && "rtl:-scale-x-100", className)}
    />
  );
}
