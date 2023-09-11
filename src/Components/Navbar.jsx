import React, { useContext, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
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

import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../App";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();
  const { logout } = useAuth0();

  const { currentUser } = useContext(UserContext);

  const renderMenuItem = ({ icon: Icon, label, path, action }, i) => (
    <MenuItem
      divider
      key={i}
      sx={{
        display: "flex",
        gap: "20px",
        p: 2,
        color: "#fff",
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
    // {
    //   icon: NotificationsIcon,
    //   label: "Notifications",
    //   path: "/notifications",
    // },
    { icon: AccountCircleIcon, label: "My Profile", path: "/profile" },
    { icon: LogoutIcon, label: "Logout", action: handleLogout },
  ];
  return (
    <Box sx={{ pt: 0 }} id="box1">
      <Drawer
        id="drawer"
        variant="permanent"
        anchor="left"
        sx={{
          backgroundColor: "black",
          width: "300px",
          pt: 0,
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <List sx={{ width: "20%", pt: 0 }}>
          <Box
            sx={{
              width: "300px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", p: 4 }}>
              <ListItem sx={{ p: 0, m: 0 }}>
                <BugReportIcon sx={{ fontSize: "90px" }} />
              </ListItem>
              {/* <ListItem>
                <NotificationsIcon sx={{ fontSize: "70px" }} />
              </ListItem> */}
              <ListItem sx={{ p: 0, m: 0 }}>
                <Typography variant="h6">issue-tracker</Typography>
              </ListItem>
            </Box>
            <Box>
              <Typography sx={{ p: 2 }}>
                Welcome, {currentUser?.first_name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                py: "30px",
              }}
            >
              {menuItems.map((item, i) => renderMenuItem(item, i))}
            </Box>
          </Box>
        </List>
      </Drawer>

      <AppBar
        position="static"
        sx={{
          display: {
            md: "none",
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      navigate(`${item.path}`);
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;
