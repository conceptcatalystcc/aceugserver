const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  question: { type: mongoose.ObjectId, required: true },
  selected_option: { type: mongoose.ObjectId, required: true },
});

const testProgressSchema = new Schema({
  test: { type: mongoose.ObjectId, required: true },
  student: { type: mongoose.ObjectId, required: true },
  testseries: { type: mongoose.ObjectId, required: true },
  answer_map: { type: [answerSchema], required: true },
  score: { type: Number, required: true },
  time_taken: { type: Number, required: true },
},{
  timestamps: true,
});

module.exports = mongoose.model("TestProgress", testProgressSchema);
