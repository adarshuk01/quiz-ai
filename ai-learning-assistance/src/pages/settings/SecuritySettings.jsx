import React, { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";


function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const sessions = [
    {
      device: 'MacBook Pro 16"',
      details: "San Francisco, CA • Chrome • Active now",
      current: true,
    },
    {
      device: "iPhone 14 Pro",
      details: "San Francisco, CA • iOS App • 2 hours ago",
      current: false,
    },
    {
      device: "Windows PC",
      details: "Austin, TX • Firefox • 3 days ago",
      current: false,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    console.log("Updated Password:", passwordData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ================= Change Password ================= */}
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
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </div>

      {/* ================= Two Factor ================= */}
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

      {/* ================= Active Sessions ================= */}
      {/* <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold">Active Sessions</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage devices where you're currently logged in.
        </p>

        <div className="space-y-4">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-4 last:border-none"
            >
              <div>
                <p className="font-medium">{session.device}</p>
                <p className="text-sm text-gray-500">{session.details}</p>
              </div>

              {session.current ? (
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                  Current Device
                </span>
              ) : (
                <Button text="Revoke" />
              )}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default SecuritySettings;
