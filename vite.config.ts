import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Cloudflare Pages 使用标准 Vite 静态构建，生产文件输出到 dist/。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});
