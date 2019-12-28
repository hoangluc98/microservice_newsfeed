const controller = require('./comment.controller')
const express = require('express')

const router = express.Router()

router.get('/list', controller.list)
router.post('/item', controller.item)
router.post('/insert', controller.create)
router.post('/update', controller.update)
router.post('/delete', controller.delete)
router.post('/deletes', controller.deletes)

module.exports = router
