const express = require('express')
const app = express()
const config = require('./config/config')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const port = config.port
const urlDb = config.urlMongoDB
mongoose.connect(urlDb, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

const route = require('./api/auth.route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth', route)

// Listen
app.listen(port, function() {
    console.log('Server listening on port ' + port)
})
