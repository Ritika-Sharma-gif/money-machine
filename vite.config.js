import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const authBase = env.NEON_AUTH_BASE_URL;
  return {
    server: {
      allowedHosts: ["terminal.local"],
      // Mirror the production /neon-auth rewrite (see vercel.json). Run the
      // API locally with `vercel dev`, which serves /api on the same port.
      proxy: authBase
        ? {
            "/neon-auth": {
              target: new URL(authBase).origin,
              changeOrigin: true,
              rewrite: (p) => p.replace(/^\/neon-auth/, new URL(authBase).pathname),
            },
          }
        : undefined,
    },
    esbuild: { jsx: "automatic" },
  };
});
