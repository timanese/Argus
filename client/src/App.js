import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useAuth } from "./contexts/UserContext";
import HomePage from "./pages/homePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import Places from "./components/Place";
import RequestMeetingPage from "./pages/RequestMeetingPage";

const LOGIN_ROUTE = "/login";

// Only continue to render components if the user is authenticated.
// Redirect users to login page if not logged in or a choice of a page.
function RequireAuth({ children }) {
  let auth = useAuth();
  if (!auth.user) {
    console.log("Not logged in, redirecting.");
    return <Navigate to={LOGIN_ROUTE} />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/places" element={<Places />} />
          <Route path="/requestMeeting" element={<RequestMeetingPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
