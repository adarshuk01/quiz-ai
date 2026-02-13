import React, { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Textarea from "../common/Textarea";
import { useAuth } from "../../context/AuthContext";

function MyProfileForm() {
  const { user, updateProfile, loading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    bio: "",
  });

  const [message, setMessage] = useState("");

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await updateProfile(formData);

    if (res.success) {
      setMessage("Profile updated successfully");
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <p className="text-sm text-gray-500">
          Update your personal details and public profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Email (read-only) */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          disabled
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
        />

        {/* Bio */}
        <div>
          <Textarea
            label="Bio"
            name="bio"
            rows={5}
            value={formData.bio}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Update Button */}
        <div className="pt-4">
          <Button loading={loading} type="submit" disabled={loading}>
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MyProfileForm;
