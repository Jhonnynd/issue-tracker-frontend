import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../App";
import { Button, FormControl, Select } from "@mui/material";
import {
  MenuItem,
  Box,
  Avatar,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({
    email: "" || currentUser.email,
    first_name: "" || currentUser.first_name,
    last_name: "" || currentUser.last_name,
    userRoleId: currentUser.userRoleId,
  });
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    getAllUserRoles();
  }, []);

  const updateField = (e, field) => {
    setUserInfo({
      ...userInfo,
      [field]: e.target.value,
    });
  };

  const submit = async () => {
    try {
      const dataToSend = {
        email: userInfo.email,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        userRoleId: userInfo.userRoleId,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}/`,
        dataToSend
      );

      updateCurrentUser({
        ...currentUser,
        email: userInfo.email,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        userRoleId: userInfo.userRoleId,
      });

      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: true,
        timer: 4000,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllUserRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/userroles/`
      );
      if (currentUser.userRoleId !== 1 && currentUser.userRoleId !== 2) {
        const newUserRoles = response.data.filter(
          (role) => role.id !== 1 && role.id !== 2
        );
        setUserRoles(newUserRoles);
      } else {
        setUserRoles(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "800px",
          p: 5,
        }}
      >
        <Typography variant="h2">Update Profile</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            pt: "50px",
          }}
        >
          <TextField
            sx={{ width: "400px" }}
            id="email"
            label="Email"
            inputProps={{
              style: { backgroundColor: "white" },
            }}
            onChange={(e) => updateField(e, "email")}
            value={userInfo.email}
          />
          <TextField
            sx={{ width: "400px" }}
            id="first_name"
            label="First Name"
            inputProps={{
              style: { backgroundColor: "white" },
            }}
            onChange={(e) => updateField(e, "first_name")}
            value={userInfo.first_name}
          />
          <TextField
            sx={{ width: "400px" }}
            id="last_name"
            label="Last Name"
            inputProps={{
              style: { backgroundColor: "white" },
            }}
            onChange={(e) => updateField(e, "last_name")}
            value={userInfo.last_name}
          />

          <Box sx={{ width: "400px" }}>
            <Typography>Select role</Typography>
            <FormControl fullWidth sx={{ bgcolor: "white" }}>
              <Select
                value={userInfo.userRoleId}
                onChange={(e) => updateField(e, "userRoleId")}
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
          <Button
            sx={{ width: "200px" }}
            onClick={() => submit()}
            variant="contained"
          >
            Update
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
