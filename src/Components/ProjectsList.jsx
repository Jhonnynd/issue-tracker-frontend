import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { getAllProjects } from "../utils/ProjectFunctions";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ProjectsList = () => {
  const [open, setOpen] = useState(true);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    fetchProjects();
    console.log(location.pathname);
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getAllProjects();
      setProjects(fetchedProjects);
      console.log(location.pathname);
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
            setProjects((prevProjects) =>
              prevProjects.filter((project) => project.id !== id)
            );
          })
          .catch(function (error) {
            console.log(error);
            Swal.fire("Failed!", "The project could not be deleted.", "error");
          });
      }
    });
  };

  return (
    <Box>
      <TableContainer sx={{ width: "80%" }} component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              {location.pathname === "/projects" ? (
                <>
                  <StyledTableCell>Edit</StyledTableCell>
                  <StyledTableCell>Delete</StyledTableCell>{" "}
                </>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, i) => (
              <StyledTableRow
                // onClick={() => navigate("/")}
                key={project.title + i}
              >
                <StyledTableCell component="th" scope="row">
                  {project.title}
                </StyledTableCell>
                <StyledTableCell>{project.description}</StyledTableCell>
                <StyledTableCell>
                  {new Date(project.createdAt).toLocaleString()}
                </StyledTableCell>
                {location.pathname === "/projects" ? (
                  <>
                    <StyledTableCell>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => deleteProject(project.id)}>
                        <DeleteIcon sx={{ color: "red" }} />
                      </IconButton>
                    </StyledTableCell>{" "}
                  </>
                ) : null}{" "}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectsList;
