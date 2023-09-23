import { useContext } from 'react';
import CalendarContext from './Calendar.context';
import { CalendarEvent } from './Calendar.context'; 
import { createContext, useState } from 'react';
import { CalendarEventModal } from './components/CalendarEventModal';

export const Calendar = () => {
  const context = useContext(CalendarContext);

  // Check if context is undefined. If it is, throw an error.
  if (!context) {
    throw new Error('Calendar must be used within a CalendarProvider');
  }

  // State for modal management
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<CalendarEvent | null>(null);

  // Renamed function
  const showEventInModal = (event: CalendarEvent) => {
    setModalEvent(event);
    setModalOpen(true);
  };

  return (
    <div>
      <h2>Calendar</h2>
      <ul>
        {context.events.map((event) => (
          <li key={event.id} onClick={() => showEventInModal(event)}>
            {event.title}
          </li>
        ))}
      </ul>

      {/* Conditionally render the modal */}
      {isModalOpen && modalEvent && (
        <CalendarEventModal
          event={modalEvent}
          onClose={() => setModalOpen(false)}
          onUpdateEvent={(updatedEvent) => {
            context.handleUpdateEvent(updatedEvent.id, updatedEvent);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
