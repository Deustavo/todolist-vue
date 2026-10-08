import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const PORT = process.env.PORT || 3000
const DIST = join(ROOT, 'dist')
const DB = join(ROOT, 'data', 'links.json')
const MAX_BODY = 20000
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' }

// ponytail: arquivo JSON reescrito a cada link novo, trocar por SQLite se o volume crescer
let links = {}
try { links = JSON.parse(await readFile(DB, 'utf8')) } catch {}

/**
 * Gera um código curto aleatório que ainda não existe
 * @return {string}
 */
function newCode () {
  let code
  do code = randomBytes(6).toString('base64url').slice(0, 7)
  while (links[code])
  return code
}

/**
 * Lê o corpo da requisição com limite de tamanho
 * @return {Promise<string>}
 */
function readBody (req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > MAX_BODY) reject(new Error('too large'))
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

/**
 * Rotas do encurtador. Usado pelo servidor de produção e como middleware do Vite no dev
 * @return {Promise<boolean>} true se a requisição foi respondida
 */
export async function shortener (req, res) {
  const { pathname } = new URL(req.url, 'http://x')

  // Cria link curto. Só aceita caminhos de importação do próprio app (evita open redirect)
  if (req.method === 'POST' && pathname === '/api/shorten') {
    try {
      const { path } = JSON.parse(await readBody(req))
      if (typeof path !== 'string' || !path.startsWith('/?')) throw new Error('invalid')

      const code = newCode()
      links[code] = path
      await mkdir(join(DB, '..'), { recursive: true })
      await writeFile(DB, JSON.stringify(links))
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ code }))
    } catch {
      res.writeHead(400).end()
    }
    return true
  }

  // Redireciona link curto
  const short = pathname.match(/^\/s\/([\w-]+)$/)
  if (short) {
    const target = Object.hasOwn(links, short[1]) && links[short[1]]
    res.writeHead(target ? 302 : 404, target ? { Location: target } : {}).end()
    return true
  }

  return false
}

// Servidor de produção: encurtador + arquivos estáticos do build, com fallback para o index.html
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer(async (req, res) => {
    if (await shortener(req, res)) return

    const { pathname } = new URL(req.url, 'http://x')
    const file = join(DIST, normalize(pathname).replace(/^(\.\.[/\\])+/, ''))
    const path = file.startsWith(DIST) && extname(file) ? file : join(DIST, 'index.html')
    try {
      const content = await readFile(path)
      res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' }).end(content)
    } catch {
      res.writeHead(404).end()
    }
  }).listen(PORT, () => console.log(`http://localhost:${PORT}`))
}
