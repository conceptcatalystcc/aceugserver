const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const lessonSchema = new Schema({
  text: { type: String, required: true },
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
