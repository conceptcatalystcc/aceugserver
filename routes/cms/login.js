const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/user"); // Replace with the actual path to your User model
const mongoose = require("mongoose");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Find the user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "HEYSHHHHHHHHHHHHH", {
      expiresIn: "1h", // Token expiration time (optional)
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
