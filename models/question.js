const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionSchema = new Schema({
  value: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

const questionSchema = new Schema(
  {
    statement: { type: String, required: true },
    explanation: { type: String },
    pmarks: { type: Number, required: true },
    nmarks: { type: Number },
    options: [optionSchema],
    difficulty: {
      type: String,
    },
    tags: [String],
    sections: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
