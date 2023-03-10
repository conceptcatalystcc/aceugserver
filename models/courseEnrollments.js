const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const courseEnrollmentSchema = new Schema(
  {
    student: { type: mongoose.ObjectId, required: true, ref: "Student" },
    course: { type: mongoose.ObjectId, required: true, ref: "Course" },
    join_date: { type: Date, required: true },
    last_date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CourseEnrollments", courseEnrollmentSchema);
