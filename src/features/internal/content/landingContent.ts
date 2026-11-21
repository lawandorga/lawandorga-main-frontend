// Fixed content of the public landing page (/start/): showroom areas and the
// "Außerdem in Law&Orga" rows. Kept in the frontend on purpose, the backend
// only provides the articles. Texts from the design reference; screenshots
// show the demo organization with dummy data only.

export interface LandingArea {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  screenshot_url: string | null;
  screenshot_alt: string;
  screenshot_note: string;
}

const icon = (name: string) => `/landing/icons/ic-${name}.png`;
const shot = (name: string) => `/landing/screenshots/shot-${name}.webp`;

const NOTE_DEMO_DATA =
  "Screenshot aus der Demo-Organisation, Daten durch Beispieldaten ersetzt.";

export const SHOWROOM_AREAS: LandingArea[] = [
  {
    id: "akten",
    title: "Akten",
    description:
      "Alle Akten im Überblick: suchen, nach Tags und Status filtern und eigene Ansichten anlegen. Zugriff vergebt ihr an einzelne Personen oder Gruppen.",
    icon_url: icon("akten"),
    screenshot_url: shot("akten"),
    screenshot_alt:
      "Screenshot: Aktenliste mit zehn Beispielakten, ihren Tags, Status, Beschreibung und Datum",
    screenshot_note: NOTE_DEMO_DATA,
  },
  {
    id: "akte",
    title: "Einzelne Akte",
    description:
      "Alles zu einem Fall an einem Ort: Datenblätter mit eigenen Feldern und Vorlagen, Chat, Dateien, Fragebögen, Mail-Importe, Timeline und gemeinsame Dokumente. Offene Pflichtfelder werden angemahnt.",
    icon_url: icon("akten"),
    screenshot_url: shot("akte"),
    screenshot_alt:
      "Screenshot: Einzelne Akte mit Datenblatt-Feldern wie Erstkontakt, Beschreibung des Anliegens, Berater:innen, Tags und Status sowie Bereichen für Chat, Dateien, Fragebögen, Mail-Importe, Timeline und Collabs",
    screenshot_note: NOTE_DEMO_DATA,
  },
  {
    id: "aufgaben",
    title: "Aufgaben",
    description:
      "Aufgaben mit einer oder mehreren zuständigen Personen, Prioritäten, Fortschritt, Tags und Kommentaren mit Zeitstempel. Mit # verlinkt ihr eine Akte direkt im Text.",
    icon_url: icon("tasks"),
    screenshot_url: shot("tasks"),
    screenshot_alt:
      "Screenshot: Aufgabe „Widerspruch entwerfen“ mit zwei zuständigen Personen, Fortschritt 25 %, Priorität Medium und Tag Sozialrecht",
    screenshot_note: NOTE_DEMO_DATA,
  },
  {
    id: "kalender",
    title: "Kalender",
    description:
      "Tages-, Wochen-, Monats- und Listenansicht mit verschiedenen Terminarten. Freigabe für Personen, Gruppen oder die ganze Organisation mit Lese- und Bearbeitungsrechten pro Termin. Erinnerungen per E-Mail und Push, Export in externe Kalender.",
    icon_url: icon("kalender"),
    screenshot_url: shot("kalender"),
    screenshot_alt:
      "Screenshot: Wochenansicht des Kalenders mit Terminen wie Erstberatung, Supervision und Teamtreffen sowie Filtern nach Terminart und Freigabe",
    screenshot_note: NOTE_DEMO_DATA,
  },
  {
    id: "chat",
    title: "Chat und Signal",
    description:
      "Chat auf eigenem Matrix-Server, auch direkt in der Akte. Über die Signal-Bridge erreicht ihr Personen ohne Law&Orga-Zugang.",
    icon_url: icon("kommunikation"),
    // no screenshot yet: the panel shows the icon and the title
    screenshot_url: null,
    screenshot_alt: "",
    screenshot_note: "",
  },
  {
    id: "statistik",
    title: "Statistik",
    description:
      "Nur für eure Organisation: offene, laufende und abgeschlossene Akten, Monats- und Jahresübersicht und eigene Auswertungen über Tags.",
    icon_url: icon("statistik"),
    screenshot_url: shot("statistik"),
    screenshot_alt:
      "Ausschnitte aus der Statistik: Kreisdiagramme zu Geschlecht, Nationalität, Tags und Aktenstatus sowie ein Balkendiagramm zu angelegten und geschlossenen Akten",
    screenshot_note:
      "Ausschnitte aus der Statistik der Demo-Organisation, neu angeordnet.",
  },
];

export const MORE_AREAS: LandingArea[] = [
  {
    id: "dashboard",
    title: "Dashboard und News",
    description:
      "Ankündigungen für die ganze Organisation, Follow-ups und zuletzt bearbeitete Akten auf einen Blick.",
    icon_url: icon("dashboard"),
    screenshot_url: shot("dashboard"),
    screenshot_alt:
      "Screenshot: Dashboard mit Fragebögen, Follow-ups, zuletzt bearbeiteten Akten und News",
    screenshot_note: NOTE_DEMO_DATA,
  },
  {
    id: "mail",
    title: "E-Mail und externe Anfragen",
    description:
      "Eigener E-Mail-Betrieb über Law&Orga, Mailimport direkt in Akten und Dateien von Externen sicher per Link anfordern.",
    icon_url: icon("mail"),
    screenshot_url: null,
    screenshot_alt: "",
    screenshot_note: "",
  },
  {
    id: "admin",
    title: "Admin-Bereich und Zugriffsrechte",
    description:
      "Übersicht über Gruppen, Filter nach letztem Login und Aktivität. Rechte steuert ihr fein pro Person und Gruppe.",
    icon_url: icon("admin"),
    screenshot_url: shot("admin"),
    screenshot_alt:
      "Screenshot: Admin-Bereich mit Profilen, Gruppen, Vorlagen, Sidebar und Organisationseinstellungen",
    screenshot_note: "Screenshot aus der Demo-Organisation.",
  },
];
