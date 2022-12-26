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
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
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

module.exports = mongoose.model("auth", AuthSchema);
