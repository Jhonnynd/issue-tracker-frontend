import { SettingsBackupRestoreSharp } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ManageUserRoles = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userRoles, setUserRoles] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  useEffect(() => {
    getAllUsers();
    getAllUserRoles();
  }, []);

  const getAllUserRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/userroles/`
      );
      setUserRoles(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/list/`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (selectedUserRole === null || selectedUser === null) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }

    try {
      const data = {
        userRoleId: selectedUserRole,
      };
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/${selectedUser}`,
        data
      );
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: true,
        timer: 4000,
      });
      getAllUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth sx={{ bgcolor: "white" }}>
          <InputLabel required id="demo-simple-select-label">
            Select user
          </InputLabel>
          <Select
            labelId="project"
            id="project"
            label="project"
            onChange={(e) => setSelectedUser(e.target.value)}
            InputProps={{
              style: { backgroundColor: "white" },
            }}
          >
            {users.map((user, i) => {
              return (
                <MenuItem key={i} value={user.id}>
                  {`${user.first_name}  ${user.last_name} (${user.user_role.description}), ${user.email}`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Typography>Select new role for the user</Typography>
        <FormControl fullWidth sx={{ bgcolor: "white" }}>
          <InputLabel required id="demo-simple-select-label">
            Select Role
          </InputLabel>
          <Select
            labelId="project"
            id="project"
            label="project"
            onChange={(e) => setSelectedUserRole(e.target.value)}
            InputProps={{
              style: { backgroundColor: "white" },
            }}
          >
            {userRoles.map((rol, i) => {
              return (
                <MenuItem key={i} value={rol.id}>
                  {`${rol.description}`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Button variant="contained" onClick={(e) => submit(e)}>
        Submit
      </Button>
    </div>
  );
};

export default ManageUserRoles;
