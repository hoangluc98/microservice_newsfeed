const url = require('url')
const axios = require('axios')
const config = require('../config/config')

const gatewayController = {}

// Auth
// Login: email, password
gatewayController.login = (req, res) => {
    axios.post('http://localhost:3002/auth/login', req.body)
    .then(response => {
        res.json(response.data)
    })
    .catch(err => {
        res.json(err)
    })
}

// Refresh token. Header: access token, Body: refresh token
gatewayController.refreshToken = (req, res) => {
	axios.post('http://localhost:3002/auth/refresh-token', req.body)
    .then(response => {
        res.json(response.data)
    })
    .catch(err => {
        res.json({
            error: 'Refresh token failed'
        })
    })
}

// Logout. Header: access token, Body: refresh token
gatewayController.logout = (req, res) => {
	axios.post('http://localhost:3002/auth/logout', req.body)
    .then(response => {
        res.json(response.data)
    })
    .catch(err => {
        res.json({
            error: 'Logout failed'
        })
    })
}

// Forward to service, method Get
// List
gatewayController.forwardToServiceGet = (req, res) => {
    let url_parts = url.parse(req.url).pathname

    // Get port and url from request. E.g: '3006/user/list?page=1'
    const portAndOriginalUrl = config.port[url_parts.split('/')[1]] + req.originalUrl
    axios.get('http://localhost:' + portAndOriginalUrl)
    .then(response => {
        res.json(response.data)
    })
    .catch(err => {
        res.json(err)
    })
}

// Forward to service, method Post
// Insert, Update, Item, Delete
gatewayController.forwardToServicePost = (req, res) => {
    let url_parts = url.parse(req.url).pathname

    // Get port and url from request. E.g: '3006/user/create'
    const portAndOriginalUrl = config.port[url_parts.split('/')[1]] + req.originalUrl
    axios.post('http://localhost:' + portAndOriginalUrl, req.body)
    .then(response => {
        res.json(response.data)
    })
    .catch(err => {
        res.json(err)
    })
}

// Statistical
gatewayController.numberUserAccess = (req, res) => {
	axios.post('http://localhost:3005/statistical/user-access?day=' + req.query.day)
    .then(response => {
        res.json(response.data)
    })
    .catch(err => {
        res.json(err)
    })
}

module.exports = gatewayController