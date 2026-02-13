import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      await toast.promise(
        axiosInstance.post("/auth/forgot-password", { email }),
        {
          loading: "Sending reset link...",
          success: "Reset link sent to your email 📩",
          error: (err) =>
            err.response?.data?.message || "Something went wrong",
        }
      );

      setEmail("");
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
          Forgot Password
        </h2>
        <p className="text-gray-500 mb-6">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            Send Reset Link
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Back to{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
