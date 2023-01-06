const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: mongoose.ObjectId,
  course: mongoose.ObjectId,
  description: String,
  rating: Number,
});

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Thumbnail",
    },
    description: {
      type: String,
      required: true,
    },
    iframe: {
      type: String,
      required: true,
    },
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
      },
    ],
    rating: { type: Number },
    degree: { type: mongoose.Types.ObjectId, required: true, ref: "Degree" },
    price: {
      type: Number,
      required: true,
    },
    tags: [String],
    days: { type: Number, required: true },
    reviews: [reviewSchema],
    duration: {
      type: Number,
      required: true,
    },
    lectures: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    enrolled: {
      type: Number,
      required: true,
    },
    signature: {
      type: Boolean,
      required: true,
      default: false,
    },
    test_series: {
      type: mongoose.Types.ObjectId,
      ref: "TestSeries",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
