import { Rlc } from "@/types/core";

export interface Event {
  id: number;
  is_global: boolean;
  name: string;
  description: string;
  start_time: Date;
  end_time: Date;
  org: Rlc;
}

export interface EventCreate {
  is_global: boolean;
  name: string;
  description: string;
  start_time: Date;
  end_time: Date;
}

export interface EventUpdate {
  is_global?: boolean;
  name?: string;
  description?: string;
  start_time?: Date;
  end_time?: Date;
}
