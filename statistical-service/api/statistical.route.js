const controller = require('./statistical.controller')
const express = require('express')

const router = express.Router()

router.get('/user-access', controller.numberUserAccess)

module.exports = router
