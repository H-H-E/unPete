import { FC, useState } from 'react';
import { CalendarEvent } from '../Calendar.context';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdateEvent: (event: CalendarEvent) => void;
}

export const CalendarEventModal: FC<EventModalProps> = ({ event, onClose, onUpdateEvent }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);

  return (
    <div className="modalBackground">
      <div className="modal">
        <h3>Edit Event</h3>
        
        <label>Title:</label>
        <input 
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label>Description:</label>
        <textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label>Date:</label>
        <input 
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={e => setDate(new Date(e.target.value))}
        />

        <button onClick={() => {
          onUpdateEvent({
            ...event,
            title,
            description,
            date
          });
        }}>
          Update Event
        </button>
        <button onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
