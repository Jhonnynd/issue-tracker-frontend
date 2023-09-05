import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchAndFormatTickets();
  }, []);

  const getAllTickets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const formatTickets = (tickets) => {
    const formattedData = tickets.map((ticket) => {
      return {
        id: ticket.id,
        title: ticket.title,
        start:
          ticket.createdAt === ticket.updatedAt
            ? moment(ticket.createdAt).toDate()
            : moment(ticket.updatedAt).toDate(),
        end:
          ticket.createdAt === ticket.updatedAt
            ? moment(ticket.createdAt).toDate()
            : moment(ticket.updatedAt).toDate(),
        backgroundColor: ticket.createdAt === ticket.updatedAt ? "blue" : "red",
      };
    });
    return formattedData;
  };

  const fetchAndFormatTickets = async () => {
    try {
      const allTickets = await getAllTickets();
      const newTickets = formatTickets(allTickets);
      setTickets(newTickets);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEventClick = (event) => {
    navigate(`/ticket/${event.id}`);
  };

  return (
    <Box sx={{ p: 6 }}>
      <Calendar
        localizer={localizer}
        events={tickets}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventClick}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.backgroundColor,
          },
        })}
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
