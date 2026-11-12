"use client";
import {
  Children, cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useId, useRef, useState,
  type KeyboardEvent, type ReactElement, type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Button, IconButton } from "./button";

type Placement = "top" | "bottom" | "left" | "right";
const place: Record<Placement, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 me-2 -translate-y-1/2",
  right: "left-full top-1/2 ms-2 -translate-y-1/2",
};

/* ===================================================================================
   Tooltip — Figma: Tooltip. Short text on hover or focus; Esc hides it (WCAG 1.4.13).
   Never put interactive content inside — use a Popover.
   =================================================================================== */
export function Tooltip({ content, placement = "top", delay = 400, children }: { content: string; placement?: Placement; delay?: number; children: ReactElement<Record<string, unknown>> }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => { clearTimeout(t.current); t.current = setTimeout(() => setOpen(true), delay); };
  const hide = () => { clearTimeout(t.current); setOpen(false); };
  useEffect(() => {
    if (!open) return;
    const esc = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc); return () => document.removeEventListener("keydown", esc);
  }, [open]);
  const child = Children.only(children);
  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={() => { clearTimeout(t.current); setOpen(true); }} onBlur={hide}>
      {isValidElement(child) ? cloneElement(child, { "aria-describedby": open ? id : undefined }) : child}
      <span role="tooltip" id={id} hidden={!open}
        className={cn("pointer-events-none absolute z-[var(--ds-z-tooltip)] w-max max-w-60 rounded-md bg-inverse px-2 py-1 text-caption-default text-fg-inverse shadow-elevation-2", place[placement])}>
        {content}
      </span>
    </span>
  );
}

/* Shared: close on outside click + Escape, return focus to the trigger. */
function useDismiss(open: boolean, close: () => void, root: React.RefObject<HTMLElement | null>, trigger: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) close(); };
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") { close(); trigger.current?.focus(); } };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open, close, root, trigger]);
}
const focusables = (el: HTMLElement | null) => Array.from(el?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])') ?? []);

/* ===================================================================================
   Popover — Figma: Popover. A small non-modal panel by its trigger; focus moves in, Esc returns it.
   =================================================================================== */
export function Popover({ trigger, title, description, children, placement = "bottom", width = 320 }: {
  /** Render prop gets the props to spread on your button. */ trigger: (p: { ref: React.Ref<HTMLButtonElement>; onClick: () => void; "aria-haspopup": "dialog"; "aria-expanded": boolean; "aria-controls": string }) => ReactNode;
  title?: string; description?: string; children?: ReactNode; placement?: Placement; width?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null), panel = useRef<HTMLDivElement>(null), btn = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, root, btn);
  useEffect(() => { if (open) (focusables(panel.current)[0] ?? panel.current)?.focus(); }, [open]);
  return (
    <span ref={root} className="relative inline-flex">
      {trigger({ ref: btn, onClick: () => setOpen((o) => !o), "aria-haspopup": "dialog", "aria-expanded": open, "aria-controls": id })}
      {open && (
        <div ref={panel} id={id} role="dialog" aria-label={title} tabIndex={-1} style={{ width }}
          className={cn("absolute z-[var(--ds-z-dropdown)] flex flex-col gap-2 rounded-container border border-line-default bg-surface p-4 text-start shadow-elevation-3 outline-none", place[placement])}>
          {title && <h2 className="text-label-large">{title}</h2>}
          {description && <p className="text-body-small text-fg-secondary">{description}</p>}
          {children}
        </div>
      )}
    </span>
  );
}

/* ===================================================================================
   Dialog — Figma: Dialog. Native <dialog> + showModal(): the page behind is inert, focus stays
   inside, Esc closes, focus returns to the trigger. Danger focuses Cancel first.
   =================================================================================== */
export function Dialog({ open, onClose, title, description, children, footer, size = "md", tone = "default", showClose = true, primaryLabel, onPrimary, secondaryLabel = "Cancel" }: {
  open: boolean; onClose: () => void; title: string; description?: string; children?: ReactNode;
  /** Custom footer. Or use primaryLabel / onPrimary / secondaryLabel for the standard one. */ footer?: ReactNode;
  size?: "sm" | "md"; tone?: "default" | "danger"; showClose?: boolean; primaryLabel?: string; onPrimary?: () => void; secondaryLabel?: string | null;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const tid = useId(), did = useId();
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement;
      d.showModal();
      const target = tone === "danger" ? d.querySelector<HTMLElement>("[data-cancel]") : d.querySelector<HTMLElement>("input,select,textarea") ?? focusables(d.querySelector("[data-body]"))[0];
      (target ?? focusables(d)[0])?.focus();
    }
    if (!open && d.open) { d.close(); opener.current?.focus(); }
  }, [open, tone]);
  return (
    <dialog ref={ref} aria-labelledby={tid} aria-describedby={description ? did : undefined} onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className={cn("m-auto w-[calc(100%-32px)] rounded-container border border-line-default bg-surface p-0 text-fg-primary shadow-elevation-3 backdrop:bg-overlay", size === "sm" ? "max-w-[400px]" : "max-w-[560px]")}>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-3">
          {tone === "danger" && <span className="grid size-10 shrink-0 place-items-center rounded-full bg-danger-subtle"><Icon name="alert-triangle" className="text-icon-danger" /></span>}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id={tid} className="text-heading-h4">{title}</h2>
            {description && <p id={did} className="text-body-small text-fg-secondary">{description}</p>}
          </div>
          {showClose && <IconButton icon="close" label="Close" variant="ghost" size="sm" onClick={onClose} />}
        </div>
        {children && <div data-body className="flex flex-col gap-4">{children}</div>}
        {(footer ?? primaryLabel) && (
          <div className="flex flex-wrap justify-end gap-2">
            {footer ?? (
              <>
                {secondaryLabel && <Button variant="secondary" data-cancel onClick={onClose}>{secondaryLabel}</Button>}
                <Button tone={tone} onClick={onPrimary}>{primaryLabel}</Button>
              </>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}

/* ===================================================================================
   Drawer — Figma: Drawer. Full-height modal panel from the end edge (360px, full width on mobile).
   =================================================================================== */
export function Drawer({ open, onClose, title, children, footer, width = 400 }: { open: boolean; onClose: () => void; title: string; children?: ReactNode; footer?: ReactNode; width?: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const tid = useId();
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) { opener.current = document.activeElement as HTMLElement; d.showModal(); (focusables(d.querySelector("[data-body]"))[0] ?? focusables(d)[0])?.focus(); }
    if (!open && d.open) { d.close(); opener.current?.focus(); }
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby={tid} onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === ref.current) onClose(); }}
      style={{ ["--w" as string]: `${width}px` }}
      className="fixed inset-y-0 start-auto end-0 m-0 h-dvh max-h-dvh w-full max-w-full border-s border-line-default bg-surface p-0 text-fg-primary shadow-elevation-3 backdrop:bg-overlay sm:w-[var(--w)]">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-line-default px-6 py-4">
          <h2 id={tid} className="text-heading-h4">{title}</h2>
          <IconButton icon="close" label="Close" variant="ghost" size="sm" onClick={onClose} />
        </div>
        <div data-body className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line-default px-6 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}

/* ===================================================================================
   Menu + Menu Item — Figma: Menu. APG Menu Button: Enter/Space/↓ open on the first item,
   ↑↓ move, Home/End jump, a letter jumps, Enter runs it, Esc closes and returns focus.
   =================================================================================== */
export type MenuItemData = { label: string; icon?: IconName; tone?: "default" | "danger"; disabled?: boolean; shortcut?: string; separatorBefore?: boolean; onSelect?: () => void };

export function MenuItem({ item, active, onSelect, onHover, refCb }: { item: MenuItemData; active: boolean; onSelect: () => void; onHover: () => void; refCb: (el: HTMLButtonElement | null) => void }) {
  return (
    <button ref={refCb} type="button" role="menuitem" tabIndex={active ? 0 : -1} aria-disabled={item.disabled || undefined}
      onClick={() => !item.disabled && onSelect()} onMouseEnter={onHover}
      className={cn("flex w-full items-center gap-3 rounded-sm px-3 py-2 text-start text-body-small outline-none",
        item.disabled ? "cursor-not-allowed text-fg-disabled" : item.tone === "danger" ? "text-fg-danger focus:bg-danger-subtle" : "focus:bg-neutral-hover")}>
      {item.icon && <Icon name={item.icon} className={item.disabled ? "text-icon-disabled" : item.tone === "danger" ? "text-icon-danger" : "text-icon-secondary"} />}
      <span className="flex-1">{item.label}</span>
      {item.shortcut && <kbd className="font-sans text-caption-default text-fg-secondary">{item.shortcut}</kbd>}
    </button>
  );
}

export function Menu({ label, items, trigger, placement = "bottom-end" }: {
  /** Names the trigger, e.g. "More actions for Esther Howard". */ label: string; items: MenuItemData[];
  trigger?: (p: { ref: React.Ref<HTMLButtonElement>; onClick: () => void; onKeyDown: (e: KeyboardEvent) => void; "aria-haspopup": "menu"; "aria-expanded": boolean; "aria-controls": string }) => ReactNode;
  placement?: "bottom-start" | "bottom-end";
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLSpanElement>(null), btn = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, root, btn);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
  useEffect(() => { if (open) itemRefs.current[active]?.focus(); }, [open, active]);
  const openAt = (i: number) => { setActive(i); setOpen(true); };
  const onTriggerKey = (e: KeyboardEvent) => {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) { e.preventDefault(); openAt(enabled[0] ?? 0); }
    if (e.key === "ArrowUp") { e.preventDefault(); openAt(enabled[enabled.length - 1] ?? 0); }
  };
  const onMenuKey = (e: KeyboardEvent) => {
    const pos = enabled.indexOf(active);
    const go = (i: number) => { e.preventDefault(); setActive(enabled[(i + enabled.length) % enabled.length]); };
    if (e.key === "ArrowDown") go(pos + 1);
    else if (e.key === "ArrowUp") go(pos - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(enabled.length - 1);
    else if (e.key === "Tab") setOpen(false);
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const n = enabled.findIndex((i, k) => k > pos && items[i].label.toLowerCase().startsWith(e.key.toLowerCase()));
      const m = n >= 0 ? n : enabled.findIndex((i) => items[i].label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (m >= 0) go(m);
    }
  };
  const run = (it: MenuItemData) => { setOpen(false); btn.current?.focus(); it.onSelect?.(); };
  return (
    <span ref={root} className="relative inline-flex">
      {trigger ? trigger({ ref: btn, onClick: () => (open ? setOpen(false) : openAt(enabled[0] ?? 0)), onKeyDown: onTriggerKey, "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": id })
        : <IconButton ref={btn} icon="more" label={label} variant="ghost" aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={() => (open ? setOpen(false) : openAt(enabled[0] ?? 0))} onKeyDown={onTriggerKey} />}
      {open && (
        <div id={id} role="menu" aria-label={label} onKeyDown={onMenuKey}
          className={cn("absolute top-full z-[var(--ds-z-dropdown)] mt-1 flex min-w-48 flex-col rounded-md border border-line-default bg-surface p-1 shadow-elevation-2", placement === "bottom-end" ? "end-0" : "start-0")}>
          {items.map((it, i) => (
            <div key={it.label} className="contents">
              {it.separatorBefore && i > 0 && <div role="separator" className="my-1 h-px bg-line-default" />}
              <MenuItem item={it} active={i === active} onSelect={() => run(it)} onHover={() => !it.disabled && setActive(i)} refCb={(el) => { itemRefs.current[i] = el; }} />
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

/* ===================================================================================
   Toast — Figma: Toast. One persistent live region; polite for neutral/success, assertive for
   danger. Never moves focus. Bottom-end (bottom-center on mobile), max 3, newest on top.
   Auto-dismisses after 5s (pauses on hover/focus); toasts with an action stay 8s.
   =================================================================================== */
type ToastTone = "neutral" | "success" | "danger" | "warning" | "info";
type ToastData = { id: number; message: string; tone?: ToastTone; action?: { label: string; onClick: () => void }; duration?: number };
const ToastCtx = createContext<{ show: (t: Omit<ToastData, "id">) => void; dismiss: (id: number) => void } | null>(null);
const toastIcon: Partial<Record<ToastTone, [IconName, string]>> = { success: ["check-circle", "text-icon-success"], danger: ["alert-circle", "text-icon-danger"], warning: ["alert-triangle", "text-icon-warning"], info: ["info", "text-icon-info"] };

export function Toast({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(onDismiss, data.duration ?? (data.action ? 8000 : 5000));
    return () => clearTimeout(t);
  }, [paused, data, onDismiss]);
  const ic = data.tone && toastIcon[data.tone];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full items-center gap-3 rounded-md bg-inverse px-4 py-3 text-fg-inverse shadow-elevation-3 sm:w-[360px]">
      {ic && <Icon name={ic[0]} className={cn(ic[1], "brightness-150")} />}
      <p className="flex-1 text-body-small">{data.message}</p>
      {data.action && <button type="button" onClick={() => { data.action!.onClick(); onDismiss(); }} className="rounded-sm px-1 text-label-medium underline underline-offset-2 focus-visible:focus-ring">{data.action.label}</button>}
      <button type="button" aria-label="Dismiss" onClick={onDismiss} className="grid size-6 place-items-center rounded-sm hover:bg-white/10 focus-visible:focus-ring"><Icon name="close" size={16} /></button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<ToastData[]>([]);
  const n = useRef(0);
  const dismiss = useCallback((id: number) => setList((l) => l.filter((t) => t.id !== id)), []);
  const show = useCallback((t: Omit<ToastData, "id">) => setList((l) => [{ ...t, id: ++n.current }, ...l].slice(0, 3)), []);
  const polite = list.filter((t) => t.tone !== "danger"), urgent = list.filter((t) => t.tone === "danger");
  return (
    <ToastCtx.Provider value={{ show, dismiss }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[var(--ds-z-toast)] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6 sm:bottom-6 sm:items-end">
        <div role="alert" className="flex w-full flex-col items-center gap-2 sm:items-end">{urgent.map((t) => <Toast key={t.id} data={t} onDismiss={() => dismiss(t.id)} />)}</div>
        <div role="status" aria-live="polite" className="flex w-full flex-col items-center gap-2 sm:items-end">{polite.map((t) => <Toast key={t.id} data={t} onDismiss={() => dismiss(t.id)} />)}</div>
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  const c = useContext(ToastCtx);
  if (!c) throw new Error("useToast() needs <ToastProvider> around the app.");
  return c;
}
