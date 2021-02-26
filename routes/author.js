const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//Search
router.get('/' , async (req,res) => {
    let SearchOption={}

    if(req.query.name!=null && req.query.name != ' ')
    {
        SearchOption.name = new RegExp(req.query.name,'i')
    }
    try{
        const authors = await Author.find(SearchOption)
        res.render('authors/index', {authors:authors, SearchOption:req.query})
    }catch{
        res.redirect('/')
    }
})
//New
router.get('/new', (req,res) => {
    res.render('authors/new', {author: new Author()})
})

//Create
router.post('/' ,  async (req,res) =>{
    const author = new Author({
        name: req.body.name
    })
    try{
        const newauthor = await  author.save()
        res.redirect('authors')
    }catch{
        res.render('authors/new' , {author:author , errorMessage:'Error create author'})
    }
})
// View
router.get('/:id',async (req,res)=>{
    try{
        const  author = await Author.findById(req.params.id)
        const books = await Book.find({author: req.params.id}).limit(4).exec()
        res.render('authors/show',  {author: author, bookByauthor:books})
    }catch{
        redirect('/')
    }
})
//Update
router.get('/:id/edit', async (req,res)=>{
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
      } catch {
        res.redirect('/authors')
      }
})
router.put('/:id',async (req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect('/authors')
    }catch(e){
        throw e
        if (author == null){res.redirect('/')}
        else {
            res.render(`/authors/edit`,{author:author, errorMessage:'Error  updating author'})
        }
    }
})
//Delete
router.delete('/:id',  async (req,res)=>{
    let author
    try{
        author = await Author.findById(res.params.id)
        await  author.remove()
        res.redirect('/authors')
    }catch{
        if( author== null)  res.redirect('/')
        res.redirect(`/authors/${author.id}`)
    }
})
module.exports = router