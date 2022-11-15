module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    // https://eslint.org/docs/user-guide/getting-started#configuration
    "eslint:recommended",
    // https://typescript-eslint.io/docs/linting/#configuration
    "plugin:@typescript-eslint/recommended",
    // https://eslint.vuejs.org/user-guide/#usage
    "plugin:vue/vue3-recommended",
    // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration or https://github.com/prettier/eslint-config-prettier#installation
    "prettier",
  ],
  // https://github.com/vuejs/vue-eslint-parser#-usage
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  plugins: [
    // https://github.com/prettier/eslint-plugin-prettier#installation
    "prettier",
  ],
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
    // https://github.com/prettier/eslint-plugin-prettier#installation
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
};
