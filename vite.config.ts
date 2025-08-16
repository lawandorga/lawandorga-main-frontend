import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dns from "dns";
import tailwindcss from "@tailwindcss/vite";

// sets localhost as default instead of 127.0.0.1
dns.setDefaultResultOrder("verbatim");

// const vitestConfig = {
//   test: {
//     globals: true,
//     environment: "jsdom",
//   },
// };

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
      "@": resolve(__dirname, "src"),
    },
  },
});
