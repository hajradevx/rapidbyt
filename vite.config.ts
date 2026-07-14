import { defineConfig } from "vite-plus";

export default defineConfig({
  // ── Server: disable Vite+'s own HMR server ───────────────
  // Nuxt manages the Vite dev server and HMR entirely via nuxt.config.ts.
  // If Vite+ also starts an HMR WebSocket listener it registers a second
  // handleUpgrade handler on the same Node.js HTTP server, which crashes
  // with "server.handleUpgrade() was called more than once with the same
  // socket". Passing an empty server block tells Vite+ not to start one.
  server: {
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
