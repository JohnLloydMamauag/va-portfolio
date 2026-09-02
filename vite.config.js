import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project from /va-portfolio/, Vercel serves it from /.
// GITHUB_PAGES is set by the deploy workflow so the built asset paths match each host.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/va-portfolio/' : '/',
})
