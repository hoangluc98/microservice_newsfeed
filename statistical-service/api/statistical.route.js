const express = require('express')

const controller = require('./statistical.controller')

const router = express.Router()

router.get('/user-access', controller.numberUserAccess)

module.exports = router
