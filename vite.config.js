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
    }
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
})
