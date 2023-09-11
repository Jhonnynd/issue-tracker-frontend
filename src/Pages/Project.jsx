import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultImage from "../img/image-placeholder.png";
import Swal from "sweetalert2";
import { showAdminRoleAlert } from "../utils/alerts";
import { UserContext } from "../App";
import { Rowing } from "@mui/icons-material";
const Project = () => {
  const { currentUser } = useContext(UserContext);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState([]);
  const [usersFromProject, setUsersFromProject] = useState([]);
  const [ticketsFromProject, setTicketsFromProject] = useState([]);
  const [projectImage, setProjectImage] = useState(null);

  useEffect(() => {
    getProjectInfo();
    getUsersFromAProject();
    getTicketsFromAProject();
  }, []);

  const getProjectInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/projects/project/${projectId}`
      );
      setProject(response.data);
      setProjectImage(response.data.projects_attachments[0].url);
      console.log("project", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUsersFromAProject = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/projects/${projectId}`
      );
      setUsersFromProject(response.data);
      console.log("users from project", usersFromProject);
    } catch (error) {
      console.error(error);
    }
  };

  const getTicketsFromAProject = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/project/${projectId}/tickets`
      );
      setTicketsFromProject(response.data);
      console.log("TicketsFromProject", ticketsFromProject);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProject = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const options = {
          method: "DELETE",
          url: `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        };
        axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
            Swal.fire("Deleted!", "The project has been deleted.", "success");
            navigate("/projects");
          })
          .catch(function (error) {
            console.log(error);
            Swal.fire("Failed!", "The project could not be deleted.", "error");
          });
      }
    });
  };

  return (
    <div>
      <Box>
        <Paper sx={{ p: 3 }}>
          <Box>
            <Typography variant="h5">Project Name: {project.title}</Typography>
            {projectImage ? (
              <Box sx={{ p: 2, width: "150px", height: "150px" }}>
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="project img"
                  src={projectImage}
                ></img>
              </Box>
            ) : null}
          </Box>
          <Box sx={{ pt: 1, pb: 3 }}>
            <Button
              onClick={() => {
                if (showAdminRoleAlert(currentUser.userRoleId)) {
                  navigate(`/updateproject/${project.id}`);
                }
              }}
              variant="contained"
            >
              Edit project
            </Button>

            <Button
              sx={{ ml: 2 }}
              onClick={() => {
                if (showAdminRoleAlert(currentUser.userRoleId)) {
                  deleteProject(project.id);
                }
              }}
              variant="contained"
              color="error"
            >
              Delete project
            </Button>
          </Box>
          <Typography>Description:</Typography>
          <Typography sx={{ pt: 2 }}>{project.description}</Typography>
        </Paper>

        <Box
          sx={{
            display: "flex",
            pt: "30px",
            gap: 3,
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Paper
            className="team-members"
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
              p: 3,
            }}
          >
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              Team Members
            </Typography>
            <List sx={{ overflow: "auto", height: "400px" }}>
              {usersFromProject.map((user) => {
                return (
                  <ListItem key={user.id}>
                    <ListItemText
                      primary={
                        user.user.user_role
                          ? `${user.user.first_name} ${user.user.last_name} (${user.user.user_role.description})`
                          : null
                      }
                      secondary={user.email}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
          <Paper
            className="tickets"
            sx={{
              width: {
                xs: "100%",
                lg: "50%",
              },
              p: 3,
            }}
          >
            <List sx={{ overflow: "auto", height: "400px" }}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Tickets for this project
              </Typography>
              <Button
                onClick={() => {
                  if (showAdminRoleAlert(currentUser.userRoleId)) {
                    navigate("/createticket");
                  }
                }}
                variant="contained"
              >
                Create a new Ticket
              </Button>
              <List component="div" disablePadding>
                {ticketsFromProject.map((ticket, j) => (
                  <ListItemButton
                    key={j}
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                    sx={{
                      pl: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <ListItemText
                      sx={{ width: "40%", maxWidth: "65%" }}
                      primary={ticket.title}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        alignItems: "flex-start",
                        width: "60%",
                      }}
                    >
                      <Chip
                        sx={{ width: "33%" }}
                        label={ticket.ticket_status.description}
                        color={
                          ticket.ticket_status.description === "New"
                            ? `warning`
                            : ticket.ticket_status.description === "In Progress"
                            ? `primary`
                            : ticket.ticket_status.description ===
                              "Additional Info Required"
                            ? `info`
                            : "success"
                        }
                      />
                      <Chip
                        sx={{ width: "33%" }}
                        label={ticket.ticket_priority.description}
                        color={
                          ticket.ticket_priority.description === "Low"
                            ? `primary`
                            : ticket.ticket_priority.description === "Medium"
                            ? `warning`
                            : "error"
                        }
                      />
                      <Chip
                        sx={{ width: "33%" }}
                        label={ticket.ticket_type.description}
                        color={
                          ticket.ticket_type.description === "Bugs/Errors"
                            ? `warning`
                            : ticket.ticket_type.description ===
                              "Feature Request"
                            ? `primary`
                            : "info"
                        }
                      />
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            </List>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};

export default Project;
