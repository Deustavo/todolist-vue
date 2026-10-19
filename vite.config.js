import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { shortener } from './server.js'

export default defineConfig({
  plugins: [
    vue(),
    {
      // encurtador rodando dentro do próprio dev server
      name: 'shortener',
      configureServer (server) {
        server.middlewares.use(async (req, res, next) => {
          if (!(await shortener(req, res))) next()
        })
      }
    },
    {
      // og:image precisa de URL absoluta para aparecer na prévia do link (WhatsApp, Telegram...)
      name: 'absolute-og-image',
      transformIndexHtml (html) {
        const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
        if (!host) return html
        const origin = host.startsWith('http') ? host : `https://${host}`
        return html.replace(/(property="og:image"|name="twitter:image") content="\//g, `$1 content="${origin}/`)
      }
    }
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
})
