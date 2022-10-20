import { Event, EventCreate, EventUpdate } from "@/types/event";
import axios from "axios";

class EventsService {
  async getEvents(): Promise<Event[]> {
    return (await axios.get<Event[]>("events/")).data;
  }

  async createEvent(data: EventCreate): Promise<Event> {
    return (await axios.post<Event>("events/", data)).data;
  }

  async updateEvent(id: number, data: EventUpdate): Promise<Event> {
    const response = await axios.put<Event>(`events/${id}/`, data);
    return response.data;
  }

  async deleteEvent(id: number): Promise<void> {
    const response = await axios.delete(`events/${id}/`);
    return response.data;
  }
}

export default new EventsService();
