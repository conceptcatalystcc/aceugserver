const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  distributor: {
    type: mongoose.Types.ObjectId,
    ref: "Distributor",
  },
  role: {
    type: String,
    enum: ["sales", "content"], // Adjust roles as needed
    default: "sales",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
