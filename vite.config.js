import { defineConfig } from "vite";

export default defineConfig({
  server: { allowedHosts: ["terminal.local"] },
  esbuild: { jsx: "automatic" },
});
