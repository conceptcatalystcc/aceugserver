const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../../../models/student");
const User = require("../../../models/user"); // Replace with the actual path to your User model
const mongoose = require("mongoose");
const verifyUserToken = require("../../../middlewares/verifyUserToken");
const Distributor = require("../../../models/distributor");
const testSeriesEnrolments = require("../../../models/testSeriesEnrolments");
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
      expiresIn: "1999h", // Token expiration time (optional)
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all test series associated with a distributor
router.get("/all-testseries", async (req, res) => {
  const distributorId = req.query.distributorId; // Get distributorId from request body

  try {
    // Check if the distributor exists
    const distributor = await Distributor.findById(distributorId);

    if (!distributor) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    // Find all test series associated with the distributor
    const testSeries = await TestSeries.find({ distributor: distributorId });

    res.status(200).json({ testSeries });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all-enrollments", verifyUserToken, async (req, res) => {
  const distributorId = req.query.distributorId; // Assuming you're sending distributorId as a query parameter

  try {
    // Find students belonging to the distributor and populate their names
    const students = await Student.find({ distributor: distributorId });

    // Get enrollments for those students and populate the testseries names
    const enrollments = await testSeriesEnrolments
      .find({
        student: { $in: students.map((student) => student._id) },
      })
      .populate({
        path: "testseries",
        select: "name", // Replace with the field name you want to populate
      })
      .populate({
        path: "student",
        select: "name phone", // Replace with the field name you want to populate
      });

    res.status(200).json(enrollments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/testing", (req, res) => {
  res.send("ok");
});

module.exports = router;
