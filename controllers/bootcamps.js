const ErrorResponse = require('../utills/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utills/geocoder')
const Bootcamp = require('../models/Bootcamp')

//@route    /api/bootcamps
//@access   Public
//@desc     Get all bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    let reqQuery = {...req.query}

    //exclude field
    let removeField = ['select', 'sort', 'page', 'limit']
    removeField.forEach(field => delete reqQuery[field])
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = Bootcamp.find(JSON.parse(queryStr))

    //select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    //sort
    if (req.query.sort) {
        const fields = req.query.sort.split(',').join(' ')
        query = query.sort(fields)
    } else {
        query = query.sort('-createdAt')
    }

    //pagination
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 1
    let startIndex = (page - 1) * limit
    let endIndex = page * limit
    let total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)

    const bootcamps = await query

    let pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    return res.status(200).json({
        success: true,
        data: bootcamps,
        pagination
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

    return res.status(200).json({success: true, data: bootcamp})
})

//@route    /api/bootcamps
//@access   Private
//@desc     Post new bootcamp
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    return res.status(200).json({
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

//@route    /api/bootcamps/radius/:zipcode/:distance
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