const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    userId: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    author: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
        required: true
    },
    read_count: {
        type: Number
    },
    reading_time: {
        type: Number
    },
    tags: {
        type: Array
    },
    body: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
    
});



const blogModel = mongoose.model('blogs', blogSchema)

module.exports = blogModel