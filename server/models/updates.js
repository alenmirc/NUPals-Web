const mongoose = require('mongoose')
const {Schema} = mongoose

const updateSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
}, {timestamps: true})

const UpdateModel = mongoose.model('Updates', updateSchema);

module.exports = UpdateModel