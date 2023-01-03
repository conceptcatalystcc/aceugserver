const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const sectionSchema = new Schema({
  name: { type: String, required: true },
  duration: Number,
  questions: { type: [mongoose.Types.ObjectId], ref: "Question" },
});

const testSchema = new Schema(
  {
    name: { type: String, required: true },
    instructions: { type: String, required: true },
    duration: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    subject: String,
    tags: [String],
    category: { type: String },
    passing_marks: Number,
    sections: [sectionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Test", testSchema);