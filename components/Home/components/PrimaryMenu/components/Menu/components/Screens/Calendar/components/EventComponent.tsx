import { FC, useContext } from 'react';
import { CalendarEvent } from '../Calendar.context'; 
import CalendarContext from '../Calendar.context';

interface Props {
  event: CalendarEvent;
}


const EventComponent: FC<Props> = ({ event }) => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error('EventComponent must be used within a CalendarProvider');
  }

  const { handleDeleteEvent } = context;

  return (
    <div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
    </div>
  );
};

export default EventComponent;
