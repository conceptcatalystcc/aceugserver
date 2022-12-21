const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const lessonSchema = new Schema({
  text: { type: String, required: true },
},{
  timestamps: true,
});

module.exports = mongoose.model("Lesson", lessonSchema);
