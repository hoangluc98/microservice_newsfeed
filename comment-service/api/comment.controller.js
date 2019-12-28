const Comment = require('../model/comment.model')

const commentController = {}
const select = '-_id -userId -articleId'

commentController.list = async (req, res) => {
	const page = parseInt(req.query.page) || 1
	const articleId = req.body.articleId

	try {
		if(articleId)
			let comments = await Comment.find({articleId: articleId}, select).limit(10).skip(10*(page-1))
        else
			let comments = await Comment.find({}, select).limit(10).skip(10*(page-1))

		res.status(200).json({
			list: comments,
			total: comments.length
		})
	} catch(err){
		req.error = err
		res.status(500).json({error: err})
	}
}

commentController.item = (req, res) => {
	Comment.findOne({_id: req.body.id}, select)
		.exec()
		.then(result => {
			res.status(200).json(result)
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

commentController.create = async (req, res) => {
	if(!req.body.content && !req.body.image)
		return res.status(500).json('Created comment failed')

	req.body.created_At_ = Date.now()
    Comment.create(req.body)
		.then(result => {
			res.status(200).json(result)
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

commentController.update = async (req, res) => {
	if(!req.body.user.role.includes('admin') && (req.body.user._id !== req.body.userId))
        res.status(500).json('Can\'t update')

	try {
		let commentId = req.body.commentId
		await Comment.findOneAndUpdate({_id: commentId}, req.body)
		let result = await Comment.findOne({_id: commentId})

		return res.status(201).json(result)
	} catch(err) {
		return res.status(500).json({error: err})
	}
}

commentController.delete = async (req, res) => {
	const { cmtId, articleId, userCmtId, userArtId } = req.body

	if(!req.body.user.role.includes('admin') && (req.body.user._id !== userArtId) && (req.body.user._id !== userCmtId))
        res.status(500).json('Can\'t update')

	Comment.findOneAndRemove({_id: cmtId})
		.exec()
		.then(result => {
			res.status(204).json('Delete successful')
		})
		.catch(err => {
			res.status(500).json('Delete not success')
		})
}

commentController.deletes = async (req, res) => {
	Comment.deleteMany({articleId: req.body.articleId})
		.then(result => {
			res.status(204).json('Delete successful')
		})
		.catch(err => {
			res.status(500).json('Delete not success')
		})
}

module.exports = commentController