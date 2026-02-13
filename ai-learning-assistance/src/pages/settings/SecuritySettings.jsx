import React, { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

function SecuritySettings() {
  const { changePassword, loading } = useAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const res = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    if (res.success) {
      setMessage("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ensure your account is using a long, random password to stay secure.
        </p>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
          />

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
          />


          <div className="pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Two Factor */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add an extra layer of security to your account by requiring a code
            from your phone in addition to your password.
          </p>
        </div>

        <Button>Enable 2FA</Button>
      </div>
    </div>
  );
}

export default SecuritySettings;
