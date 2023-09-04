import { Route, Routes, useLocation } from "react-router-dom";
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
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0 from "./Pages/Auth0";

const AppWithAuth = () => {
  const { isLoading, getAccessTokenSilently } = useAuth0();
};

function App() {
  const {
    logout,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    user,
  } = useAuth0();

  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  });

  return (
    <>
      {isAuthenticated ? (
        <div className="appContainer">
          <div className="appContent">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:projectId" element={<Project />} />
              <Route
                path="/updateproject/:projectId"
                element={<UpdateProject />}
              />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/ticket/:ticketId" element={<Ticket />} />
              <Route path="/createticket" element={<CreateTicket />} />
              <Route path="/projectform" element={<ProjectForm />} />
              <Route path="/userroles" element={<ManageUserRoles />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Auth0 />} />
        </Routes>
      )}
    </>
  );
}

export default App;
