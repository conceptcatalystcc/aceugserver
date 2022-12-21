const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  coupon: { type: String },
  phone: { type: Number, required: true },
  school: { type: String },
  dob: { type: Date },
  kick_back: Number,
},{
  timestamps: true,
});

module.exports = mongoose.model("Teacher", teacherSchema);
