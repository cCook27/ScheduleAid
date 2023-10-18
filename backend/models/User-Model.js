const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    _id: String,
    homes: Array,
    schedule: Array,
    groups: Array,
    buffer: Number,
    designation: String,
    email: String

});

module.exports = mongoose.model("User", UserSchema);