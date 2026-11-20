import {
  formatLandingDate,
  getActiveSection,
  getActiveStep,
  getReadingLine,
  MAIL_SUBJECTS,
  mailto,
} from "../utils/landing";

describe("getActiveSection", () => {
  const sections = [
    { id: "einblick", top: 300, bottom: 2300 },
    { id: "sicherheit", top: 2300, bottom: 3300 },
    // a section without menu entry in between is simply not in the list
    { id: "roadmap", top: 4000, bottom: 5000 },
  ];
  const shift = (by: number) =>
    sections.map((s) => ({ ...s, top: s.top - by, bottom: s.bottom - by }));

  it("highlights nothing in the hero above the first section", () => {
    expect(getActiveSection(sections, 300 - 1)).toBeUndefined();
  });

  it("highlights the section that contains the reading line", () => {
    expect(getActiveSection(shift(0), 300)).toBe("einblick");
    expect(getActiveSection(shift(2100), 300)).toBe("sicherheit");
    expect(getActiveSection(shift(3800), 300)).toBe("roadmap");
  });

  it("switches exactly at the section border", () => {
    expect(getActiveSection(shift(1999), 300)).toBe("einblick");
    expect(getActiveSection(shift(2000), 300)).toBe("sicherheit");
  });

  it("highlights nothing in a section without menu entry", () => {
    expect(getActiveSection(shift(3200), 300)).toBeUndefined();
  });
});

describe("getReadingLine", () => {
  it("uses a third of the viewport", () => {
    expect(getReadingLine(900)).toBe(300);
  });

  it("never lies inside the sticky header", () => {
    expect(getReadingLine(300)).toBe(120);
  });
});

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
    expect(mailto(MAIL_SUBJECTS.fund)).toBe(
      "mailto:team@law-orga.de?subject=Law%26Orga%20f%C3%B6rdern%20(Website)",
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
