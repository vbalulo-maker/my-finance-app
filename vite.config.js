import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-finance-app/', // ← имя вашего репозитория на GitHub
  plugins: [
    react(),
    tailwindcss(),
  ],
})