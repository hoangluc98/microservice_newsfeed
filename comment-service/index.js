const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/config')

const port = config.port
const urlDb = config.urlMongoDB
mongoose.connect(urlDb, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

const route = require('./api/comment.route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/comment', route)

// Listen
app.listen(port, function() {
    console.log('Server listening on port ' + port)
})
