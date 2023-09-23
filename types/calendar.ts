export interface CalendarEvent {
    id: string;
    name: string;
    description: string;
    date: Date;
    attendees: string[];
    type: 'inperson' | 'online';
  }
  