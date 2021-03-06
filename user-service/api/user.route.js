const controller = require('./user.controller')
const express = require('express')

const router = express.Router()

router.get('/list', controller.list)
router.post('/item', controller.item)
router.post('/insert', controller.create)
router.post('/update', controller.update)
router.post('/delete', controller.delete)

module.exports = router
