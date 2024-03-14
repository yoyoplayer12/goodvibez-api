//create mongoose schema for comments
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    reports: {
        type: Number,
        default: 0,
    },
    removed: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
//export model to use in index.js
const Message = mongoose.model("Message", MessageSchema, "messages");
module.exports = Message;