import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Yaml from 'unplugin-yaml/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Yaml(),
  ],
})
