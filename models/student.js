const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    school: { type: String },
    currentClass: { type: String },
    aspired_degree: { type: String },
    aspired_college: { type: String },
    dob: { type: Date },
    courses_enrolled: { type: [mongoose.ObjectId], ref: "Course" },
    series_enrolled: { type: [mongoose.ObjectId], ref: "TestSeries" },
    doubt_points: { type: Number, default: 50 },
    uid: { type: String },
    distributor: {
      type: mongoose.Types.ObjectId,
      ref: "Distributor",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
