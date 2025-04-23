import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import baseConfig from "../eslint.config.js";

const svelteConfig = {
  files: ["**/*.svelte"],
  plugins: {
    svelte: svelte
  },
  languageOptions: {
    parser: svelteParser,
    parserOptions: {
      parser: tseslint.parser,
      extraFileExtensions: [".svelte"]
    }
  },
  extends: [
    "plugin:svelte/recommended"
  ]
};

export default [
  ...baseConfig,
  svelteConfig
];
