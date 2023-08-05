const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    email: {
      type: String,

      // You can add an additional validation for email format here
    },
    address: {
      type: String,
    },
    // Add other fields as needed, e.g., phoneNumber, country, etc.
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const Distributor = mongoose.model("Distributor", distributorSchema);

module.exports = Distributor;
