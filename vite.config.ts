import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: "shades-ext",
    minify: false, // easier to debug during dev
    sourcemap: true,
  },
});
