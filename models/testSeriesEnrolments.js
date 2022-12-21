const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const testToProgressSchema = new Schema({
  test: { type: mongoose.ObjectId, required: true },
  test_progress: { type: mongoose.ObjectId, required: true },
});

const testSeriesEnrollmentsSchema = new Schema({
  student: { type: mongoose.ObjectId, required: true },
  testseries: { type: mongoose.ObjectId, required: true },
  join_date: { type: Date, required: true },
  last_date: { type: Date, required: true },
  test_progress: [testToProgressSchema],
},{
  timestamps: true,
});

module.exports = mongoose.model(
  "TestSeriesEnrollments",
  testSeriesEnrollmentsSchema
);
