const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    _id: String,
    homes: Array,
    schedule: Array,
    autoGroups: {visits: [], visitOverflow: []},
    manualGroups: Array,
    buffer: Number,
    designation: String,
    email: String,
    maxVisits: Number,
    workingDays: Number

});

module.exports = mongoose.model("User", UserSchema);