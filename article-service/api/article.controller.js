const Article = require('../model/article.model')
const axios = require('axios')

const articleController = {}
const select = '-_id -userId'

articleController.list = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const userId = req.body.userId
    try {
        if(userId)
            const result = await Article.find({userId: userId}, select).limit(10).skip(10*(page-1))
        else
            const result = await Article.find({}, select).limit(10).skip(10*(page-1))
        
        res.status(200).json({
            list: result,
            total: result.length
        })
    } catch (error) {
        res.status(500).json({error: err})
    }
}

articleController.item = (req, res) => {
	Article.findOne({_id: req.body.id}, select)
		.then(result => {
			res.status(200).json(result)
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

articleController.create = async (req, res) => {
	if(!req.body.content)
		return res.status(500).json('Created article failed')

    req.body.created_At_ = Date.now()  
    Article.create(req.body)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
}

articleController.update = async (req, res) => {
    const articleId = req.body.articleId
    if(!req.body.user.role.includes('admin') && (req.body.user._id !== req.body.userId))
        res.status(500).json('Can\'t update')

    try {
        await Article.findOneAndUpdate({_id: articleId}, req.body)
        let result = await Article.findOne({_id: articleId})

        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({error: err})
    }
}

articleController.delete = async (req, res) => {
    const articleId = req.body.articleId
    
    if(!req.body.user.role.includes('admin') && (req.body.user._id !== req.body.userId))
        res.status(500).json('Can\'t delete')

	try {
		let result = await Article.findOneAndRemove({_id: articleId})
		if(result == null)
            return res.status(500).json('Delete failed')
        await axios.post('http://localhost:5000/comment/deletes', { id: articleId })

		return res.status(201).json('Delete successful')
	} catch(err) {
		res.status(500).json('Delete failed')
	}
}

module.exports = articleController