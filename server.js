if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}


const express = require('express');
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRoutes = require('./routes/index')
const authorRoutes = require('./routes/author')

app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:'10mb' , extended:true }) )

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser :true , useUnifiedTopology: true })
const db = mongoose.connection
db.on('error' , error => console.error(error))
db.once('open' , () =>console.log('Connected to mongoose'))

app.use('/' , indexRoutes)
app.use('/authors', authorRoutes)
app.listen(process.env.PORT || 3000)
 