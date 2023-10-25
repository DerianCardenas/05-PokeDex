import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue()],
  base: '/05-PokeDex/', // reemplaza 'nombre_del_repositorio' con el nombre de tu repositorio en GitHub
})
