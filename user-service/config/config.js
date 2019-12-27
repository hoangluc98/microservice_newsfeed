const config = {
    urlMongoDB : process.env.urlMongoDB || 'mongodb://localhost:27017/express-database',
    port : process.env.port || 3006
}

module.exports = config