export interface Key {
  id: number;
  correct: boolean;
  source: "RECORD" | "RLC";
  information: string;
}
