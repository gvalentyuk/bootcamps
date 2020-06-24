const ErrorResponse = require('../utills/errorResponse')
const crypto = require('crypto')
const asyncHandler = require('../middleware/asyncHandler')
const sendEmail = require('../utills/sendEmail')
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

    sendTokenResponse(user, 200, res)
})


//@route    GET /api/auth/me
//@access   Private
//@desc     Get my profile
exports.getMyProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    return res.status(200).json({
        success: true,
        user
    })
})

//@route    GET /api/auth/logout
//@access   Private
//@desc     Logout
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() +10 *1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true
    })
})


//@route    PUT /api/auth/updatedetails
//@access   Private
//@desc     Update user details
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const details = {
        email: req.body.email,
        name: req.body.name
    }

    const user = await User.findByIdAndUpdate(req.user.id, details, {
        new: true,
        runValidators: true
    })

    return res.status(200).json({
        success: true,
        user
    })
})


//@route    PUT /api/auth/updatepassword
//@access   Private
//@desc     Update password
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Incorrect password'))
    }
    user.password = req.body.newPassword
    user.save()
    sendTokenResponse(user, 200, res)
})


//@route    POST /api/auth/forgotpassword
//@access   Public
//@desc     Forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return next(new ErrorResponse(`User with ${req.body.email} nod found`))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/forgotpassword/${resetToken}`

    const message = `You are receiving this email because you 
        has requested the reset of a password. Please make a PUT request to \n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })

        return res.status(200).json({success: true, data: 'Email send'})
    } catch (e) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false})

        return next(new Error(`email could not be sent`, 500))
    }

})


//@route    POST /api/auth/forgotpassword/:resetPasswordToken
//@access   Public
//@desc     Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetPasswordToken)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendTokenResponse(user, 200, res)
})


//Create cookie
const sendTokenResponse = (user, status, res) => {
    const token = user.signJWToken()

    const option = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 100),
        httpOnly: true
    }

    if (process.env.NODE_ENV == 'production') {
        option.secure = true
    }

    return res.status(status)
        .cookie('token', token, option)
        .json({
            success: true,
            token
        })
}
