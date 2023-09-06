import React, { useContext, useEffect, useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { showAdminRoleAlert } from "../utils/alerts";
import { UserContext } from "../App";

const Tickets = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [openSections, setOpenSections] = useState([]);

  const [tickets, setTickets] = useState([]);

  const handleClick = (index) => {
    const newOpenSections = [...openSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenSections(newOpenSections);
  };

  useEffect(() => {
    getAllTickets();
  }, []);

  const getAllTickets = async () => {
    const options = {
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/tickets/list`,
    };

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setTickets(response.data);
        setOpenSections(new Array(response.data.length).fill(false));
        console.log(openSections);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography sx={{ pb: 2 }} variant="h4">
        All Tickets
      </Typography>
      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          bgcolor: "background.paper",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {tickets.map((ticket, i) => (
          <Box key={i}>
            <ListItemButton onClick={() => handleClick(i)}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={ticket.title} />
              {openSections[i] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSections[i]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {ticket.tickets.map((nestedTicket, j) => (
                  <ListItemButton
                    key={j}
                    onClick={() => navigate(`/ticket/${nestedTicket.id}`)}
                    sx={{
                      pl: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ width: "65%", maxWidth: "65%" }}
                      primary={nestedTicket.title}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        alignItems: "flex-start",
                        width: "30%",
                      }}
                    >
                      <Chip
                        sx={{ width: "33%" }}
                        label={nestedTicket.ticket_status.description}
                        color={
                          nestedTicket.ticket_status.description === "New"
                            ? `warning`
                            : nestedTicket.ticket_status.description ===
                              "In Progress"
                            ? `primary`
                            : nestedTicket.ticket_status.description ===
                              "Additional Info Required"
                            ? `info`
                            : "success"
                        }
                      />
                      <Chip
                        sx={{ width: "33%" }}
                        label={nestedTicket.ticket_priority.description}
                        color={
                          nestedTicket.ticket_priority.description === "Low"
                            ? `primary`
                            : nestedTicket.ticket_priority.description ===
                              "Medium"
                            ? `warning`
                            : "error"
                        }
                      />
                      <Chip
                        sx={{ width: "33%" }}
                        label={nestedTicket.ticket_type.description}
                        color={
                          nestedTicket.ticket_type.description === "Bugs/Errors"
                            ? `warning`
                            : nestedTicket.ticket_type.description ===
                              "Feature Request"
                            ? `primary`
                            : "info"
                        }
                      />
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <hr />
          </Box>
        ))}
      </List>
      <Button
        onClick={() => {
          if (showAdminRoleAlert(currentUser.userRoleId)) {
            navigate("/createticket");
          }
        }}
        variant="contained"
      >
        Create a new Ticket
      </Button>
    </Box>
  );
};

export default Tickets;
