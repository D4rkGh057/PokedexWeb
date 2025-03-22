import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://d4rkgh057.github.io/PokedexWeb',
  server: {
    port: 3000,
  },
  plugins: [react()],
})
