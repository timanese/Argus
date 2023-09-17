import React, { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
var bp = require("../Path.js");
const UserContext = createContext();

const USER_SESSION_STORAGE = "user";

export function useAuth() {
  return useContext(UserContext);
}

// Provides login, logout, and the User object.
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function logout() {
    const logoutPromise = new Promise(async (resolve, reject) => {
      try {
        console.log("Logout.");
        sessionStorage.removeItem(USER_SESSION_STORAGE);
        setUser();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    return logoutPromise;
  }

  async function login(email, password) {
    const loginPromise = new Promise(async (resolve, reject) => {
      // logout before logging back in.
      if (sessionStorage.getItem(USER_SESSION_STORAGE)) {
        try {
          await logout();
        } catch (error) {
          reject(error);
        }
      }

      try {
        const res = await axios.post(bp.buildPath("/api/users/login"), {
          email: email,
          password: password,
        });
        if (res && res.data && res.data.error) {
          reject(res.data.error);
          return;
        }
        console.log("Login.");
        const userObj = res.data.user;
        sessionStorage.setItem(USER_SESSION_STORAGE, JSON.stringify(userObj));
        console.log(userObj);
        setUser(userObj);
        resolve(userObj);
      } catch (error) {
        reject(error);
      }
    });
    return loginPromise;
  }

  async function checkIfLoggedIn() {
    let userobj = sessionStorage.getItem(USER_SESSION_STORAGE);
    if (!userobj) {
      sessionStorage.removeItem(USER_SESSION_STORAGE);
      setUser()
      console.log("Not logged in.");
      setLoading(false);
    } else {
      console.log("Still logged in.");
      console.log(JSON.parse(userobj))
      setUser(JSON.parse(userobj));
      setLoading(false);
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
    setUser,
  };
  return (
    <UserContext.Provider value={values}>
      {!loading && children}
    </UserContext.Provider>
  );
}
