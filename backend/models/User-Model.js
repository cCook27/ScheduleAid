const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Home = require('./Home-Model');

const UserSchema = new Schema({
    name: String,
    _id: String,
    homes: Array,
    schedule: Array,
    buffer: Number,
    designation: String,
    email: String

});

module.exports = mongoose.model("User", UserSchema);