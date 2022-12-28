const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instructorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    social_links: [
      {
        platform: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    courses: {
      type: [mongoose.Types.ObjectId],
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
