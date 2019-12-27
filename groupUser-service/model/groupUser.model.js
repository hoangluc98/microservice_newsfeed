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
        users:{
            type: Array,
            required: true,
            default: []
        },
        articles:{
            type: Array,
            required: true,
            default: []
        },
        comments:{
            type: Array,
            required: true,
            default: []
        },
        statisticals:{
            type: Array,
            required: true,
            default: []
        },
        groupUsers:{
            type: Array,
            required: true,
            default: []
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