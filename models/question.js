const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionSchema = new Schema({
  value: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

const questionSchema = new Schema(
  {
    statement: { type: String, required: true },
    options: [optionSchema],
    explanation: { type: String },
    pmarks: { type: Number, required: true, default: 2 },
    nmarks: { type: Number },
    difficulty: {
      type: String,
    },
    tags: [String],
    sections: [String],
    user_created: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
