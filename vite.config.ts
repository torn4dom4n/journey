import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import Yaml from "unplugin-yaml/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  base: "./",
  plugins: [vue(), UnoCSS(), Yaml()],
});
