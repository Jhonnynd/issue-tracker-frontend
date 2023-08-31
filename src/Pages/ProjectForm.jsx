import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [checked, setChecked] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    getAllUsers();
    console.log("users data", usersData);
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/list");
      const allUsers = response.data;

      const allUsersWithRoles = allUsers.map((user) => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.user_role.description,
      }));

      setUsersData(allUsersWithRoles);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const createNewProject = async (e) => {
    e.preventDefault();
    if (projectTitle === "" || projectDescription === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }
    try {
      const options = {
        method: "POST",
        url: `${process.env.REACT_APP_BACKEND_URL}/projects`,
        data: {
          title: projectTitle,
          description: projectDescription,
          submitter_id: 1,
          userIds: checked,
        },
      };
      const response = await axios.request(options);
      console.log("created project!", response);

      setChecked([]);
      setProjectDescription("");
      setProjectTitle("");

      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: true,
        timer: 4000,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Something went wrong! ${error}`,
      });
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography>Create A New Project</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            pt: "50px",
          }}
        >
          <Typography>Project Title</Typography>
          <TextField
            sx={{ width: "400px" }}
            id="project-title"
            label="Project Title"
            variant="standard"
            onChange={(e) => setProjectTitle(e.target.value)}
            value={projectTitle}
          />
          <Typography>Project Description</Typography>
          <TextField
            sx={{ width: "400px" }}
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            onChange={(e) => setProjectDescription(e.target.value)}
            value={projectDescription}
          />

          <Box>
            <Box>
              <Typography>Project Members</Typography>
              <List
                dense
                sx={{
                  width: "100%",
                  maxWidth: 500,

                  bgcolor: "background.paper",
                  maxHeight: "400px",
                  overflow: "auto",
                }}
              >
                {usersData.map((user) => {
                  const labelId = `checkbox-list-secondary-label-${user.id}`;
                  return (
                    <ListItem
                      key={user.id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(user.id)}
                          checked={checked.indexOf(user.id) !== -1}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      }
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            alt={`Avatar n°${user.id + 1}`}
                            src={`/static/images/avatar/${user.id + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          id={labelId}
                          primary={`${user.firstName} ${user.lastName}  (${user.role})`}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>
          <Button variant="contained" onClick={(e) => createNewProject(e)}>
            Create Project
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ProjectForm;
