import {
  formatLandingDate,
  getActiveStep,
  MAIL_SUBJECTS,
  mailto,
} from "../utils/landing";

describe("getActiveStep", () => {
  const steps = (tops: number[]) =>
    tops.map((top, i) => ({ id: `step-${i}`, top }));

  it("returns undefined without steps", () => {
    expect(getActiveStep([], 1000)).toBeUndefined();
  });

  it("keeps the first area active before any area reaches 60 %", () => {
    expect(getActiveStep(steps([700, 1300, 1900]), 1000)).toBe("step-0");
  });

  it("activates an area when its top passes 60 % of the viewport", () => {
    expect(getActiveStep(steps([-400, 599, 1200]), 1000)).toBe("step-1");
  });

  it("does not activate an area exactly on the line", () => {
    expect(getActiveStep(steps([-400, 600, 1200]), 1000)).toBe("step-0");
  });

  it("activates the last area that passed the line", () => {
    expect(getActiveStep(steps([-1600, -1000, -400, 100]), 1000)).toBe(
      "step-3",
    );
  });

  it("uses the given ratio", () => {
    expect(getActiveStep(steps([0, 450, 900]), 1000, 0.5)).toBe("step-1");
  });
});

describe("mailto", () => {
  it("links to the team without a subject", () => {
    expect(mailto()).toBe("mailto:team@law-orga.de");
  });

  it("url-encodes the subjects", () => {
    expect(mailto(MAIL_SUBJECTS.demo)).toBe(
      "mailto:team@law-orga.de?subject=Demo-Zugang%20anfragen%20(Website)",
    );
    expect(decodeURIComponent(mailto(MAIL_SUBJECTS.organization))).toBe(
      "mailto:team@law-orga.de?subject=Law&Orga für unsere Organisation (Website)",
    );
    expect(decodeURIComponent(mailto(MAIL_SUBJECTS.support))).toBe(
      "mailto:team@law-orga.de?subject=Law&Orga unterstützen (Website)",
    );
  });
});

describe("formatLandingDate", () => {
  it("formats iso dates as dd.mm.yyyy", () => {
    expect(formatLandingDate("2026-10-08")).toBe("08.10.2026");
  });

  it("returns unknown formats unchanged", () => {
    expect(formatLandingDate("gestern")).toBe("gestern");
  });
});
