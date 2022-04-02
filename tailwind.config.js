const lc = require("@lawandorga/components");

const content = ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"];

module.exports = lc.utils.getTailwindConfig(content);
