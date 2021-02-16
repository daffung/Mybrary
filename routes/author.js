const express = require('express')
const router = express.Router()
const Author = require('../models/author')

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

module.exports = router