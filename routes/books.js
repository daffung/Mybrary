const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const Book = require('../models/book')
const Author = require('../models/author')
const UploadPath = path.join('public', Book.coverImagePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload=multer({
    dest: UploadPath,
    fileFilter:function(req,file,callback){
        callback(null,imageMimeTypes.includes(file.mimetype))
    }
})
//Search
router.get('/' , async (req,res)=>{
    let query = Book.find()
    
    if(req.query.title !=null && req.query.title != ' '){
        query = query.regex('title',new RegExp(req.query.title,'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
      }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
      //new route
    if(req.query.author !=null && req.query.author != ' '){
        
        let authorID = await Author.find({'name':new RegExp(req.query.author,'i')})._id
        console.log(authorID)
    }
    //
    try{
        const books = await query.exec()
        
        res.render('books/index',{books:books, searchOption:req.query} )
    }catch{
        res.redirect('/')
    }
})
//New
router.get('/new', (req,res) => {
    rendernewPage(res,new Book())
})

//Create
router.post('/' ,  upload.single.('cover'), async (req,res) =>{
    const filename=req.file !=null ? req.file.filename:null
    const book = new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate:new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
        coverImageName:filename,
        description:req.body.description
    })
    try{
        const newbook = await  book.save()
        res.redirect('/books')
    }catch{
        if (book.coverImageName !=null){
            removeBookcover(book.coverImageName)
        }
        rendernewPage(res,book,true)
    }
})
function removeBookcover(filename){
    fs.unlink(path.join(UploadPath,filename),err=>{
        if(err) console.error(err)
    })
}
async function rendernewPage(res,book,hasError=false)
{
    try{
        const authors = await Author.find({})
        if(hasError) errorMessage="Error Creating Book"
        res.render('books/new' , {book:book , authors:authors, errorMessage:errorMessage}) 
    }catch{
        res.redirect('/books')
    }
}

module.exports = router