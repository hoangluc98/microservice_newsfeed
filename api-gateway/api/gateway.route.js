const controller = require('./gateway.controller')
const auth = require('./gateway.middleware')
const express = require('express')

const router = express.Router()

// Auth
router.post('/auth/login', controller.login);
router.post('/auth/refresh-token', auth.requireAuth, controller.refreshToken);
router.post('/auth/logout', auth.requireAuth, controller.logout);

// User
router.get('/user/list', auth.requireAuth, auth.authenticate, controller.forwardToServiceGet)
router.post('/user/item', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/user/insert', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/user/update', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/user/delete', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)

// Group User
router.get('/groupUser/list', auth.requireAuth, auth.authenticate, controller.forwardToServiceGet)
router.post('/groupUser/item', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/groupUser/insert', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/groupUser/update', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/groupUser/delete', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)

// Article
router.get('/article/list', auth.requireAuth, auth.authenticate, controller.forwardToServiceGet)
router.post('/article/item', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/article/insert', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/article/update', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/article/delete', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)

// Comment
router.get('/comment/list', auth.requireAuth, auth.authenticate, controller.forwardToServiceGet)
router.post('/comment/item', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/comment/insert', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/comment/update', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)
router.post('/comment/delete', auth.requireAuth, auth.authenticate, controller.forwardToServicePost)

// Statistical
router.get('/statistcal/user-access', auth.requireAuth, auth.authenticate, controller.numberUserAccess)

module.exports = router