import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useAuth } from "./contexts/UserContext";
import HomePage from "./pages/homePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import BuddyPage from "./pages/BuddyPage";
import RequestMeetingPage from "./pages/RequestMeetingPage";
import AcceptMeetingPage from "./pages/AcceptMeetingPage";
import AudioLocationPage from "./pages/AudioLocationPage";

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
          <Route path="/buddy/:id" element={<BuddyPage />} />
          <Route path="/requestMeeting" element={<RequestMeetingPage />} />
          <Route path="/acceptMeeting/:id" element={<AcceptMeetingPage />} />
          <Route path="/meeting/:id" element={<AudioLocationPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
