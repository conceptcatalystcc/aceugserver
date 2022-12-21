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
      type: String,
      required: true,
    },
    overview: {
      description: {
        type: String,
        required: true,
      },
      iframe: {
        type: String,
        required: true,
      },
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
    degree: { type: String, required: true },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
