import { defineConfig } from "vite-plus";

export default defineConfig({
  // ── Disable Vite+'s WebSocket server completely ──────────
  // Nuxt owns the HTTP server. Vite+ core registers its own
  // hmrServerWsListener on "upgrade" which causes:
  //   "server.handleUpgrade() was called more than once"
  // Setting ws:false prevents Vite+ from attaching that listener.
  server: {
    ws: false,
    hmr: false,
  },

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
