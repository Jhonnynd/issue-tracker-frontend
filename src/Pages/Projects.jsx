import React from "react";
import ProjectsList from "../Components/ProjectsList";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{}}>
      <Box>
        <Typography variant="h5" sx={{ mb: "20px" }}>
          My Projects
        </Typography>
        <Button
          onClick={() => navigate("/projectform")}
          variant="contained"
          sx={{ mb: "20px" }}
        >
          Create a new project
        </Button>
      </Box>
      <ProjectsList />
    </Box>
  );
};

export default Projects;
