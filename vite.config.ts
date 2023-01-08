import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dns from "dns";

// https://vitejs.dev/config/
dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4200,
    host: "localhost",
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
