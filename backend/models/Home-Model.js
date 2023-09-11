const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeSchema = new Schema({
  name: String,
  address: {
    street: Schema.Types.Mixed,
    city: String,
    state: String,
    zip: Number,
  },
  preferredTimes: Array
});


module.exports = mongoose.model("Home", HomeSchema);