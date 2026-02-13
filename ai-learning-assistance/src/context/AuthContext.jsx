import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // LOAD USER
  // ============================
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // SIGNUP
  // ============================
  const signup = async (formData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/auth/signup", formData);
      const token = res.data.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      await loadUser();

      toast.success("Account created successfully");

      return { success: true, data: res.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed";

      toast.error(message);

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // LOGIN
  // ============================
const login = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    await loadUser();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
};



  // ============================
  // UPDATE PROFILE
  // ============================
  const updateProfile = async (formData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.put("/auth/profile", formData);
      setUser(res.data);

      toast.success("Profile updated");

      return { success: true, data: res.data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Profile update failed";

      toast.error(message);

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // CHANGE PASSWORD
  // ============================
  const changePassword = async (formData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.put(
        "/auth/change-password",
        formData
      );

      toast.success("Password updated");

      return { success: true, data: res.data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Password change failed";

      toast.error(message);

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
  };

  // Auto load user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        changePassword,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
