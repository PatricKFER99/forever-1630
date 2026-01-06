import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/forever-1630/', // <--- CAMBIA ESTO POR EL NOMBRE EXACTO DE TU REPO
})
