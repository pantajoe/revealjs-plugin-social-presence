import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: ['revealjs-plugin-social-presence'],
    force: true,
  },
  build: {
    commonjsOptions: {
      include: [/revealjs-plugin-social-presence/, /node_modules/]
    }
  }
})
