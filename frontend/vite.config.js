import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const loaded = loadEnv(mode, process.cwd(), '')
  const viteApiUrl =
    process.env.VITE_API_URL?.trim() || loaded.VITE_API_URL?.trim() || ''

  if (mode === 'production') {
    console.log(
      '[vite build] VITE_API_URL:',
      viteApiUrl ? `${viteApiUrl.slice(0, 24)}…` : 'VACÍA — el bundle usará localhost'
    )
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(viteApiUrl),
    },
  }
})
