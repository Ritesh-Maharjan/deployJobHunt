const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  roles: {
    type: String,
    enum: ["Admin", "Company", "Job seeker"],
    required: true,
  },
  avatar: {
    type: String,
  }
});

// Checking if username exists already
UserSchema.path("email").validate(async (email) => {
  const emailCount = await mongoose.models.User.countDocuments({ email });
  return !emailCount;
}, "Email already exists");

// Checking if phone number exists already
UserSchema.path("phone").validate(async (phone) => {
  const emailCount = await mongoose.models.User.countDocuments({ phone });
  return !emailCount;
}, "phone already exists");

module.exports = mongoose.model("User", UserSchema);
