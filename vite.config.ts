import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/swagger-ui.html': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/docs': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/openapi.yaml': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/openapi.json': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
