const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    lastName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    password: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
