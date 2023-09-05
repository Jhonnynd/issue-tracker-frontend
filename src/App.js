import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Projects from "./Pages/Projects";
import Tickets from "./Pages/Tickets";
import ProjectForm from "./Pages/ProjectForm";
import ManageUserRoles from "./Pages/ManageUserRoles";
import CreateTicket from "./Pages/CreateTicket";
import UpdateProject from "./Pages/UpdateProject";
import Ticket from "./Pages/Ticket";
import Project from "./Pages/Project";
import CalendarPage from "./Pages/CalendarPage";

function App() {
  return (
    <div className="appContainer">
      <Navbar />
      <div className="appContent">
        {/* <TopBar /> */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:projectId" element={<Project />} />
          <Route path="/updateproject/:projectId" element={<UpdateProject />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/ticket/:ticketId" element={<Ticket />} />
          <Route path="/createticket" element={<CreateTicket />} />
          <Route path="/projectform" element={<ProjectForm />} />
          <Route path="/userroles" element={<ManageUserRoles />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
