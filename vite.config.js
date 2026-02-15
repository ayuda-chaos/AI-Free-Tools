const path = require('path')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

/** @type {import('vite').UserConfig} */
module.exports = {
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, 'shims/lucide-react.js')
    }
  }
}
