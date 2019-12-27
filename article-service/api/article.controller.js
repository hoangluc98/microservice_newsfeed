const Article = require('../model/article.model')
const axios = require('axios')

const articleController = {}
const select = '-_id -userId'

articleController.list = async (req, res) => {
	const page = parseInt(req.query.page) || 1
        
    Article.find({}, select)
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
	try {
		let result = await Article.findOneAndRemove({_id: articleId})
		if(result == null)
            return res.status(500).json('There was a problem deleting the article.')
        await axios.post('http://localhost:5000/comment/deletes', { id: articleId })

		return res.status(201).json('Delete successful')
	} catch(err) {
		res.status(500).json('Delete failed')
	}
}

module.exports = articleController