const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moduleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    resources: { type: [mongoose.Types.ObjectId], ref: "Resource" },
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
