import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: '/lowflow-design',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3200,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  },
  plugins: [
    react()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        sanitizeFileName(name) {
          const match = /^[a-z]:/i.exec(name)
          const driveLetter = match ? match[0] : ''
          return (
            driveLetter +
            name.substring(driveLetter.length).replace(/[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g, '')
          )
        }
      }
    }
  }
})
