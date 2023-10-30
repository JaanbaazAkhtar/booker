const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Books', booksSchema);