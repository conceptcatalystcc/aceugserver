const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resourceStatusSchema = new Schema({
  module: { type: mongoose.ObjectId, required: true },
  resource: { type: mongoose.ObjectId, required: true },
  status: { type: Number, required: true },
});

const courseProgressSchema = new Schema({
  course: { type: mongoose.ObjectId, required: true },
  student: { type: mongoose.ObjectId, required: true },
  statusMap: { type: [resourceStatusSchema], required: true },
},{
  timestamps: true,
});

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
