const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resourcesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  resourceType: {
    type: String,
    enum: ["video", "quiz", "lesson"],
    required: true,
  },
  completion_time: { type: Number, required: true },
    completion_value: { type: Number, required: true },
    resourceData: { type: mongoose.ObjectId},
},{
  timestamps: true,
});

const Resource = mongoose.model("Resource", resourcesSchema);

module.exports = Resource;