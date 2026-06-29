import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import Yaml from "unplugin-yaml/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.BASE_URL || "/",
  plugins: [vue(), UnoCSS(), Yaml()],
  ssgOptions: {
    script: "async",
    formatting: "minify",
    crittersOptions: {
      reduceInlineStyles: false,
    },
  },
});
