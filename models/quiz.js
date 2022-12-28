const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  name: { type: String, required: true },
  instructions: { type: String, required: true },
  duration: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  subject: String,
  tags: [String],
  passing_marks: Number,
  questions: { type: [mongoose.Types.ObjectId], ref: "Question" },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
