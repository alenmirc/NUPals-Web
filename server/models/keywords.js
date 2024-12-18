const mongoose = require('mongoose');
const { Schema } = mongoose;

const multiWordKeywordSchema = new mongoose.Schema({
    keyword: { type: String, required: true, unique: true }
}, { timestamps: true });
 
module.exports = mongoose.model('MultiWordKeyword', multiWordKeywordSchema);