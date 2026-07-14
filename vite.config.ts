import { defineConfig } from "vite-plus";

export default defineConfig({
  // ── Server / HMR intentionally omitted ──────────────────
  // This project uses Nuxt, which manages its own Vite dev server via
  // nuxt.config.ts › vite.server.hmr. Defining server options here causes
  // Nuxt to register a second WebSocket upgrade handler on the same socket,
  // producing the "handleUpgrade() called more than once" crash.
  // All Vite server/HMR settings live in nuxt.config.ts only.

  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
