module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    // "@vue/prettier/@typescript-eslint",
  ],
  // parser: "@typescript-eslint/parser",
  plugins: ["vue", "prettier"],
  rules: {
    "no-unused-vars": "warn",
    "vue/no-unused-components": "warn",
    "vue/component-name-in-template-casing": [
      "error",
      "PascalCase",
      {
        ignores: [],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "all",
        singleQuote: false,
        semi: true,
        htmlWhitespaceSensitivity: "ignore",
        endOfLine: "auto",
      },
    ],
  },
  globals: {
    axios: "readonly",
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
};
