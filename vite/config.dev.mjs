import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  server: {
    port: 8080, // 使いたいポート番号
    host: "0.0.0.0", // 外部アクセスを可能にするため
  },
  plugins: [basicSsl()],
});
