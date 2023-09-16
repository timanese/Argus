import React, { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
var bp = require("../Path.js");
const UserContext = createContext();

const ACCESS_TOKEN_SESSION_STORAGE = "access";

export function useAuth() {
  return useContext(UserContext);
}

// Provides login, logout, and the User object.
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function logout() {
    const logoutPromise = new Promise(async (resolve, reject) => {
      let accessToken = sessionStorage.getItem(ACCESS_TOKEN_SESSION_STORAGE);
      try {
        axios.post(bp.buildPath("/api/logout"), {
          accessToken: accessToken,
        });
        console.log("Logout.");
        sessionStorage.removeItem(ACCESS_TOKEN_SESSION_STORAGE);
        setUser();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    return logoutPromise;
  }

  async function login(username, password) {
    const loginPromise = new Promise(async (resolve, reject) => {
      // logout before logging back in.
      if (sessionStorage.getItem(ACCESS_TOKEN_SESSION_STORAGE) != null) {
        try {
          await logout();
        } catch (error) {
          reject(error);
        }
      }
      try {
        const res = await axios.post(bp.buildPath("/api/login"), {
          username: username.toLowerCase(),
          password: password,
        });
        if (res && res.data && res.data.error) {
          reject(res.data.error);
          return;
        }
        console.log("Login.");
        sessionStorage.setItem(ACCESS_TOKEN_SESSION_STORAGE, res.data.access);
        const userObj = res.data.user;
        setUser(userObj);
        resolve(userObj);
      } catch (error) {
        reject(error);
      }
    });
    return loginPromise;
  }

  async function checkIfLoggedIn() {
    let accessToken = sessionStorage.getItem(ACCESS_TOKEN_SESSION_STORAGE);
    if (accessToken === null) {
      setUser();
      sessionStorage.removeItem(ACCESS_TOKEN_SESSION_STORAGE);
      console.log("Not logged in.");
      setLoading(false);
    } else {
      console.log("Still logged in.");
    }
  }

  useEffect(() => {
    // Check the login status on every true refresh or session rejoin.
    checkIfLoggedIn();
  }, []);

  const values = {
    user,
    login,
    logout,
    setUser
  };
  return (
    <UserContext.Provider value={values}>
      {!loading && children}
    </UserContext.Provider>
  );
}
