"use client";
import NextLink from "next/link";
import {
  createContext, forwardRef, useCallback, useContext, useEffect, useId, useMemo, useRef, useState,
  type ComponentPropsWithoutRef, type CSSProperties, type HTMLAttributes, type ReactNode,
} from "react";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Tooltip } from "./overlays";

/* ===================================================================================
   Sidebar — Figma: Sidebar (Expanded 256 · Rail 72 · Drawer 288). Composable parts for app navigation,
   used by the DX Blocks (/blocks/sidebar/). Same part names as shadcn/ui's sidebar, so its patterns carry over.

   <SidebarProvider>
     <Sidebar collapsible="icon">            side: left | right · variant: sidebar | floating | inset
       <SidebarHeader /> <SidebarContent> <SidebarGroup> <SidebarMenu> … </SidebarContent> <SidebarFooter />
     </Sidebar>
     <SidebarInset> <header><SidebarTrigger /></header> … </SidebarInset>
   </SidebarProvider>

   Desktop (≥ 768px): docked; Ctrl/⌘ + B or SidebarTrigger collapses it (off screen, or to a 72px icon rail).
   Phone (< 768px): a modal drawer (focus moves in, Esc and the backdrop close it, focus returns to the trigger).
   =================================================================================== */

const MOBILE_QUERY = "(max-width: 767px)";
const WIDTH = "256px";
const WIDTH_ICON = "72px";
const WIDTH_MOBILE = "288px";

type SidebarCtx = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  /** id of the element SidebarTrigger controls */
  panelId: string;
};
const Ctx = createContext<SidebarCtx | null>(null);

export function useSidebar() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSidebar must be used inside <SidebarProvider>.");
  return c;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia(MOBILE_QUERY);
    const on = () => setM(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return m;
}

export function SidebarProvider({
  defaultOpen = true, open: openProp, onOpenChange, className, style, children, ...rest
}: HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = useCallback((v: boolean) => (onOpenChange ? onOpenChange(v) : setInner(v)), [onOpenChange]);
  const toggleSidebar = useCallback(() => (isMobile ? setOpenMobile((o) => !o) : setOpen(!open)), [isMobile, open, setOpen]);
  const panelId = useId();

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey) && !e.altKey) { e.preventDefault(); toggleSidebar(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [toggleSidebar]);

  const value = useMemo<SidebarCtx>(
    () => ({ state: open ? "expanded" : "collapsed", open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar, panelId }),
    [open, setOpen, openMobile, isMobile, toggleSidebar, panelId],
  );
  return (
    <Ctx.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={{ "--sidebar-width": WIDTH, "--sidebar-width-icon": WIDTH_ICON, ...style } as CSSProperties}
        className={cn("group/sidebar-wrapper flex min-h-svh w-full bg-canvas has-data-[variant=inset]:bg-surface-subtle", className)}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

type SidebarProps = HTMLAttributes<HTMLDivElement> & {
  side?: "left" | "right";
  /** sidebar: docked with a border · floating: a rounded card with a gap · inset: the page sits in a card next to it */
  variant?: "sidebar" | "floating" | "inset";
  /** offcanvas: slides away · icon: shrinks to a 72px rail · none: always open */
  collapsible?: "offcanvas" | "icon" | "none";
  /** Names the sidebar landmark (an <aside> on desktop, the drawer dialog on phones). */
  label?: string;
};

export function Sidebar({ side = "left", variant = "sidebar", collapsible = "offcanvas", label = "Sidebar", className, children, ...rest }: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile, panelId } = useSidebar();

  if (collapsible === "none") {
    return (
      <div data-slot="sidebar" className={cn("flex h-full w-(--sidebar-width) flex-col bg-surface text-fg-primary", className)} {...rest}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <SidebarSheet open={openMobile} onClose={() => setOpenMobile(false)} side={side} label={label} id={panelId}>
        {children}
      </SidebarSheet>
    );
  }

  return (
    <aside
      aria-label={label}
      className="group/sidebar peer hidden text-fg-primary md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Reserves the sidebar's width in the page flow. */}
      <div
        aria-hidden
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-moderate ease-standard",
          "group-data-[collapsible=offcanvas]/sidebar:w-0",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+1rem)]"
            : "group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon)",
        )}
      />
      <div
        id={panelId}
        className={cn(
          "fixed inset-y-0 z-[var(--ds-z-sticky)] hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-moderate ease-standard md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]/sidebar:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]/sidebar:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+1rem)]"
            : cn("group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon)", side === "left" ? "border-r border-line-default" : "border-l border-line-default"),
          className,
        )}
        {...rest}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
            "flex h-full w-full flex-col",
            variant === "inset" ? "bg-transparent" : "bg-surface",
            variant === "floating" && "rounded-container border border-line-default shadow-elevation-1",
          )}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}

/** Phone drawer: a modal <dialog> from the sidebar's edge. */
function SidebarSheet({ open, onClose, side, label, id, children }: { open: boolean; onClose: () => void; side: "left" | "right"; label: string; id: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { opener.current = document.activeElement as HTMLElement; d.showModal(); }
    if (!open && d.open) { d.close(); opener.current?.focus(); }
  }, [open]);
  return (
    <dialog
      ref={ref}
      id={id}
      aria-label={label}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      style={{ "--sidebar-width": WIDTH_MOBILE } as CSSProperties}
      className={cn(
        "fixed inset-y-0 m-0 h-dvh max-h-dvh w-(--sidebar-width) max-w-[85vw] bg-surface p-0 text-fg-primary shadow-elevation-3 backdrop:bg-overlay",
        side === "left" ? "start-0 end-auto border-e border-line-default" : "start-auto end-0 border-s border-line-default",
      )}
    >
      <div data-sidebar="sidebar" data-mobile="true" className="flex h-full w-full flex-col" onClick={(e) => { if ((e.target as HTMLElement).closest("a[href]")) onClose(); }}>
        <div className="flex justify-end px-2 pt-2">
          <button type="button" aria-label="Close sidebar" onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-control text-icon-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring">
            <Icon name="close" size={16} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

/** Opens and closes the sidebar (the drawer on phones). Put it in the page header. */
export function SidebarTrigger({ className, label = "Toggle sidebar", onClick, ...rest }: ComponentPropsWithoutRef<"button"> & { label?: string }) {
  const { toggleSidebar, isMobile, open, openMobile, panelId } = useSidebar();
  return (
    <button
      type="button"
      data-sidebar="trigger"
      aria-label={label}
      aria-expanded={isMobile ? openMobile : open}
      aria-controls={panelId}
      title={`${label} (Ctrl+B)`}
      onClick={(e) => { onClick?.(e); toggleSidebar(); }}
      className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-control text-icon-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring", className)}
      {...rest}
    >
      <Icon name={PanelLeft} size={16} mirror />
    </button>
  );
}

/** A thin hit area on the sidebar's inner edge: click to collapse or expand (mouse only; keyboard users have the trigger). */
export function SidebarRail({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      title="Toggle sidebar"
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 hover:after:bg-line-strong sm:flex",
        "group-data-[side=left]/sidebar:-right-4 group-data-[side=right]/sidebar:left-0",
        "group-data-[side=left]/sidebar:cursor-w-resize group-data-[side=right]/sidebar:cursor-e-resize",
        "group-data-[collapsible=offcanvas]/sidebar:translate-x-0 group-data-[collapsible=offcanvas]/sidebar:after:left-full",
        className,
      )}
    />
  );
}

/** The page next to the sidebar. Use it as the page's <main>. */
export function SidebarInset({ className, ...rest }: ComponentPropsWithoutRef<"main">) {
  return (
    <main
      id="main"
      tabIndex={-1}
      data-slot="sidebar-inset"
      className={cn(
        "relative flex min-w-0 w-full flex-1 flex-col bg-canvas outline-none",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-container md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-line-default md:peer-data-[variant=inset]:shadow-elevation-1 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2",
        className,
      )}
      {...rest}
    />
  );
}

export function SidebarInput({ className, ...rest }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      data-sidebar="input"
      className={cn("h-control-sm w-full rounded-control border border-line-strong bg-surface px-3 text-body-small text-fg-primary placeholder:text-fg-placeholder focus-visible:focus-ring", className)}
      {...rest}
    />
  );
}

export function SidebarHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div data-sidebar="header" className={cn("flex flex-col gap-2 p-3 group-data-[collapsible=icon]/sidebar:px-4", className)} {...rest} />;
}

export function SidebarFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div data-sidebar="footer" className={cn("mt-auto flex flex-col gap-2 p-3 group-data-[collapsible=icon]/sidebar:px-4", className)} {...rest} />;
}

export function SidebarSeparator({ className }: { className?: string }) {
  return <div role="separator" data-sidebar="separator" className={cn("mx-3 h-px shrink-0 bg-line-default", className)} />;
}

/** Scrolls when the menu is taller than the window. In the icon rail it doesn't, so tooltips can show. */
export function SidebarContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto group-data-[collapsible=icon]/sidebar:overflow-visible", className)}
      {...rest}
    />
  );
}

/** A group of links. Give it a label to make it a named navigation region. */
export function SidebarGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div data-sidebar="group" className={cn("relative flex w-full min-w-0 flex-col px-3 py-2 group-data-[collapsible=icon]/sidebar:px-4", className)} {...rest} />;
}

export function SidebarGroupLabel({ className, as: Tag = "div", ...rest }: HTMLAttributes<HTMLElement> & { as?: "div" | "h2" | "h3" }) {
  return (
    <Tag
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center px-2 text-caption-default text-fg-secondary transition-[margin,opacity] duration-moderate",
        "group-data-[collapsible=icon]/sidebar:-mt-8 group-data-[collapsible=icon]/sidebar:opacity-0 group-data-[collapsible=icon]/sidebar:sr-only",
        className,
      )}
      {...rest}
    />
  );
}

/** A small icon button at the end of a group label (e.g. "Add project"). */
export function SidebarGroupAction({ icon = "plus", label, className, ...rest }: ComponentPropsWithoutRef<"button"> & { icon?: IconName; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-sidebar="group-action"
      className={cn("absolute end-4 top-3.5 inline-flex size-6 items-center justify-center rounded-sm text-icon-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring group-data-[collapsible=icon]/sidebar:hidden", className)}
      {...rest}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

export function SidebarGroupContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div data-sidebar="group-content" className={cn("w-full text-body-small", className)} {...rest} />;
}

export function SidebarMenu({ className, ...rest }: HTMLAttributes<HTMLUListElement>) {
  return <ul data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-0.5", className)} {...rest} />;
}

export function SidebarMenuItem({ className, ...rest }: HTMLAttributes<HTMLLIElement>) {
  return <li data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...rest} />;
}

const menuButtonBase =
  "peer/menu-button flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-control px-2 text-start text-label-medium outline-none " +
  "text-fg-secondary transition-colors duration-fast hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring " +
  "aria-[current=page]:bg-selected aria-[current=page]:text-fg-brand data-[active=true]:bg-selected data-[active=true]:text-fg-brand " +
  "disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pe-8 " +
  // In the icon rail the row shrinks to 40×40 and clips its label (still read by screen readers).
  "group-data-[collapsible=icon]/sidebar:size-10! group-data-[collapsible=icon]/sidebar:p-2.5! " +
  "[&>span:last-child]:truncate [&>svg]:shrink-0";
const menuButtonSize = { sm: "h-8 text-label-small", md: "h-10", lg: "h-12 group-data-[collapsible=icon]/sidebar:p-1!" } as const;

type MenuButtonOwn = {
  /** Renders a link. Without it, a button. */
  href?: string;
  /** Marks the current page (aria-current="page" on links). */
  isActive?: boolean;
  /** Shown as a tooltip when the sidebar is collapsed to icons. */
  tooltip?: string;
  size?: keyof typeof menuButtonSize;
  variant?: "default" | "outline";
};
type MenuButtonProps = MenuButtonOwn & Omit<ComponentPropsWithoutRef<"button">, "type"> & { target?: string };

/** One row in a sidebar menu: icon + label (+ badge/action). Renders a Next.js link when given an href. */
export const SidebarMenuButton = forwardRef<HTMLElement, MenuButtonProps>(function SidebarMenuButton(
  { href, isActive, tooltip, size = "md", variant = "default", className, children, ...rest },
  ref,
) {
  const { state, isMobile } = useSidebar();
  const cls = cn(menuButtonBase, menuButtonSize[size], variant === "outline" && "border border-line-default bg-surface", className);
  const el = href ? (
    <NextLink
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      data-sidebar="menu-button"
      aria-current={isActive ? "page" : undefined}
      className={cls}
      {...(rest as ComponentPropsWithoutRef<"a">)}
    >
      {children}
    </NextLink>
  ) : (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" data-sidebar="menu-button" data-active={isActive || undefined} className={cls} {...rest}>
      {children}
    </button>
  );
  if (!tooltip || state !== "collapsed" || isMobile) return el;
  return <Tooltip content={tooltip} placement="right" delay={200}>{el}</Tooltip>;
});

/** An icon button at the end of a menu row (e.g. "More" for a project). Use `showOnHover` to reveal it on hover/focus only. */
export const SidebarMenuAction = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button"> & { icon?: IconName; label: string; showOnHover?: boolean }>(
  function SidebarMenuAction({ icon = "more", label, showOnHover, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        data-sidebar="menu-action"
        className={cn(
          "absolute end-1 top-2 inline-flex size-6 items-center justify-center rounded-sm text-icon-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring group-data-[collapsible=icon]/sidebar:hidden",
          showOnHover && "md:opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100",
          className,
        )}
        {...rest}
      >
        <Icon name={icon} size={16} />
      </button>
    );
  },
);

/** A count at the end of a row. Say what it counts for screen readers: <SidebarMenuBadge label="unread">4</SidebarMenuBadge> */
export function SidebarMenuBadge({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <span data-sidebar="menu-badge" className={cn("pointer-events-none absolute end-2 top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-subtle px-1.5 text-label-small text-fg-secondary group-data-[collapsible=icon]/sidebar:hidden", className)}>
      {children}
      {label && <span className="sr-only"> {label}</span>}
    </span>
  );
}

export function SidebarMenuSkeleton({ showIcon, className }: { showIcon?: boolean; className?: string }) {
  const [w] = useState(() => `${50 + Math.floor(Math.random() * 40)}%`);
  return (
    <div aria-hidden data-sidebar="menu-skeleton" className={cn("flex h-8 items-center gap-2 rounded-control px-2", className)}>
      {showIcon && <span className="size-4 animate-pulse rounded-sm bg-surface-subtle" />}
      <span className="h-4 animate-pulse rounded-sm bg-surface-subtle" style={{ width: w }} />
    </div>
  );
}

/** Nested links under a row, indented with a guide line. */
export function SidebarMenuSub({ className, ...rest }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-sidebar="menu-sub"
      className={cn("ms-5 flex min-w-0 flex-col gap-0.5 border-s border-line-default py-0.5 ps-2.5 group-data-[collapsible=icon]/sidebar:hidden", className)}
      {...rest}
    />
  );
}

export function SidebarMenuSubItem({ className, ...rest }: HTMLAttributes<HTMLLIElement>) {
  return <li data-sidebar="menu-sub-item" className={cn("relative", className)} {...rest} />;
}

export function SidebarMenuSubButton({ href = "#", isActive, className, children, ...rest }: ComponentPropsWithoutRef<"a"> & { isActive?: boolean }) {
  return (
    <NextLink
      href={href}
      data-sidebar="menu-sub-button"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-8 min-w-0 items-center gap-2 overflow-hidden rounded-control px-2 text-body-small text-fg-secondary outline-none hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring",
        "aria-[current=page]:bg-selected aria-[current=page]:text-fg-brand [&>span:last-child]:truncate",
        className,
      )}
      {...rest}
    >
      {children}
    </NextLink>
  );
}

/** Open/closed state for a collapsible menu row or group (APG disclosure). Spread triggerProps on the button
 *  and contentProps on the panel:
 *    const d = useDisclosure(true);
 *    <SidebarMenuButton {...d.triggerProps}>Projects <Icon name="chevron-down" /></SidebarMenuButton>
 *    <SidebarMenuSub {...d.contentProps}>…</SidebarMenuSub> */
export function useDisclosure(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return {
    open,
    setOpen,
    triggerProps: { "aria-expanded": open, "aria-controls": id, onClick: () => setOpen((o) => !o) },
    contentProps: { id, hidden: !open },
  };
}
