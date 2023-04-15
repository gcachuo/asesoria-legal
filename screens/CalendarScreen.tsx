import React, { useEffect, useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { authorize } from "react-native-app-auth";
import { Calendar as CalendarAPI } from "react-native-big-calendar";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

const CalendarScreen = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const getCalendarEvents = async () => {
      const config = {
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        redirectUrl: "YOUR_REDIRECT_URI",
        scopes: SCOPES,
        serviceConfiguration: {
          authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
          tokenEndpoint: "https://oauth2.googleapis.com/token",
          revocationEndpoint: "https://oauth2.googleapis.com/revoke",
        },
      };

      const authResult = await authorize(config);

      // const { data } = await calendar.events.list({
      //   auth: authResult.accessToken,
      //   calendarId: "primary",
      //   timeMin: new Date().toISOString(),
      //   maxResults: 10,
      //   singleEvents: true,
      //   orderBy: "startTime",
      // });

      const events = ([] as any).map((event) => {
        const start = moment(event.start?.dateTime || event.start?.date);
        return {
          id: event.id,
          title: event.summary,
          description: event.description,
          startDate: start.toDate(),
          endDate: moment(event.end?.dateTime || event.end?.date).toDate(),
        };
      });

      setCalendarEvents(events);
    };

    getCalendarEvents();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CalendarAPI events={calendarEvents} height={100} />
    </View>
  );
};

export default CalendarScreen;
