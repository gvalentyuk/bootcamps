const ErrorResponse = require('../utills/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

//@route    POST /api/auth/register
//@access   Public
//@desc     Register new user
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {name, email, role, password} = req.body

    const user = await User.create({
        name, email, role, password
    })
    const token = user.signJWToken()
    sendTokenResponse(user, 200, res)
})


//@route    POST /api/auth/login
//@access   Public
//@desc     Login user
exports.loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        return next(new ErrorResponse('Provide email or password', 400))
    }

    const user = await User.findOne({email}).select('+password')

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }


    const token = user.signJWToken()
    sendTokenResponse(user, 200, res)
})


//Create cookie
const sendTokenResponse = (user, status, res) => {
    const token = user.signJWToken()

    const option = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 100),
        httpOnly: true
    }

    if(process.env.NODE_ENV == 'production'){
        option.secure = true
    }

    return res.status(status)
        .cookie('token', token, option)
        .json({
            success: true,
            token
        })
}