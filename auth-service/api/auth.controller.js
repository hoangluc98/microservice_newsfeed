const User = require('../model/user.model')
const GroupUser = require('../model/groupUser.model')
const config = require('../config/config')
const os = require('os')
const redis = require('redis')
const redisClient = redis.createClient({host : 'localhost'})

// Access Token
const accessTokenLife = config.ACCESS_TOKEN_LIFE || '1h'
const accessTokenSecret = config.ACCESS_TOKEN_SECRET || 'access-token-secret'
// Refresh Token
const refreshTokenLife = config.REFRESH_TOKEN_LIFE || '3650d'
const refreshTokenSecret = config.REFRESH_TOKEN_SECRET || 'refresh-token-secret'

const authController = {}

authController.postLogin = async (req, res) => {
	const { email, password } = req.body

	try {
		let permissions = []
		let user = await User.findByCredentials(email, password)
		for(i = 0; i < user.role.length; i++)
			permissions[i] = (await GroupUser.findOne({name: user.role[i]})).permission

		let userData = {
			_id: user._id,
			role: user.role,
			permission: permissions,
			status: user.status
		}
		const accessToken = await user.generateToken(userData, accessTokenSecret, accessTokenLife) 
		const refreshToken = await user.generateToken(userData, refreshTokenSecret, refreshTokenLife)
		
		// Sets: add userId in order to statistic the number of access user
		redisClient.sadd('userAccess', user._id.toString())
		// Set key/value pairs for refreshToen and logout
		redisClient.setex(refreshToken, 31536000, accessToken)
	
		return res.status(200).json({
			accessToken,
			refreshToken
		})
	} catch (error) {
		return res.status(401).send({error: 'Login failed! Check authentication credentials'})
	}
}


authController.refreshToken = async (req, res) => {
	const refreshTokenFromClient = req.body.refreshToken
	if(!refreshTokenFromClient)
		return res.status(403).json('Invalid refresh token.')

	try {
		let user = new User()
		const decoded = await user.verifyToken(refreshTokenFromClient, refreshTokenSecret)
		const accessToken = await user.generateToken(decoded.data, accessTokenSecret, accessTokenLife)

		redisClient.ttl(refreshTokenFromClient, (err, timeToLive) => {
			if(err !== null || timeToLive <= 0){
				return res.status(403).json('Invalid refresh token.')
			} else {
				redisClient.setex(refreshTokenFromClient, timeToLive, accessToken)
				return res.status(200).json({accessToken})
			}
		})
	} catch (error) {
		return res.status(403).json({
			message: 'Invalid refresh token.'
		})
	}
}


authController.logout = async (req, res) => {
	const refreshTokenFromClient = req.body.refreshToken
	if(!refreshTokenFromClient)
		return res.status(403).json('Invalid refresh token.')

	try {
		redisClient.del(refreshTokenFromClient)
		redisClient.srem('userAccess', req.body.user._id.toString())
		
		return res.status(200).json({
			message: 'Logout success'
		})
	} 
	catch(err) {
		return res.status(500).json({error: err})
	}	
}

module.exports = authController