const GroupUser = require('../model/groupUser.model')

const groupUserController = {}

groupUserController.list = async (req, res) => {
	const page = parseInt(req.query.page) || 1

    GroupUser.find({_id: req.body.id})
        .limit(10)
        .skip(10*(page-1))
		.then(result => {
			res.status(200).json({
                list: result,
                total: result.length
            })
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

groupUserController.item = (req, res) => {
	GroupUser.findOne({_id: req.body.id})
		.exec()
		.then(result => {
			res.status(200).json(result)
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

groupUserController.create = async (req, res) => {
	if(!req.body.permission || !req.body.status || !req.body.name)
		return res.status(500).json('Create groupUser failed')

    req.body.created_At_ = Date.now()
    
    GroupUser.create(req.body)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
}

groupUserController.update = async (req, res) => {
	const groupId = req.body.groupId
	if(!groupId)
		return res.status(500).json('Update groupUser failed')

	try {
		await GroupUser.findByIdAndUpdate({_id: groupId}, req.body)
        let result = await GroupUser.find({_id: groupId})
        
		res.status(201).json(result)
	} catch(err) {
		res.status(500).json({error: err})
	}
}

groupUserController.delete = (req, res) => {
	GroupUser.findByIdAndDelete({_id: req.body.id})
		.exec()
		.then(result => {
			res.status(204).json('Delete successful')
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

module.exports = groupUserController