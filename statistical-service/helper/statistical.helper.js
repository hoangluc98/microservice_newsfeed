const redis = require('redis')
const redisClient = redis.createClient({host : 'localhost'})
const CronJob = require('cron').CronJob
const StatisHour = require('../model/statisHour.model')
const StatisDay = require('../model/statisDay.model')

let statisticalUser = {}

statisticalUser.jobHour = new CronJob({
		cronTime: '0 0 * * * *', 
		onTick: async function() {
			let date = new Date()
			let day = date.getFullYear() + '-' + check(date.getMonth() + 1) + '-' + check(date.getDate())
			let hour = check(date.getHours())
			redisClient.scard('userAccess', (err, num) => {
				if (err)
					return res.json(err)

				StatisHour.create({
					type: "user_Access",
					number: parseInt(num),
					day,
					hour
				})
			})
			redisClient.del('userAccess')
		},
		start: false,
		timeZone: 'Asia/Ho_Chi_Minh'
	})
statisticalUser.jobHour.start()

statisticalUser.jobDay = new CronJob({
		cronTime: '0 30 23 * * *', 
		onTick: async function() {
			let date = new Date()
			let day = date.getFullYear() + '-' + check(date.getMonth() + 1) + '-' + check(date.getDate())

			statisDayFunc(day, "user_Access")
		},
		start: false,
		timeZone: 'Asia/Ho_Chi_Minh'
	})
statisticalUser.jobDay.start()

let statisDayFunc = async (day, type) => {
	let list = await StatisHour.find({ day: day, type: type }, 'hour number -_id')
	if(type == 'user_Access')
		StatisDay.create({
			type,
			number: list.length,
			list,
			day
		})
}

let check = (time) => {
	if(time < 10)
		return ('0' + time)
	return time
}

module.exports = statisticalUser