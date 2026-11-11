// Builds components/bundle.js (IIFE, window.DXDS) for the Design System docs artifact.
import { build } from "esbuild";
import fs from "node:fs";
const shim = {
  name: "react-globals",
  setup(b) {
    b.onResolve({ filter: /^react(\/jsx-runtime|-dom)?$/ }, (a) => ({ path: a.path, namespace: "g" }));
    b.onLoad({ filter: /.*/, namespace: "g" }, (a) => ({
      contents:
        a.path === "react/jsx-runtime"
          ? "const R=window.React;const f=(t,p,k)=>R.createElement(t,k===undefined?p:{...p,key:k});module.exports={jsx:f,jsxs:f,Fragment:R.Fragment};"
          : a.path === "react-dom" ? "module.exports=window.ReactDOM;" : "module.exports=window.React;",
      loader: "js",
    }));
  },
};
const out = process.argv[2];
const r = await build({ entryPoints: ["scripts/ds-artifact/bundle-entry.ts"], bundle: true, format: "iife", globalName: "DXDS", minify: true, write: false, jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, plugins: [shim], alias: { "@": "./src" }, logLevel: "error" });
const names = ["Button","IconButton","Badge","Alert","Spinner","Skeleton","Progress","EmptyState","TextField","Textarea","Select","Checkbox","Toggle","SegmentedControl","Tabs","Stepper","Card","Avatar","StatCard","AILabel","Citation","Icon"];
let js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "\\x3C!--");
js = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: "DXDS", components: names.map((name) => ({ name })) })} */\n` + js.replace(/^("use strict";)?var DXDS=/, "$1window.DXDS=");
fs.writeFileSync(out, js);
console.log("bundle", js.length, "bytes; starts:", js.slice(0, 60).replace(/\n/g, " "));
