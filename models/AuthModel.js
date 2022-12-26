const mongoose = require("mongoose");

const AuthSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

AuthSchema.path("email").validate(async (email) => {
  const count = await mongoose.models.auth.countDocuments({ email });
  return !count;
}, "Email already exist.");
AuthSchema.path("phone").validate(async (phone) => {
  const count = await mongoose.models.auth.countDocuments({ phone });
  return !count;
}, "Phone already exist.");

module.exports = mongoose.model("auth", AuthSchema);
