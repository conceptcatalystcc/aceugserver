const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const thumbnailSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);

module.exports = Thumbnail;
