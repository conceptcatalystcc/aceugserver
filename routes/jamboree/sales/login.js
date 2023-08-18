const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../../../models/student");
const User = require("../../../models/user"); // Replace with the actual path to your User model
const mongoose = require("mongoose");
const verifySalesToken = require("../../../middlewares/verifySalesToken");
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

router.get("/all-enrollments", verifySalesToken, async (req, res) => {
  const distributorId = req.query.distributorId; // Assuming you're sending distributorId as a query parameter

  try {
    const pipeline = [
      {
        $match: {
          distributor: mongoose.Types.ObjectId(distributorId),
        },
      },
      {
        $lookup: {
          from: "testseriesenrollments", // Replace with the actual collection name
          localField: "_id",
          foreignField: "student",
          as: "enrollments",
        },
      },
      {
        $unwind: "$enrollments",
      },
      {
        $lookup: {
          from: "testseries", // Replace with the actual collection name
          localField: "enrollments.testseries",
          foreignField: "_id",
          as: "enrollments.testseries",
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          phone: 1,
          enrolments: {
            testseriesname: {
              $arrayElemAt: ["$enrollments.testseries.name", 0],
            },
            createdAt: "$enrollments.createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$name",
          phone: { $first: "$phone" },
          enrollments: {
            $push: "$enrolments",
          },
        },
      },
      {
        $project: {
          _id: 0,
          phone: 1,
          studentname: "$_id",
          enrollments: 1,
        },
      },
    ];

    const studentsWithEnrollments = await Student.aggregate(pipeline);

    res.status(200).json(studentsWithEnrollments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
