import {
  CalendarIcsInfo,
  Event,
  EventCreate,
  EventUpdate,
} from "@/types/event";
import axios from "axios";

class EventsService {
  async getEvents(): Promise<Event[]> {
    return (await axios.get<Event[]>("events/")).data;
  }

  async createEvent(data: EventCreate): Promise<void> {
    await axios.post<Event>("events/", data);
  }

  async updateEvent(data: EventUpdate): Promise<Event> {
    const response = await axios.put<Event>(`events/${data.id}/`, data);
    return response.data;
  }

  async deleteEvent(data: Event): Promise<void> {
    const response = await axios.delete(`events/${data.id}/`);
    return response.data;
  }

  async getCalendarIcsInfo(): Promise<CalendarIcsInfo> {
    return (await axios.get<CalendarIcsInfo>("events/ics_url/")).data;
  }

  async resetCalendarIcsInfo(): Promise<void> {
    await axios.post<CalendarIcsInfo>("events/ics_url/reset/");
  }

  async updateAttendance(data: {
    id: number;
    rlc_user: number;
    attendance: boolean;
  }) {
    console.log(data);
    const response = await axios.put<Event>(`events/${data.id}/`, data);
    return response.data;
  } // TODO: Necessary?
}

/*export function updateAttendance(data: {
  id: number;
  rlc_user: number;
  attendance: boolean;
}): Promise<void> {
  return axios.put(`api/events/${data.id}/`, data).then();
}*/

export default new EventsService();
