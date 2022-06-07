// see: https://personal.sron.nl/~pault/

const bright = [
  "#4477aa",
  "#66ccee",
  "#228833",
  "#ccbb44",
  "#ee6677",
  "#aa3377",
  "#bbbbbb",
];

const getColors = (n: number | string): string[] => {
  if (typeof n === "string") return ["#bbbbbb"];

  const ret = [];

  for (let i = 0; i < n; i++) {
    ret.push(bright[i % bright.length]);
  }

  return ret;
};

export default getColors;
