import { Rlc } from "@/types/core";

export interface Event {
  id: number;
  level: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  org: Rlc;
}

export interface CalendarIcsInfo {
  id: number;
  calendar_uuid: string;
  calendar_url: string;
}
