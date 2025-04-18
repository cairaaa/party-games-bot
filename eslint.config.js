import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticTs from '@stylistic/eslint-plugin-ts'

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.ts"],
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@stylistic/ts/comma-dangle": ["error", "never"],
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-empty": ["off"]
    }
  }
);