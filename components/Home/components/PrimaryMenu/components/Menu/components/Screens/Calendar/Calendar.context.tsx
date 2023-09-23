import { Dispatch, createContext, useState } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  rsvp?: boolean;
}



export interface CalendarContextProps {
  events: CalendarEvent[];
  selectedEvent?: CalendarEvent;
  handleAddEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (eventId: string) => void;
  handleUpdateEvent: (eventId: string, updatedEvent: CalendarEvent) => void;
}
interface CalendarProviderProps {
  children: React.ReactNode;
}

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents(prevEvents => [...prevEvents, event]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const handleUpdateEvent = (eventId: string, updatedEvent: CalendarEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? updatedEvent : event
      )
    );
  };

  return (
    <CalendarContext.Provider value={{ events, selectedEvent, handleAddEvent, handleDeleteEvent, handleUpdateEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;

