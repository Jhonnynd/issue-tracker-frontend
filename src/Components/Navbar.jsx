import React, { useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, loginWithRedirect } = useAuth0();

  const renderMenuItem = ({ icon: Icon, label, path, action }, i) => (
    <MenuItem
      key={i}
      sx={{
        display: "flex",
        gap: "20px",
      }}
      onClick={() => {
        if (action) {
          action();
        } else {
          navigate(path);
        }
      }}
    >
      <Icon />
      <Typography>{label}</Typography>
    </MenuItem>
  );

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const menuItems = [
    { icon: DashboardIcon, label: "Dashboard", path: "/" },
    { icon: FolderIcon, label: "Projects", path: "/projects" },
    { icon: InsertDriveFileIcon, label: "Tickets", path: "/tickets" },
    { icon: CalendarMonthIcon, label: "Calendar", path: "/calendar" },
    { icon: PeopleAltIcon, label: "Manage User Roles", path: "/userroles" },
    {
      icon: NotificationsIcon,
      label: "Notifications",
      path: "/notifications",
    },
    { icon: AccountCircleIcon, label: "My Profile", path: "/profile" },
    { icon: LogoutIcon, label: "logout", action: handleLogout },
  ];

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: "300px" }}>
      <List sx={{ width: "20%" }}>
        <Box sx={{ width: "300px", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex" }}>
            <ListItem>
              <BugReportIcon sx={{ fontSize: "90px" }} />
            </ListItem>
            <ListItem>
              <Typography>Welcome, Jhonny</Typography>
            </ListItem>
          </Box>
          <Box>
            <ListItem>
              <Typography>Signed in as: Administrator</Typography>
            </ListItem>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              py: "30px",
              backgroundColor: "primary.main",
            }}
          >
            {menuItems.map((item, i) => renderMenuItem(item, i))}
          </Box>
        </Box>
      </List>
    </Drawer>
  );
};

export default Navbar;
