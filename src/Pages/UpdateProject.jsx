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
import { useNavigate, useParams } from "react-router-dom";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";
import ImagePlaceHolder from "../img/image-placeholder.png";

const STORAGE_KEY = "images/";

const UpdateProject = () => {
  const { projectId } = useParams();

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [checked, setChecked] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [imagePreview, setImagePreview] = useState(ImagePlaceHolder);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    getProjectInfo();
    getAllUsers();
    getAllUsersFromAProject();
    console.log("users data", usersData);
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/list`
      );
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

  const getAllUsersFromAProject = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/projects/${projectId}`
      );
      setProjectUsers(response.data.map((item) => item.user));
      const initialCheckedUsers = response.data.map((item) => item.user.id);
      setChecked(initialCheckedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const getProjectInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/projects/project/${projectId}`
      );
      setProjectTitle(response.data.title);
      setProjectDescription(response.data.description);
      setImagePreview(response.data.projects_attachments[0].url);
      console.log("project", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadPicture = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFileName(e.target.value);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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

  const updateProject = async (e) => {
    e.preventDefault();
    let url;

    if (file) {
      const fullStorageRef = storageRef(storage, STORAGE_KEY + fileName);
      await uploadBytes(fullStorageRef, file);
      try {
        url = await getDownloadURL(fullStorageRef);
        setImageUrl(url);
      } catch (error) {
        console.log(error);
      }
    } else {
      url = imageUrl;
    }

    if (projectTitle === "" || projectDescription === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }

    try {
      const dataToSend = {
        title: projectTitle,
        description: projectDescription,
        submitter_id: 1,
        userIds: checked,
        url: url,
      };
      console.log(dataToSend);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/projects/${projectId}`,
        { ...dataToSend }
      );
      console.log("Updated project!", response);

      Swal.fire({
        icon: "success",
        title: "Your work has been updated",
        showConfirmButton: true,
        timer: 4000,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/");
        }
      });
    } catch (error) {
      console.log(error);
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
            label="Description"
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
                          primary={`${user.firstName} ${user.lastName} (${user.role})`}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>
          <Box>
            <label>
              <Button
                variant="contained"
                component="span"
                sx={{ width: "100%" }}
              >
                Upload new image
              </Button>
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => handleUploadPicture(e)}
              />
            </label>
            <Box sx={{ width: "400px", height: "400px" }}>
              <img
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                src={imagePreview}
                alt="preview"
              />
            </Box>
          </Box>
          <Button variant="contained" onClick={(e) => updateProject(e)}>
            Update Project
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default UpdateProject;
