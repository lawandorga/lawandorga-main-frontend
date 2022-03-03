const colors = require("tailwindcss/colors");  // eslint-disable-line

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        lorgablue: "#003c4d",
        blue: {
          50: "#eff9fb",
          100: "#d0e7ed",
          200: "#aad0db",
          300: "#8abbc9",
          400: "#6ca7b7",
          500: "#428193",
          600: "#275f6f",
          700: "#153f4b",
          800: "#0a2027",
          900: "#010203",
        },
      },
      extend: {
        backgroundColor: ["odd", "even", "checked", "focus"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            table: {},
            thead: {
              border: "none",
            },
            tr: {
              border: "none",
            },
            "tr:last-child": {
              borderBottomWidth: "0",
            },
            th: {
              verticalAlign: "bottom",
              borderWidth: "2px",
              borderColor: theme("colors.gray.400", colors.gray[400]),
              backgroundColor: theme("colors.gray.200", colors.gray[200]),
              padding: "4px 8px",
            },
            "th > p, td > p": {
              margin: 0,
            },
            td: {
              verticalAlign: "top",
              borderWidth: "2px",
              borderColor: theme("colors.gray.300", colors.gray[300]),
              backgroundColor: theme("colors.gray.100", colors.gray[100]),
            },
            "tbody td:first-child": {
              paddingLeft: "auto",
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
