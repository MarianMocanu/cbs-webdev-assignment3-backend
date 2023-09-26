const mongoose = require("mongoose");

const travelDestinationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
    arrivalDate: {
      type: Date,
      required: false,
    },
    departureDate: {
      type: Date,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    deleted: {
      type: Boolean,
      required: false,
    },
  },
  {
    collection: "destinations",
  }
);

const TravelDestination = mongoose.model("TravelDestination", travelDestinationSchema);

module.exports = TravelDestination;
