import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";

const AppWithAuth = () => {
  const { isLoading, getAccessTokenSilently } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // After authentication, get the token and store it in local storage
  getAccessTokenSilently().then((token) => {
    localStorage.setItem("Token", token);
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTHO_DOMAIN}
    clientId={process.env.REACT_APP_AUTHO_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <AppWithAuth />
  </Auth0Provider>
);
