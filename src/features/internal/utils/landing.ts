// helpers for the public landing page (/start/)

export interface StepPosition {
  id: string;
  top: number;
}

/**
 * The showroom area that is active for the current scroll position.
 *
 * An area becomes active when its top passes `ratio` of the viewport height
 * (60 % by default). Before the first area reaches that line, the first area
 * is active. `steps` must be in document order.
 */
export function getActiveStep(
  steps: StepPosition[],
  viewportHeight: number,
  ratio = 0.6,
): string | undefined {
  if (!steps.length) return undefined;
  const line = viewportHeight * ratio;
  let id = steps[0].id;
  for (const step of steps) {
    if (step.top < line) id = step.id;
  }
  return id;
}

export interface SectionPosition {
  id: string;
  top: number;
  bottom: number;
}

/**
 * The section of the anchor navigation the reader is in.
 *
 * A section is active while it contains the reading line (`line`, measured
 * from the top of the viewport, below the sticky header). Above the first
 * section (hero) and in sections without a menu entry nothing is active.
 */
export function getActiveSection(
  sections: SectionPosition[],
  line: number,
): string | undefined {
  for (const section of sections) {
    if (section.top <= line && section.bottom > line) return section.id;
  }
  return undefined;
}

/** reading line: a third of the viewport, but never inside the header */
export function getReadingLine(viewportHeight: number, minimum = 120): number {
  return Math.max(minimum, Math.round(viewportHeight / 3));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const TEAM_EMAIL = "team@law-orga.de";

export function mailto(subject?: string): string {
  if (!subject) return `mailto:${TEAM_EMAIL}`;
  return `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const MAIL_SUBJECTS = {
  demo: "Demo-Zugang anfragen (Website)",
  organization: "Law&Orga für unsere Organisation (Website)",
  fund: "Law&Orga fördern (Website)",
  support: "Law&Orga unterstützen (Website)",
} as const;

/** 2026-10-08 → 08.10.2026 */
export function formatLandingDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  return `${match[3]}.${match[2]}.${match[1]}`;
}

// served from public/, bound in templates so the build does not import it
export const LCD_LOGO_URL = "/landing/lcd-logo.svg";

export const DEFAULT_SCREENSHOT_NOTE =
  "Screenshot aus der Demo-Organisation mit Beispieldaten.";

export const PAGE_TITLE =
  "Law&Orga – Sichere Fallverwaltung und professionelles Projektmanagement für Law Clinics";

export const PAGE_DESCRIPTION =
  "Sichere Fallverwaltung und professionelles Projektmanagement für Law Clinics, Beratungs- und Hilfsorganisationen: Akten, Aufgaben, Termine und Chat an einem Ort. Verschlüsselt, auf Servern in der EU, quelloffen.";
