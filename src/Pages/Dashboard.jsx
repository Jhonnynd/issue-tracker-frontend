import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PieChartTicket from "../Components/PieChartTicket";
import ProjectsList from "../Components/ProjectsList";

import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Dashboard = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [ticketTypes, setTicketTypes] = useState({});
  const [ticketPriorities, setTicketPriorities] = useState({});
  const [ticketStatuses, setTicketStatuses] = useState({});

  useEffect(() => {
    getAllTickets();
  }, []);

  const getAllTickets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/list/`
      );
      const projects = response.data;

      const AllTicketTypes = {};
      const AllTicketStatuses = {};
      const AllticketPriorities = {};

      projects.forEach((project) => {
        project.tickets.forEach((ticket) => {
          const { description: typeDesc } = ticket.ticket_type;
          const { description: statusDesc } = ticket.ticket_status;
          const { description: priorityDesc } = ticket.ticket_priority;

          AllTicketTypes[typeDesc] = (AllTicketTypes[typeDesc] || 0) + 1;
          AllTicketStatuses[statusDesc] =
            (AllTicketStatuses[statusDesc] || 0) + 1;
          AllticketPriorities[priorityDesc] =
            (AllticketPriorities[priorityDesc] || 0) + 1;
        });
      });

      const newTicketTypes = formatData(AllTicketTypes);
      const newTicketStatuses = formatData(AllTicketStatuses);
      const newTicketPriorities = formatData(AllticketPriorities);

      console.log("the types are:", newTicketTypes);

      setTicketTypes(newTicketTypes);
      setTicketStatuses(newTicketStatuses);
      setTicketPriorities(newTicketPriorities);

      setAllTickets(projects);
    } catch (error) {
      console.error(error);
    }
  };

  const formatData = (obj) => {
    const formattedArray = Object.keys(obj).map((key) => {
      return { value: obj[key], name: key };
    });
    return formattedArray;
  };

  const navigate = useNavigate();
  return (
    <Box>
      <Box>
        <Box sx={{ pb: "20px" }}>
          <Typography sx={{ pb: "20px" }} variant="h4">
            Projects
          </Typography>
          <Typography
            variant="h9"
            sx={{ color: "primary.main", pb: "20px" }}
            onClick={() => navigate("/projects")}
          >
            Click here to see all projects.
          </Typography>
        </Box>
        <ProjectsList />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "center",
          gap: "30px",
          width: "100%",
          pt: "100px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4">Ticket Types</Typography>
          {ticketTypes.length > 0 && (
            <PieChartTicket ticketData={ticketTypes} />
          )}
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography variant="h4">Ticket Priorities</Typography>
          {ticketPriorities.length > 0 && (
            <PieChartTicket ticketData={ticketPriorities} />
          )}
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography variant="h4">Ticket Statuses</Typography>
          {ticketStatuses.length > 0 && (
            <PieChartTicket ticketData={ticketStatuses} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
