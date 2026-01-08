import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['cronograma.alunostropadoarcanjo.com.br'],
    hmr: {
      host: 'cronograma.alunostropadoarcanjo.com.br',
      protocol: 'wss', // Força o WebSocket a usar Secure (HTTPS)
      clientPort: 443  // Porta que o aluno acessa no navegador
    }
  }
})
