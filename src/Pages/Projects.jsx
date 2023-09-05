import React, { useContext } from "react";
import ProjectsList from "../Components/ProjectsList";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { showAdminRoleAlert } from "../utils/alerts";

const Projects = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <Box sx={{}}>
      <Box>
        <Typography variant="h5" sx={{ mb: "20px" }}>
          All Projects
        </Typography>
        <Button
          onClick={() => {
            if (showAdminRoleAlert(currentUser.userRoleId)) {
              navigate("/projectform");
            }
          }}
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
