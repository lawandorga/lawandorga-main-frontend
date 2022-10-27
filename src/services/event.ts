import { Event, EventCreate, EventUpdate } from "@/types/event";
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
}

export default new EventsService();
