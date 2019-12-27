const StatisDay = require('../model/statisDay.model')

const statisticalController = {}

statisticalController.numberUserAccess = async (req, res) => {
	const day = req.query.day

	if(!day)
		return res.status(500).json('Time wrong')

    StatisDay.findOne({ day: day, type: 'user_Access' })
        .then(result => {
            res.status(200).json({
                list: result.list
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })        
}

module.exports = statisticalController