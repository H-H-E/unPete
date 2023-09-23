import { IconBulb, IconDeviceLaptop, IconMessages, IconCalendar } from '@tabler/icons-react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import ActivityBar from './components/ActivityBar/ActivityBar';
import Menu from './components/Menu/Menu';
import { Conversations } from './components/Menu/components/Screens/Conversations/Conversations';
import Prompts from './components/Menu/components/Screens/Prompts/Prompts';
import SystemPrompts from './components/Menu/components/Screens/SystemPrompts/SystemPrompts';

import PrimaryMenuContext from './PrimaryMenu.context';
import { PrimaryMenuInitialState, initialState } from './PrimaryMenu.state';


import { Calendar} from './components/Menu/components/Screens/Calendar/Calendar';
import { SessionProvider } from 'next-auth/react';
import { CalendarProvider } from './components/Menu/components/Screens/Calendar/Calendar.context';




export const PrimaryMenu = () => {
  const primaryMenuContextValue = useCreateReducer<PrimaryMenuInitialState>({
    initialState,
  });

  const icons = [
    <IconMessages size={28} key={0} />,
    <IconBulb size={28} key={1} />,
    <IconDeviceLaptop size={28} key={2} />,
    <IconCalendar size={28} key={3} />,
  ];

  const screens = [
    <Conversations key={0} />,
    <Prompts key={1} />,
    <SystemPrompts key={2} />,
    <CalendarProvider key={3}>
    <Calendar />
  </CalendarProvider>
    
  ];

  return (
    
    <SessionProvider>
      <PrimaryMenuContext.Provider value={primaryMenuContextValue}>
        <ActivityBar icons={icons}></ActivityBar>
        <Menu screens={screens}></Menu>
      </PrimaryMenuContext.Provider>
    </SessionProvider>
  );
};
