import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await toast.promise(
        axiosInstance.post("/auth/reset-password", {
          token,
          password: form.password,
        }),
        {
          loading: "Resetting password...",
          success: "Password reset successfully 🎉",
          error: (err) =>
            err.response?.data?.message ||
            "Invalid or expired token",
        }
      );

      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-2">
          Reset Password
        </h2>
        <p className="text-gray-500 mb-6">
          Enter your new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
