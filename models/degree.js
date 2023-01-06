const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const degreeSchema = new Schema({
  name: { type: String, required: true },
});

const Degree = mongoose.model("Degree", degreeSchema);

module.exports = Degree;
