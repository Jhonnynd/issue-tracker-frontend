import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  autocompleteClasses,
} from "@mui/material";
import axios from "axios";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ImagePlaceHolder from "../img/image-placeholder.png";
import { UserContext } from "../App";
import { showAdminRoleAlert } from "../utils/alerts";

const STORAGE_KEY = "images/";

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

const Ticket = () => {
  const { currentUser } = useContext(UserContext);
  const [ticket, setTicket] = useState({});
  const { ticketId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [comments, setComments] = useState([]);

  const [priorities, setPriorities] = useState([]);

  const [selectedType, setSelectedType] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState();

  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(1);

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openEditTicketModal, setOpenEditTicketModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const [comment, setComment] = useState("");
  const [review, setReview] = useState("");

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [imagePreview, setImagePreview] = useState(ImagePlaceHolder);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  const handleOpenStatusModal = () => setOpenStatusModal(true);
  const handleCloseStatusModal = () => setOpenStatusModal(false);

  const handleOpenEditTicketModal = () => setOpenEditTicketModal(true);
  const handleCloseEditTicketModal = () => setOpenEditTicketModal(false);

  const handleOpenReviewModal = () => setOpenReviewModal(true);
  const handleCloseReviewModal = () => setOpenReviewModal(false);

  useEffect(() => {
    getTicketInfo();
    getTicketTypes();
    getAllComments();
  }, []);

  const getTicketInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/ticket/${ticketId}`
      );
      setTicket(response.data);

      setTitle(response.data.title || "");
      setDescription(response.data.description || "");
      setSelectedPriority(response.data.ticketPriorityId || "");
      setSelectedStatus(response.data.ticketStatusId || "");
      setSelectedType(response.data.ticketTypeId || "");
    } catch (error) {
      console.error(error);
    }
  };

  console.log(ticket);

  const getTicketTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/types`
      );
      setStatuses(response.data.ticket_statuses);
      setTypes(response.data.ticket_types);
      setPriorities(response.data.ticket_priorities);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/${ticketId}/status`,
        { ticketStatusId: selectedStatus }
      );
      handleCloseStatusModal();
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: true,
        timer: 4000,
      });
      getTicketInfo();
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  const updateTicket = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/${ticketId}`,
        {
          title: title,
          description: description,
          ticketPriorityId: selectedPriority,
          ticketTypeId: selectedType,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: true,
        timer: 4000,
      });
      getTicketInfo();
      handleCloseEditTicketModal();
    } catch (error) {
      console.log(error);
      console.error("Error updating the ticket:", error);
    }
  };

  const submitComment = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/${ticketId}/comments`,
        {
          ticketId: ticketId,
          userId: 1,
          description: comment,
        }
      );
      handleCloseStatusModal();
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: true,
        timer: 4000,
      });
      getTicketInfo();
      getAllComments();
      setComment("");
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  const getAllComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/${ticketId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
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

  const submitReview = async () => {
    if (review === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }
    let imageUrl;

    if (file) {
      const fullStorageRef = storageRef(storage, STORAGE_KEY + fileName);
      await uploadBytes(fullStorageRef, file);
      try {
        imageUrl = await getDownloadURL(fullStorageRef);
      } catch (error) {
        console.log(error);
      }
    } else {
      imageUrl = null;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/${ticketId}/review`,
        {
          ticketId: ticketId,
          description: review,
          url: imageUrl,
        }
      );
      handleCloseReviewModal();
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: true,
        timer: 4000,
      });
      getTicketInfo();
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  return (
    <div>
      <Modal
        sx={{ p: 5 }}
        open={openStatusModal}
        onClose={handleCloseStatusModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ p: 3 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Update current status of ticket
          </Typography>
          <FormControl fullWidth sx={{ py: "30px", bgcolor: "white" }}>
            <InputLabel required id="demo-simple-select-label">
              Select Status
            </InputLabel>

            <Select
              labelId="status"
              id="status"
              label="status"
              onChange={(e) => setSelectedStatus(e.target.value)}
              inputProps={{
                style: { backgroundColor: "white" },
              }}
            >
              {statuses.map((status, i) => {
                return (
                  <MenuItem key={i} value={status.id}>
                    {`${status.description}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => updateStatus()}>
            Update Ticket Status
          </Button>
          <Button onClick={() => handleCloseStatusModal()}>Close</Button>
        </Box>
      </Modal>

      {/* Edit Ticket Modal */}
      <Modal
        sx={{ p: 5 }}
        open={openEditTicketModal}
        onClose={handleCloseStatusModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ p: 3 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Update this ticket.
          </Typography>
          <FormControl
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "column",
              py: "30px",
              gap: "20px",
              bgcolor: "white",
            }}
          >
            <TextField
              id="Title"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputProps={{
                style: { backgroundColor: "white" },
              }}
            />
            <FormControl fullWidth sx={{ bgcolor: "white" }}>
              <InputLabel required id="demo-simple-select-label">
                Type
              </InputLabel>
              <Select
                labelId="Type"
                id="Type"
                label="Type"
                value={selectedType}
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
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth sx={{ bgcolor: "white" }}>
                <InputLabel required id="demo-simple-select-label">
                  Priority
                </InputLabel>
                <Select
                  labelId="Priority"
                  id="Priority"
                  label="Priority"
                  value={selectedPriority}
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
            <TextField
              id="Description"
              label="Description"
              sx={{ backgroundColor: "#fff" }}
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              inputProps={{
                style: { backgroundColor: "#fff" },
              }}
            />
          </FormControl>
          <Button variant="contained" onClick={() => updateTicket()}>
            Update ticket
          </Button>
          <Button onClick={() => handleCloseEditTicketModal()}>Close</Button>
        </Box>
      </Modal>

      {/* Review Ticket Modal */}

      <Modal
        sx={{ p: 5 }}
        open={openReviewModal}
        onClose={handleCloseReviewModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ p: 3 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Review ticket
          </Typography>
          <TextField
            id="review"
            label="review"
            sx={{ width: "100%", pb: 2, backgroundColor: "#fff" }}
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            inputProps={{
              style: { backgroundColor: "#fff" },
            }}
          />
          <Box>
            <label>
              <Button
                variant="contained"
                component="span"
                sx={{ width: "100%" }}
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
            <Box sx={{ width: "200px", height: "200px" }}>
              <img
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                src={imagePreview}
                alt="preview"
              />
            </Box>
          </Box>

          <Button
            sx={{ width: "100%" }}
            variant="contained"
            onClick={() => submitReview()}
          >
            Review and close Ticket
          </Button>
        </Box>
      </Modal>

      <Box
        sx={{
          height: "100%",
          display: "flex",
        }}
      >
        <Paper sx={{ p: 2, width: "50%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pb: "20px",
            }}
          >
            <Typography variant="h6">Details</Typography>
            {ticket.ticketStatusId !== 3 ? (
              <Box>
                <Button
                  onClick={() => {
                    if (showAdminRoleAlert(currentUser.userRoleId)) {
                      handleOpenEditTicketModal();
                    }
                  }}
                  variant="contained"
                  sx={{ mr: 2 }}
                >
                  Edit ticket information
                </Button>

                <Button
                  onClick={handleOpenStatusModal}
                  variant="contained"
                  sx={{ mr: 2 }}
                >
                  Update Status
                </Button>
                <Button onClick={handleOpenReviewModal} variant="contained">
                  Upload Review
                </Button>
              </Box>
            ) : null}
          </Box>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Ticket Title</Typography>
              <Typography>Ticket Description</Typography>
            </Box>
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
            >
              <Typography>{ticket.title}</Typography>
              <Typography>{ticket.description}</Typography>
            </Box>
          </Box>
          <hr />
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Assigned to:</Typography>
              <Typography>Submitter:</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ width: "50%" }}>
                {ticket.assigned_user &&
                  `${ticket.assigned_user.first_name} ${ticket.assigned_user.last_name} (${ticket.assigned_user.user_role.description}) ${ticket.assigned_user.email}`}
              </Typography>
              <Typography sx={{ width: "30%" }}>
                {ticket.submitter &&
                  `${ticket.submitter.first_name} ${ticket.submitter.last_name} (${ticket.submitter.user_role.description}) ${ticket.submitter.email}  `}
              </Typography>
            </Box>
          </Box>
          <hr />
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Project</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>
                {ticket.project && `${ticket.project.title}`}
              </Typography>
            </Box>
          </Box>
          <hr />
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Priority</Typography>
              <Typography>Type</Typography>
              <Typography>Status</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {ticket.ticket_priority && (
                <Chip
                  sx={{}}
                  label={ticket.ticket_priority.description}
                  color={
                    ticket.ticket_priority.description === "Low"
                      ? `primary`
                      : ticket.ticket_priority.description === "Medium"
                      ? `warning`
                      : "error"
                  }
                />
              )}
              {ticket.ticket_type && (
                <Chip
                  sx={{}}
                  label={ticket.ticket_type.description}
                  color={
                    ticket.ticket_type.description === "Bugs/Errors"
                      ? `warning`
                      : ticket.ticket_type.description === "Feature Request"
                      ? `primary`
                      : "info"
                  }
                />
              )}
              {ticket.ticket_status && (
                <Chip
                  sx={{}}
                  label={ticket.ticket_status.description}
                  color={
                    ticket.ticket_status.description === "New"
                      ? `warning`
                      : ticket.ticket_status.description === "In Progress"
                      ? `primary`
                      : ticket.ticket_status.description ===
                        "Additional Info Required"
                      ? `info`
                      : "success"
                  }
                />
              )}
            </Box>
          </Box>
          <hr />
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Created at:</Typography>
              <Typography>Updated at:</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>
                {ticket.createdAt &&
                  new Date(ticket.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                {ticket.updatedAt &&
                  new Date(ticket.updatedAt).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ py: "30px" }}>
              <Typography>Attachments:</Typography>
              {ticket.ticket_attachments &&
              ticket.ticket_attachments.length > 0 &&
              ticket.ticket_attachments[0].url !== null ? (
                <Box>
                  <img
                    alt="attachment img"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    src={ticket.ticket_attachments[0].url}
                  ></img>
                </Box>
              ) : (
                `There are no attachments for this ticket.`
              )}
            </Box>
          </Box>
        </Paper>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <Box>
            <Typography>Comments:</Typography>
          </Box>
          <Box sx={{ display: "flex", width: "85%" }}>
            <TextField
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              label="Comment"
              id="fullWidth"
            />
            <Button
              onClick={() => submitComment()}
              sx={{ p: 2 }}
              variant="contained"
            >
              Submit
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "85%",
              height: "300px",
              overflow: "auto",
            }}
          >
            {Array.isArray(comments) ? (
              comments.map((comment) => {
                return (
                  <>
                    <ListItem
                      sx={{ display: "flex", flexDirection: "column" }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        primary={`${comment.user.first_name} ${comment.user.last_name} (${comment.user.user_role.description}) ${comment.user.email} `}
                        secondary={comment.description}
                      />
                    </ListItem>
                    <Divider />
                  </>
                );
              })
            ) : (
              <div>No comments available</div>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Paper sx={{ width: "50%", p: 5 }}>
          <Box>
            <Typography sx={{ pb: 4 }} variant="h5">
              Ticket Reviews
            </Typography>
            {ticket?.ticket_reviews?.[0] ? (
              <Box>
                <Typography>{ticket.ticket_reviews[0].description}</Typography>
                {ticket.ticket_reviews[0]?.ticket_review_attachments?.[0] ? (
                  <Box sx={{ width: "300px" }}>
                    <img
                      alt="ticket review attachment"
                      src={
                        ticket.ticket_reviews[0].ticket_review_attachments[0]
                          .url
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    ></img>
                  </Box>
                ) : null}
              </Box>
            ) : (
              <>
                <Typography>
                  There are no reviews for this ticket yet.
                </Typography>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Ticket;
