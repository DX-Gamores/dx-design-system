import { iconPaths, type IconName } from "./icons.generated";
import { cn } from "@/lib/cn";

export type { IconName };

/** Icons that point a direction flip in right-to-left layouts. Objects and time (clock, check, phone) don't. */
export const mirroredIcons = new Set<IconName>(["arrow-left", "arrow-right", "chevron-left", "chevron-right", "undo", "redo", "send", "sign-out", "sign-in", "list-view"]);

type IconProps = {
  name: IconName;
  /** 16 = sm, 20 = md (default), 24 = lg — matches size/icon-* tokens */
  size?: 16 | 20 | 24;
  /** Give a label only when the icon carries meaning on its own. Otherwise it's decorative. */
  label?: string;
  className?: string;
};

export function Icon({ name, size = 20, label, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("shrink-0", mirroredIcons.has(name) && "rtl:-scale-x-100", className)}
    >
      {iconPaths[name]}
    </svg>
  );
}
