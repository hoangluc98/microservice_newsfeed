const config = {
	urlMongoDB : process.env.urlMongoDB || 'mongodb://localhost:27017/express-database',
    port : process.env.port || 3002,
	ACCESS_TOKEN_LIFE: '1h',
	ACCESS_TOKEN_SECRET: 'access-token-secret',
	REFRESH_TOKEN_LIFE: '3650d',
	REFRESH_TOKEN_SECRET: 'refresh-token-secret'
}

module.exports = config;