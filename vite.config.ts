import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '' keeps asset URLs relative, so the same build works on GitHub Pages
// (https://user.github.io/ikrima/), on a custom domain, and from file://.
export default defineConfig({
  base: '',
  plugins: [react()],
  // PORT lets a host assign the dev port when 5173 is already taken.
  server: { port: Number(process.env.PORT) || 5173, host: true },
})
