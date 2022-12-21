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
},{
  timestamps: true,
});

module.exports = mongoose.model("Question", questionSchema);
