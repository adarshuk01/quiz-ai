const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo, bio } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "ALL_REQUIRED_FIELDS_MISSING" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "USER_ALREADY_EXISTS" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      bio,
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// FORGOT PASSWORD
// ==============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "EMAIL_REQUIRED" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "USER_NOT_FOUND" });
    }

    // create reset token (valid for 15 mins)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // reset link (frontend URL)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // email content
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ message: "RESET_LINK_SENT" });
  } catch (error) {
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

// ==============================
// RESET PASSWORD
// ==============================
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "TOKEN_AND_PASSWORD_REQUIRED" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "USER_NOT_FOUND" });
    }

    // update password
    user.password = password;
    await user.save();

    res.json({ message: "PASSWORD_RESET_SUCCESS" });
  } catch (error) {
    res.status(400).json({ message: "INVALID_OR_EXPIRED_TOKEN" });
  }
};



exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "USER_NOT_FOUND" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNo, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "USER_NOT_FOUND" });
    }

    // Update only provided fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo || user.phoneNo;
    user.bio = bio || user.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phoneNo: updatedUser.phoneNo,
      bio: updatedUser.bio,
      message: "PROFILE_UPDATED_SUCCESSFULLY",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "INVALID_CREDENTIALS" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // will trigger pre-save hash

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};