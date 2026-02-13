import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Textarea from "../common/Textarea";

function MyProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Miller",
    email: "sarah.miller@university.edu",
    phone: "+1 (555) 123-4567",
    bio: "Computer Science major with a passion for AI and Machine Learning. Always looking to learn new technologies."
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
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

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
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
          <Button type="submit" >Update Profile</Button>
        </div>
      </form>
    </div>
  );
}

export default MyProfileForm;
