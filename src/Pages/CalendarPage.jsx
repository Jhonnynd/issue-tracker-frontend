import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box } from "@mui/material";
const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    title: "Birthday Party",
    start: moment().toDate(), // today
    end: moment().add(1, "hours").toDate(), // +1 hour
  },
  {
    title: "Conference",
    start: moment().add(2, "days").toDate(), // +2 days
    end: moment().add(2, "days").add(1, "hours").toDate(), // +2 days +1 hour
  },
];

const CalendarPage = () => {
  return (
    <Box sx={{ p: 6 }}>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </Box>
  );
};

export default CalendarPage;

// const MyCalendar = (props) => (
//   <div>

//   </div>
// );
