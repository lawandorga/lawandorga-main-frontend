import dns from "dns";
import { resolve } from "path";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// sets localhost as default instead of 127.0.0.1
dns.setDefaultResultOrder("verbatim");

const vitestConfig = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/tests/setup.ts"],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 4204,
    host: "localhost",
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  ...vitestConfig,
});
