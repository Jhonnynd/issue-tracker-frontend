import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PieChartTicket from "../Components/PieChartTicket";
import ProjectsList from "../Components/ProjectsList";

import { useNavigate } from "react-router-dom";
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
          <Typography sx={{ pb: "20px" }} variant="h5">
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
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          pt: "100px",
        }}
      >
        {ticketTypes.length > 0 && <PieChartTicket ticketData={ticketTypes} />}
        {ticketPriorities.length > 0 && (
          <PieChartTicket ticketData={ticketPriorities} />
        )}
        {ticketStatuses.length > 0 && (
          <PieChartTicket ticketData={ticketStatuses} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
