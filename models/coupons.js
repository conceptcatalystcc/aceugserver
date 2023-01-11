const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    instructor: { type: mongoose.Types.ObjectId, ref: "Instructor" },
    expiry: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
