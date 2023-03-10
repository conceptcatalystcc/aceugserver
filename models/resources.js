const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baseOptions = {
  timestamps: true,
};

const resourcesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    completion_time: { type: Number, required: true },
    completion_value: { type: Number, required: true },
    resourceType: {
      type: String,
      enum: ["Video", "Quiz", "Lesson"],
      required: true,
    },
    video: { type: mongoose.Types.ObjectId, ref: "Video" },
    lesson: { type: mongoose.Types.ObjectId, ref: "Lesson" },
    quiz: { type: mongoose.Types.ObjectId, ref: "Quiz" },
  },
  baseOptions
);

const Resource = mongoose.model("Resource", resourcesSchema);

module.exports = Resource;
