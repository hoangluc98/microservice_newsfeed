const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const md5 = require('md5')

let userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
	},
	password: {
		type: String,
		required: true,
		trim:true,
        minlength: 7,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!')
            }else if(validator.equals(value.toLowerCase(),"password")){
                throw new Error('Password is invalid!')
            }else if(validator.contains(value.toLowerCase(), "password")){
                throw new Error('Password should not contain password!')
            }
        }
	},
	name: {
		type: String,
		trim: true,
		required: true
	},
	role: {
		type: Array,
        required: true
	},
    status: {
        type: String,
        required: true
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

// Find user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const hashedPassword = md5(password)
    const isPasswordMatch = (hashedPassword === user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

userSchema.methods.generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        const userData = {
                _id: user._id,
                role: user.role,
                permission: user.permission,
                status: user.status
            }
            
        jwt.sign({
                data: userData 
            },
            secretSignature, {
                algorithm: 'HS256',
                expiresIn: tokenLife,
            }, (error, token) => {
                if (error) {
                    return reject(error)
                }
                resolve(token)
            })
    })
}

userSchema.methods.verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error)
            }
            resolve(decoded)
        })
    })
}

userSchema.methods.checkExpire = (decoded) => {
    const now = Date.now().valueOf() / 1000

    if (typeof decoded.exp !== 'undefined' && decoded.exp < now)
        return true
    return false
}

let User = mongoose.model('User', userSchema, 'users')

module.exports = User