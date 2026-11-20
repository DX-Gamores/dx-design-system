// Not a client module, so the root layout (a server component) can inline the string.
/** Inline script for <head>: applies the stored settings before the first paint, so there is no flash of the wrong theme. */
export const themeBootScript = `try{var s=JSON.parse(localStorage.getItem("ds-theme")||"{}"),e=document.documentElement;if(s.brand)e.dataset.brand=s.brand;if(s.density)e.dataset.density=s.density;e.dataset.theme=s.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(_){}`;
