const ErrorResponse = require('../utills/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const Bootcamp = require('../models/Bootcamp')

//@route    /api/bootcamps
//@access   Public
//@desc     Get all bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find()
    return res.status(200).json({
        success: true,
        data: bootcamps
    })
})

//@route    /api/bootcamps/:id
//@access   Public
//@desc     Get bootcamp by id
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp by id ${req.params.id} not found`, 404))
    }

    res
        .status(200)
        .json({success: true, data: bootcamp})
})

//@route    /api/bootcamps
//@access   Private
//@desc     Post new bootcamp
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(200).json({
        success: true,
        msg: `Create new bootcamps`,
        data: bootcamp
    })
})

//@route    /api/bootcamps/:id
//@access   Private
//@desc     Update bootcamp
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp by id ${req.params.id} not found`, 404))
    }

    return res.status(200).json({success: true, data: bootcamp})
})

//@route    /api/bootcamps/:id
//@access   Private
//@desc     Delete bootcamp
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    return res.status(200).json({success: true, data: bootcamp})
})