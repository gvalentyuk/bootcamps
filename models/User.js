const {Schema, model} = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = new Schema({
    name: {
        type: String,
        required: [true, 'Please, enter a name']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Enter a valid email'
        ],
        required: [true, 'Please, enter a email'],
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Please, enter a password'],
        minLength: 6
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


User.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

User.methods.signJWToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_INSPIRE
    })
}

User.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

User.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}

module.exports = model('User', User)