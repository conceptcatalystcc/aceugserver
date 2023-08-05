const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const testToProgressSchema = new Schema({
  test: { type: mongoose.Types.ObjectId, required: true, ref: "Test" },
  test_progress: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "TestProgress",
  },
});

const testSeriesEnrollmentsSchema = new Schema(
  {
    student: { type: mongoose.Types.ObjectId, required: true, ref: "Student" },
    testseries: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "TestSeries",
    },
    join_date: { type: Date, default: Date.now(), required: true },
    last_date: { type: Date, required: true },
    cart: { type: mongoose.Types.ObjectId, ref: "Cart" },
    test_progress: [testToProgressSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TestSeriesEnrollments",
  testSeriesEnrollmentsSchema
);
