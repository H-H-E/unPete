import { getSession } from 'next-auth/react';

import { Session, User } from '@/types/auth';

export const getClientSession = async () => {
  const authjsSession = await getSession();

  if (authjsSession) {
    let user: User | undefined = undefined;
    if (authjsSession.user) {
      user = {
        email: authjsSession?.user?.email,
        name: authjsSession?.user?.name,
        image: authjsSession?.user?.image,
      };
    }

    const session: Session = {
      user: user,
      expires: authjsSession.expires,
      customAccessToken: authjsSession.customAccessToken,
    };

    return session;
  }

  return null;
};

export const getUser = async () => {
  const session = await getClientSession();

  let user = session?.user;

  if (!user) {
    user = {
      email: 'default_user',
      image: null,
      name: 'Default User',
    };
  }

  return user;
};

// helpers/msGraph.ts

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fetchImportantDates = async (customAccessToken: any ) => {
  const endpoint = "https://graph.microsoft.com/v1.0/me/events";
  
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${customAccessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    return data.value; // The events are in the 'value' property.
  } else {
    throw new Error('Failed to fetch events from Microsoft Calendar');
  }
}

