const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baseOptions = {
  discriminatorKey: "resourceType", // our discriminator key, could be anything
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
  },
  baseOptions
);

const BaseResource = mongoose.model("BaseResource", resourcesSchema);

module.exports = BaseResource;
