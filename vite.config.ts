import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import Yaml from "unplugin-yaml/vite";
import { defineConfig } from "vite-plus";

const ignorePatterns = [
  "*.min.*",
  "*.map",
  "**/public",
  "**/build",
  "**/dist",
  "**/out",
  "**/.github",
  "**/.next",
  "**/.astro",
  "**/.netlify",
  "**/*.gen.*",
];

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns,
    sortImports: {
      groups: [
        "type-import",
        ["value-builtin", "value-external"],
        "type-internal",
        "value-internal",
        ["type-parent", "type-sibling", "type-index"],
        ["value-parent", "value-sibling", "value-index"],
        "unknown",
      ],
    },
  },
  lint: {
    plugins: [
      "typescript",
      "unicorn",
      "react",
      "react-perf",
      "import",
      "jsx-a11y",
      "node",
      "promise",
      "vitest",
      "vue",
    ],
    ignorePatterns,
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  plugins: [vue(), UnoCSS(), Yaml()],
  resolve: {
    tsconfigPaths: true,
  },
});
