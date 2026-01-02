import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Base path cho GitHub Pages
  // Thay 'STEM-Earth-Green' bằng tên repository của bạn
  base: '/STEM-Earth-Green/',
  
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production
    sourcemap: false,
    
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap'],
        }
      }
    }
  },
  
  // Server options
  server: {
    port: 5173,
    open: true,
  },
  
  // Preview options
  preview: {
    port: 4173,
  }
})
