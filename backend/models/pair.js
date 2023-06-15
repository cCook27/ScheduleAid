const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PairSchema = new Schema({
  origin: {
    number: Number,
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  destination: {
    number: Number,
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  departureTime: String,
  ArrivalTime: String,
  
});

module.exports = mongoose.model("Pair", PairSchema);