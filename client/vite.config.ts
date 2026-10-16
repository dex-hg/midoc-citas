import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode: modo }) => {
  const entorno = loadEnv(modo, process.cwd(), 'MIDOC_')
  const destinoServidor = new URL(
    entorno.MIDOC_SERVIDOR_URL || 'http://127.0.0.1:8080',
  )

  if (
    !['http:', 'https:'].includes(destinoServidor.protocol) ||
    destinoServidor.pathname !== '/' ||
    destinoServidor.username ||
    destinoServidor.password ||
    destinoServidor.search ||
    destinoServidor.hash
  ) {
    throw new Error('MIDOC_SERVIDOR_URL debe ser una URL HTTP o HTTPS sin ruta ni credenciales.')
  }

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': { target: destinoServidor.origin, changeOrigin: false },
      },
    },
    preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  }
})
