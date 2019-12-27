const config = { }

config.db = {
    urlMongoDB : process.env.urlMongoDB || 'mongodb://localhost:27017/express-database'
}

config.port = {
    port : process.env.port || 3000,
    article: 3001,
    auth: 3002,
    comment: 3003,
    groupUser: 3004,
    statistical: 3005,
    user: 3006
}

module.exports = config;