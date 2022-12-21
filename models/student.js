const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  school: { type: String },
  currentClass: { type: String },
  aspired_degree: { type: String },
  aspired_college: { type: String },
  dob: { type: Date },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  courses_enrolled: {type:[mongoose.ObjectId], ref:'Course'},
  series_enrolled: [mongoose.ObjectId],
  points: {type: Number, default: 0}
},{
  timestamps: true,
});

module.exports = mongoose.model("Student", studentSchema);
