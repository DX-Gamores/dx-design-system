import { iconPaths, type IconName } from "./icons.generated";
import { cn } from "@/lib/cn";

export type { IconName };

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
      className={cn("shrink-0", className)}
    >
      {iconPaths[name]}
    </svg>
  );
}
