const User = require('../model/user.model')

const userController = {}
const select = '-_id email name role status created_At_ updated_At_'

userController.list = async (req, res) => {
	const page = parseInt(req.query.page) || 1
    User.find({}, select)
        .limit(10)
        .skip(10*(page-1))
		.exec()
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

userController.item = (req, res) => {
	User.findOne({_id: req.body.id}, select)
		.exec()
		.then(result => {
			res.status(200).json(result)
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

userController.create = async (req, res) => {
	const role = req.body.role
	req.body.password = req.body.password.toLowerCase()
	if(!req.body.name || !req.body.email || !req.body.password || !role || !req.body.status)
		return res.status(500).json('Created failed')

	req.body.created_At_ = Date.now()
	try{
		let result = await User.create(req.body)
		res.status(201).json(result)
	} catch(err){
		res.status(500).json({error: err})
	}
}

userController.update = async (req, res) => {
	const userId = req.body.userId
	if((!req.body.user.role.includes('admin')) && (userId !== req.body.user._id))
		return res.status(500).json('Update failed')

	try{
		await User.findByIdAndUpdate({_id: userId}, req.body)

		let result = await User.findOne({_id: userId}, select)
		res.status(201).json(result)
	} catch(err){
		res.status(500).json({error: err})
	}
}

userController.delete = (req, res) => {
	const userId = req.body.userId
	
	if(!req.body.user.role.includes('admin') && (req.body.user._id !== req.body.userId))
		res.status(500).json('Can\'t delete')
		
	User.findByIdAndDelete({_id: userId})
		.exec()
		.then(result => {
			res.status(201).json('Delete successful')
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		})
}

module.exports = userController