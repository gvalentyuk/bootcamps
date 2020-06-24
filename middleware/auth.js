const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const errorResponse = require('../utills/errorResponse')
const User = require('../models/User')

exports.protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }
    if(!token){
        return next(new errorResponse('Not authorization token', 401))
    }
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)
        next()
    }catch (e) {
        return next(new errorResponse('Not authorization token', 401))
    }
})

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next( new errorResponse(
                `User role ${req.user.role} is not authorized to access this route`, 403
            ))
        }
        next()
    }
}