const express = require("express");
const router = express.Router();
const Question = require("../../models/question"); // Make sure to adjust the path to your Question model

// Create a new question
router.post("/questions", async (req, res) => {
  try {
    // Extract the userId from the request (assuming your middleware adds it)
    const userId = req.userId; // Replace with the actual property name

    // Create a new question with user_created field
    const newQuestionData = {
      ...req.body,
      user_created: userId, // Add userId to the user_created field
    };

    const newQuestion = new Question(newQuestionData);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Retrieve questions with pagination
router.get("/questions", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from query parameter
  const limit = 20; // Number of questions per page

  try {
    // Count total number of questions
    const totalQuestions = await Question.countDocuments();

    // Calculate total number of pages based on limit
    const totalPages = Math.ceil(totalQuestions / limit);

    // Ensure page number is within valid range
    if (page < 1 || page > totalPages) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    // Calculate skip value based on current page and limit
    const skip = (page - 1) * limit;

    // Retrieve questions with pagination and sort by creation date in descending order
    const questions = await Question.find()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip)
      .limit(limit);

    res.json({
      questions,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve a specific question by ID
router.get("/questions/:id", getQuestion, (req, res) => {
  res.json(res.question);
});

// Update a question by ID
router.patch("/questions/:id", getQuestion, async (req, res) => {
  if (req.body.statement != null) {
    res.question.statement = req.body.statement;
  }
  if (req.body.options != null) {
    res.question.options = req.body.options;
  }
  if (req.body.explanation != null) {
    res.question.explanation = req.body.explanation;
  }
  if (req.body.pmarks != null) {
    res.question.pmarks = req.body.pmarks;
  }
  if (req.body.nmarks != null) {
    res.question.nmarks = req.body.nmarks;
  }
  if (req.body.difficulty != null) {
    res.question.difficulty = req.body.difficulty;
  }
  if (req.body.tags != null) {
    res.question.tags = req.body.tags;
  }
  if (req.body.sections != null) {
    res.question.sections = req.body.sections;
  }
  try {
    const updatedQuestion = await res.question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a question by ID
router.delete("/questions/:id", getQuestion, async (req, res) => {
  try {
    await res.question.remove();
    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get a question by ID
async function getQuestion(req, res, next) {
  let question;
  try {
    question = await Question.findById(req.params.id);
    if (question == null) {
      return res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.question = question;
  next();
}

module.exports = router;
