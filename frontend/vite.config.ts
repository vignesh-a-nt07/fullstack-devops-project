import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      host: env.VITE_HOST || 'localhost',
    },
    plugins: [react(), svgr()],
  }
})
