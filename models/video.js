const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const videoSchema = new Schema({
  alt_text: { type: String, required: true },
  url: { type: String, required: true },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
