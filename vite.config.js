import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/itineraries": {
        target: "http://localhost:8080", // Cambia porta se diversa
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
