const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    filename: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 100,
    },
    status: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: false,
    },
}, { timestaps: true })


const issue = mongoose.model('Issue', IssueSchema);
module.exports = issue;