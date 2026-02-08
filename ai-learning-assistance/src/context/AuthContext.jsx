import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // SIGNUP
  const signup = async (formData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/auth/signup",
        formData
      );

      const token = res.data.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      setUser(res.data.user || null);

      return { success: true, data: res.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (formData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/auth/login",
        formData
      );

      const token = res.data.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      setUser(res.data.user || null);

      return { success: true, data: res.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);
