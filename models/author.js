const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    _id:{
        type:mongoose.Schema.Types.ObjectId
    }
})
module.exports = mongoose.model('Authors', authorSchema)