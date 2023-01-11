const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    status: {
      type: String,
      default: "INITIATED",
    },
    testSeries: { type: [mongoose.Types.ObjectId], ref: "TestSeries" },
    course: { type: [mongoose.Types.ObjectId], ref: "Course" },
    value: { type: Number, required: true },
    order: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
