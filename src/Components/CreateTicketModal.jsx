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
import { getAllProjects } from "../utils/ProjectFunctions";

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

export default function CreateTicketModal({ onClose, isOpen }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getAllProjects();
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleClose = () => {
    onClose();
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
                md: "row",
              },
            }}
          >
            <TextField
              id="title"
              label="title"
              InputProps={{
                style: { backgroundColor: "white" },
              }}
            />
            <TextField
              required
              id="description"
              label="description"
              InputProps={{
                style: { backgroundColor: "white" },
              }}
            />
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth sx={{ bgcolor: "white" }}>
                <InputLabel required id="demo-simple-select-label">
                  project
                </InputLabel>
                <Select
                  labelId="project"
                  id="project"
                  label="project"
                  onChange={(e) => this.handleChange(e, "type")}
                  InputProps={{
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
                  Assign ticket to
                </InputLabel>
                <Select
                  labelId="project"
                  id="project"
                  label="project"
                  onChange={(e) => setSelectedProject(e.target.value)}
                  InputProps={{
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
              id="Comments"
              label="Comments"
              multiline
              rows={4}
              InputProps={{
                style: { backgroundColor: "white" },
              }}
            />
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
