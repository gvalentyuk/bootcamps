const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utills/errorResponse')


//@route    GET /api/reviews
//@route    GET /api/bootcamps/:bootcampId/reviews
//@access   Public
//@desc     Get all reviews
exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Review.find({bootcamp: req.params.bootcampId})
        return res.status(200).json({
            success: true,
            data: reviews
        })
    } else {
        return res.status(200).json(res.advancedResults)
    }
})

//@route    GET /api/reviews/:id
//@access   Public
//@desc     Get single review
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (!review) {
        return next(new ErrorResponse('Review not found', 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })
})


//@route    POST /api/bootcamps/bootcampId/reviews
//@access   Private
//@desc     Create review
exports.postReview = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse('Bootcamp not found', 404))
    }

    const review = await Review.create(req.body)

    return res.status(200).json({
        success: true,
        data: review
    })
})

//@route    PUT /api/reviews/:id
//@access   Private
//@desc     Update review
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse('Review not found', 404))
    }

    if (review.user.toString() !== req.user.id && req.user !== 'admin') {
        return next(new ErrorResponse('Not authorized', 401))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    return res.status(200).json({
        success: true,
        data: review
    })
})


//@route    DELETE /api/reviews/:id
//@access   Private
//@desc     Delete review
exports.deleteReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse('Review not found', 404))
    }

    if (review.user.toString() !== req.user.id && req.user !== 'admin') {
        return next(new ErrorResponse('Not authorized', 401))
    }

    await review.remove()

    return res.status(200).json({
        success: true,
        data: {}
    })
})