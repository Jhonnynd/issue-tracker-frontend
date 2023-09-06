import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";
import { getAllProjects } from "../utils/ProjectFunctions";
import axios from "axios";
import ImagePlaceHolder from "../img/image-placeholder.png";
import Swal from "sweetalert2";
import { UserContext } from "../App";
import { showAdminRoleAlert } from "../utils/alerts";
import { useNavigate } from "react-router";

const STORAGE_KEY = "images/";

export default function CreateTicket() {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priorities, setPriorities] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedPriority, setSelectedPriority] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [imagePreview, setImagePreview] = useState(ImagePlaceHolder);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchProjects();
    getAllTicketTypes();

    console.log("priorities and types", priorities, types);
  }, []);

  useEffect(() => {
    if (!showAdminRoleAlert(currentUser.userRoleId)) {
      navigate("/");
    }
  }, []);

  const getAllTicketTypes = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/tickets/types`
    );
    console.log(response.data);
    setTypes(response.data.ticket_types);
    setPriorities(response.data.ticket_priorities);
  };

  const fetchProjects = async () => {
    try {
      const projectData = await getAllProjects();
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getAllUsersFromAProject = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/projects/${id}`
      );
      const allUserInfo = response.data.map((project) => project.user);

      if (allUserInfo.length > 0) {
        setUsers(allUserInfo);
      }
      console.log("users", allUserInfo);
    } catch (error) {}
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

  const submit = async () => {
    let url;
    console.log(storage, STORAGE_KEY + fileName, file);
    const fullStorageRef = storageRef(storage, STORAGE_KEY + fileName);
    await uploadBytes(fullStorageRef, file);
    try {
      url = await getDownloadURL(fullStorageRef);
      console.log(url);
    } catch (error) {
      console.log(error);
    }
    try {
      console.log(url);
      const dataToSend = {
        title: title,
        description: description,
        projectId: selectedProject,
        submitterId: currentUser.id, // user that Created the Ticket
        assignedUserId: selectedUser,
        ticketStatusId: 1, //  1 is New
        ticketPriorityId: selectedPriority,
        ticketTypeId: selectedType,
        url: url,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/`,
        {
          ...dataToSend,
        }
      );
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: true,
        timer: 4000,
      });

      setFile(null);
      setFileName(null);
      setSelectedProject("");
      setSelectedType("");
      setSelectedPriority("");
      setSelectedUser(null);
      setImagePreview(ImagePlaceHolder);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          width: {
            xs: "80%",
            md: "800px",
          },
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            flexDirection: {
              xs: "column",
            },
          }}
        >
          <TextField
            id="Title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{
              style: { backgroundColor: "white" },
            }}
          />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ bgcolor: "white" }}>
              <InputLabel required id="demo-simple-select-label">
                Project
              </InputLabel>
              <Select
                labelId="project"
                id="project"
                label="project"
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  getAllUsersFromAProject(e.target.value);
                }}
                inputProps={{
                  style: { backgroundColor: "white" },
                }}
              >
                {projects.map((project, i) => {
                  return (
                    <MenuItem key={i} value={project.id}>
                      {project.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ bgcolor: "white" }}>
              <InputLabel required id="demo-simple-select-label">
                Type
              </InputLabel>
              <Select
                labelId="Type"
                id="Type"
                label="Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                inputProps={{
                  style: { backgroundColor: "white" },
                }}
              >
                {types.map((type, i) => {
                  return (
                    <MenuItem key={i} value={type.id}>
                      {type.description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ bgcolor: "white" }}>
              <InputLabel required id="demo-simple-select-label">
                Priority
              </InputLabel>
              <Select
                labelId="Priority"
                id="Priority"
                label="Priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                inputProps={{
                  style: { backgroundColor: "white" },
                }}
              >
                {priorities.map((priority, i) => {
                  return (
                    <MenuItem key={i} value={priority.id}>
                      {priority.description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ bgcolor: "white" }}>
              <InputLabel required id="demo-simple-select-label">
                {users.length > 0
                  ? `Assign ticket to`
                  : `No users found for this project`}
              </InputLabel>
              <Select
                disabled={!selectedProject || users.length === 0}
                labelId="project"
                id="project"
                label="project"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                inputProps={{
                  style: { backgroundColor: "white" },
                }}
              >
                {users &&
                  users.map((user, i) => {
                    return (
                      <MenuItem key={i} value={user.id}>
                        {`${user.first_name} ${user.last_name} (${user.user_role.description})`}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "30px 0 20px 0",
            gap: "20px",
          }}
        >
          <TextField
            id="Description"
            label="Description"
            sx={{ backgroundColor: "#fff" }}
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{
              style: { backgroundColor: "#fff" },
            }}
          />
          <Box>
            <label>
              <Button
                variant="contained"
                component="span"
                sx={{ width: "100%" }}
              >
                Upload image
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
          <Button onClick={() => submit()} variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </div>
  );
}
