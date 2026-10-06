import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", (err, req, res) => {
            if (res.writeHead && !res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Backend temporarily unavailable", status: 502 }));
            }
          });
        },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
