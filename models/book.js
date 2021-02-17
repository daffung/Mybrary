const mongoose = require('mongoose')
const path = require('path')
const coverImagePath = 'upload/bookcover'
const bookSchema =  new mongoose.Schema({
    title:
    {
        type: String,required:true
    },
    description: {
        type: String,required:true
    },
    publishDate: {
        type: Date,required:true
    },
    pageCount:{
        type:Number,required:true
    },
    CreateDate:{
        type:Date,required:true,default:Date.now()
    },
    coverImageName:{
        type:String,required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Authors'
    },

})
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName!=null){
       return path.join('/', coverImagePath , this.coverImageName)
    }
})
module.exports = mongoose.model('Books', bookSchema)