import React, { useEffect, useState } from "react";
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
import { Box, Button, Chip } from "@mui/material";
import CreateTicketModal from "../Components/CreateTicketModal";

const Tickets = () => {
  const [openSections, setOpenSections] = useState([]);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

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
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <div>
      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: 800,
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
              <ListItemText primary={ticket.project.title} />
              {openSections[i] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSections[i]} timeout="auto" unmountOnExit>
              <List component="div" sx={{}} disablePadding>
                <ListItemButton
                  sx={{ pl: 4, display: "flex", alignItems: "center", gap: 3 }}
                >
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText primary={ticket.title} />
                  <Chip
                    label={ticket.ticket_status.description}
                    color="primary"
                  />
                  <Chip
                    label={ticket.ticket_priority.description}
                    color="primary"
                  />
                  <Chip
                    label={ticket.ticket_type.description}
                    color="primary"
                  />
                </ListItemButton>
              </List>
            </Collapse>
            <hr />
          </Box>
        ))}
      </List>
      <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
        Create a ticket
      </Button>
      {isCreateModalOpen && (
        <CreateTicketModal
          onClose={() => setCreateModalOpen(false)}
          isOpen={isCreateModalOpen}
        />
      )}
    </div>
  );
};

export default Tickets;
