
import {CalendarEvent}  from "@/types/calendar";

export interface CalendarState {
    events: CalendarEvent[];
    selectedEvent?: CalendarEvent;
  }
  
  export const initialState: CalendarState = {
    events: [],
  };
  