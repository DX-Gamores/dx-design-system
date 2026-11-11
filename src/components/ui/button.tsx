import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Spinner } from "./feedback";

// Figma: Button — Variant (Primary | Secondary | Ghost) · Tone (Default | Danger) · Size (Large 48 | Medium 40 | Small 32)
// State (Hover | Pressed | Focus | Disabled) comes from the browser: :hover, :active, :focus-visible, disabled.
type Variant = "primary" | "secondary" | "ghost";
type Tone = "default" | "danger";
type Size = "lg" | "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control text-label-medium whitespace-nowrap select-none " +
  "transition-colors duration-150 ease-standard focus-visible:focus-ring disabled:cursor-not-allowed " +
  "disabled:bg-disabled disabled:text-fg-disabled disabled:border-line-disabled";

const sizes: Record<Size, string> = {
  lg: "h-control-lg px-[var(--ds-padding-control-lg)] text-label-large",
  md: "h-control-md px-[var(--ds-padding-control-md)]",
  sm: "h-control-sm px-[var(--ds-padding-control-sm)]",
};

const looks: Record<Tone, Record<Variant, string>> = {
  default: {
    primary: "bg-brand text-fg-on-brand hover:bg-brand-hover active:bg-brand-pressed",
    secondary: "bg-surface text-fg-primary border border-line-strong hover:bg-neutral-hover active:bg-neutral-pressed",
    ghost: "bg-transparent text-fg-primary hover:bg-neutral-hover active:bg-neutral-pressed",
  },
  danger: {
    primary: "bg-danger text-fg-on-color hover:bg-danger-hover active:bg-danger-pressed",
    secondary: "bg-surface text-fg-danger border border-line-danger hover:bg-danger-subtle active:bg-danger-subtle-pressed",
    ghost: "bg-transparent text-fg-danger hover:bg-danger-subtle active:bg-danger-subtle-pressed",
  },
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", tone = "default", size = "md", leadingIcon, trailingIcon, loading, className, children, disabled, ...rest },
  ref,
) {
  const icon = size === "sm" ? 16 : 20;
  return (
    <button
      ref={ref}
      className={cn(base, sizes[size], looks[tone][variant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size="sm" label="" /> : leadingIcon && <Icon name={leadingIcon} size={icon} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={icon} className="rtl:-scale-x-100" />}
    </button>
  );
});

// Figma: Icon Button — same variants; always needs an accessible label (+ Tooltip).
export type IconButtonProps = Omit<ButtonProps, "leadingIcon" | "trailingIcon" | "children"> & {
  icon: IconName;
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = "ghost", tone = "default", size = "md", className, ...rest },
  ref,
) {
  const square = { lg: "w-[var(--ds-size-control-lg)]", md: "w-[var(--ds-size-control-md)]", sm: "w-[var(--ds-size-control-sm)]" }[size];
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(base, sizes[size], "px-0", square, looks[tone][variant], className)}
      {...rest}
    >
      <Icon name={icon} size={size === "sm" ? 16 : 20} />
    </button>
  );
});

/** Button styling for links that look like buttons (navigation, not actions): <a className={buttonClass({ variant: "secondary" })}>. */
export const buttonClass = ({ variant = "primary", tone = "default", size = "md" }: { variant?: Variant; tone?: Tone; size?: Size } = {}) =>
  cn(base, sizes[size], looks[tone][variant]);
