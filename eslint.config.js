import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";
import typescriptParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const eslintrc = new FlatCompat({
  baseDirectory: baseDir,
  resolvePluginsRelativeTo: baseDir,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: globals.browser,
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
      },
    },
  },
  ...eslintrc.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ),
  ...vuePlugin.configs["flat/essential"],
  {
    rules: {
      "no-unused-vars": "warn",
      "vue/require-default-prop": "off",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
    },
  },
];
