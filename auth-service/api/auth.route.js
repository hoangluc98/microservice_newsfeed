const controller = require('./auth.controller')
const express = require("express")

const router = express.Router()

router.post('/login', controller.postLogin)
router.post('/refresh-token', controller.refreshToken)
router.post('/logout', controller.logout)

module.exports = router