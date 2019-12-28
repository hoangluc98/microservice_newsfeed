const jwtHelper = require("../helper/jwt.helper")
const url = require('url')
const config = require('../config/config')
// const os = require('os')

const accessTokenSecret = config.ACCESS_TOKEN_SECRET || "access-token-secret"

module.exports.requireAuth = async (req, res, next) => {
	const tokenHeader = req.headers['authorization']
	const url_parts = url.parse(req.url).pathname
	try {
		const decoded = await jwtHelper.verifyToken(tokenHeader, accessTokenSecret)
		req.body.user = decoded.data

		if(jwtHelper.checkExpire(tokenHeader)) {
			console.log('123')
			if('/auth/refresh-token' === url_parts || '/auth/logout' === url_parts) {
				return next()
			}
			else
				return res.status(500).json('Token expired')
		} 
		if('/auth/refresh-token' === url_parts)
			return res.status(500).json('Token not expired')
            
		return next()
	} catch(err) {
		return res.status(401).json({
	        message: 'Not authorized to access this resource',
	    })
	}
}

module.exports.authenticate = async (req, res, next) => {
	let permission = req.body.user.permission
	const urlReq = req.originalUrl.split('/')[1]
	const pathName = (url.parse(req.url)).pathname.split('/')[2]
	
	try {
		if(req.body.user.status === 'disable')
			return res.status(500).json("Not permited")
		if(req.body.user.role.includes('admin'))
			return next()
		
		for(i = 0; i < permission.length; i++){
			permission = permission[i][urlReq]
			if(permission && permission.includes(pathName)) 
				return next()
			
			if(i === (permission.length - 1))
				return res.status(500).json("Not permited")
		}
	} catch(err) {
		return res.status(500).json({error: err})
	}
}