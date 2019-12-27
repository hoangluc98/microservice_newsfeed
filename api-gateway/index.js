const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/config')
const axios = require('axios')

const port = config.port.port

const route = require('./api/gateway.route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', route)

// Listen
app.listen(port, function() {
    console.log('Server listening on port ' + port)
})
