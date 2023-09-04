import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import React, { useEffect } from "react";
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
import Swal from "sweetalert2";
import ImagePlaceHolder from "../img/image-placeholder.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const STORAGE_KEY = "images/";

export default function CreateTicketModal({ onClose, isOpen }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [users, setUsers] = useState([]);

  const [priorities, setPriorities] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [selectedPriority, setSelectedPriority] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [imagePreview, setImagePreview] = useState(ImagePlaceHolder);

  useEffect(() => {
    fetchProjects();
    getAllTicketTypes();

    console.log("priorities and types", priorities, types);
  }, []);

  const getAllTicketTypes = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/tickets/types`
    );
    console.log(response.data);
    setStatuses(response.data.ticket_statuses);
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
  const handleClose = () => {
    onClose();
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

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "80%",
              md: "800px",
            },
            bgcolor: "primary.main",
            border: "2px solid #000",
            boxShadow: 24,
            p: 8,
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
              id="title"
              label="title"
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
              id="description"
              label="description"
              sx={{ backgroundColor: "#fff" }}
              multiline
              rows={4}
              inputProps={{
                style: { backgroundColor: "#fff" },
              }}
            />
            <Box>
              <label>
                <Button
                  variant="contained"
                  component="span"
                  sx={{ width: 280 }}
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
              <Box sx={{ width: "20px" }}>
                <img
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={imagePreview}
                />
              </Box>
            </Box>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
