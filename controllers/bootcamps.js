const ErrorResponse = require('../utills/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utills/geocoder')
const Bootcamp = require('../models/Bootcamp')

//@route    GET /api/bootcamps
//@access   Public
//@desc     Get all bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    return res.status(200).json(res.advancedResults)
})

//@route    GET /api/bootcamps/:id
//@access   Public
//@desc     Get bootcamp by id
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses')

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp by id ${req.params.id} not found`, 404))
    }

    return res.status(200).json({success: true, data: bootcamp})
})

//@route    POST /api/bootcamps
//@access   Private
//@desc     Post new bootcamp
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id

    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id})
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`, 400))
    }

    const bootcamp = await Bootcamp.create(req.body)
    return res.status(200).json({
        success: true,
        msg: `Create new bootcamps`,
        data: bootcamp
    })
})

//@route    PUT /api/bootcamps/:id
//@access   Private
//@desc     Update bootcamp
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp by id ${req.params.id} not found`, 404))
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
    }
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    return res.status(200).json({success: true, data: bootcamp})
})

//@route    DELETE /api/bootcamps/:id
//@access   Private
//@desc     Delete bootcamp
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401))
    }

    bootcamp.remove()
    return res.status(200).json({success: true, data: bootcamp})
})

//@route    GET /api/bootcamps/radius/:zipcode/:distance
//@access   Public
//@desc     Get bootcamps with radius
exports.getBootcampswithRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
})