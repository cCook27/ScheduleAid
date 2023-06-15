const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeSchema = new Schema({
  name: String,
  address: {
    number: Number,
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  pairs: [{ type: Schema.Types.ObjectId, ref: 'Pair' }]
});

module.exports = mongoose.model("Home", HomeSchema);
