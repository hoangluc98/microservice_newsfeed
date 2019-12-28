const mongoose = require('mongoose')

let groupUserSchema = new mongoose.Schema({
	status: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	permission: {
        user:{
            type: Array
        },
        article:{
            type: Array
        },
        comment:{
            type: Array
        },
        statistical:{
            type: Array
        },
        groupUser:{
            type: Array
        }
    },	
	created_At_: {
		type: Date,
		required: true
	},
    updated_At_: {
        type: Date,
        default: Date.now
    }
})

let GroupUser = mongoose.model('GroupUser', groupUserSchema, 'groupUsers')

module.exports = GroupUser