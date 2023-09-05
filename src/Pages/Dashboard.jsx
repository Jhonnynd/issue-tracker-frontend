import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PieChartTicket from "../Components/PieChartTicket";
import ProjectsList from "../Components/ProjectsList";

import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Dashboard = () => {
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
        <PieChartTicket />
        <PieChartTicket />
        <PieChartTicket />
      </Box>
    </Box>
  );
};

export default Dashboard;
