const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const testSectionSchema = new Schema(
  {
    name: { type: String, required: true },
    duration: Number,
    questions: { type: [mongoose.Types.ObjectId], ref: "Question" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TestSection", testSectionSchema);
