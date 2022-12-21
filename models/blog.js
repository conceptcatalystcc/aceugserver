const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{type: String, required: true, unique: true},
    body:{type: String, required: true},
    thumbnail:{type: String, required: true},
    tags: [String],

},
{
    timestamps: true,
  });

module.exports = mongoose.model("Blog", blogSchema);