const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const optionSchema = new Schema({
  value: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

const questionSchema = new Schema({
  statement: { type: String, required: true },
  explanation: { type: String, required: true },
  pmarks: { type: Number, required: true },
  nmarks: { type: Number, required: true },
  options: [optionSchema],
});

const sectionSchema = new Schema({
  name: { type: String, required: true },
  duration: Number,
  questions: [questionSchema],
});

const testSchema = new Schema({
  name: { type: String, required: true },
  instructions: { type: String, required: true },
  duration: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  subject: String,
  tags: [String],
  category: {type: String},
  passing_marks: Number,
  sections: [sectionSchema],
},{
  timestamps: true,
});

module.exports = mongoose.model("Test", testSchema);
