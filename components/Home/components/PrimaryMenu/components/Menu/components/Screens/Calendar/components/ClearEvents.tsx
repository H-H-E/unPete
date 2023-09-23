import { FC, useContext } from 'react';
import CalendarContext from '../Calendar.context';
import { CalendarEvent } from '../Calendar.context'; 



const ClearEvents: FC = () => {
    const context = useContext(CalendarContext);

    if (!context) {
        throw new Error("ClearEvents must be used within a CalendarProvider");
    }
    
    const { events } = context;
    

  // Placeholder for now
  const clearAllEvents = () => {
    console.log("All events cleared");
  };

  return (
    <>
      {events.length > 0 && (
        <button onClick={clearAllEvents}>Clear All Events</button>
      )}
    </>
  );
};

export default ClearEvents;
