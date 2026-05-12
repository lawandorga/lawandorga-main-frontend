import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import vuePlugin from "eslint-plugin-vue";
import globals from "globals";
import vueParser from "vue-eslint-parser";

export default [
  js.configs.recommended,
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
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
    },
  },
  ...vuePlugin.configs["flat/essential"],
  {
    rules: {
      "no-unused-vars": "warn",
      "vue/require-default-prop": "off",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/no-undef-components": [
        "error",
        {
          ignorePatterns: [
            "router-link",
            "router-view",
            "RouterLink",
            "RouterView",
          ],
        },
      ],
    },
  },
];
