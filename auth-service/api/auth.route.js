const express = require("express")
const controller = require('./auth.controller')

const router = express.Router()

router.post('/login', controller.postLogin)
router.post('/refresh-token', controller.refreshToken)
router.post('/logout', controller.logout)

module.exports = router