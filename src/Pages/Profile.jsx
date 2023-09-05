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

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
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
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/userroles/`
      );
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
          width: "400px",
          p: 5,
        }}
      >
        <Typography>Update Profile</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            pt: "50px",
          }}
        >
          <Typography>Email</Typography>
          <TextField
            sx={{ width: "400px" }}
            id="email"
            label="Email"
            variant="standard"
            onChange={(e) => updateField(e, "email")}
            value={userInfo.email}
          />
          <Typography>First Name</Typography>
          <TextField
            sx={{ width: "400px" }}
            id="first_name"
            label="First Name"
            variant="standard"
            onChange={(e) => updateField(e, "first_name")}
            value={userInfo.first_name}
          />
          <Typography>Last Name</Typography>
          <TextField
            sx={{ width: "400px" }}
            id="last_name"
            label="Last Name"
            variant="standard"
            onChange={(e) => updateField(e, "last_name")}
            value={userInfo.last_name}
          />

          <Box>
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
          <Button variant="contained">Update</Button>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
