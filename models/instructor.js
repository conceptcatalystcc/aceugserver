const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
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
    type: Array,
    required: true,
  },
},{
  timestamps: true,
});

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;