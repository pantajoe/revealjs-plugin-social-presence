import dns from 'dns'
import { defineConfig } from 'vite'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  optimizeDeps: {
    include: ['revealjs-plugin-social-presence'],
    force: true,
  },
  build: {
    commonjsOptions: {
      include: [/revealjs-plugin-social-presence/, /node_modules/]
    }
  },
  server: {
    open: false,
    port: 3000,
  },
})
