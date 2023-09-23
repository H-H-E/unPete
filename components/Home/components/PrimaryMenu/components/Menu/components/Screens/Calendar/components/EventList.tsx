import { FC } from 'react';
import EventComponent from './EventComponent';
import { CalendarEvent } from '../Calendar.context'; 

interface Props {
  events: CalendarEvent[];
}

const EventList: FC<Props> = ({ events }) => {
  return (
    <div>
      {events.map(event => (
        <EventComponent key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
