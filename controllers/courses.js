const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utills/errorResponse')

//@route    GET /api/courses
//@route    GET /api/bootcamps/:bootcampId/courses
//@access   Public
//@desc     Get all courses
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId})
        return res.status(200).json({
            success: true,
            data: courses
        })
    } else {
        return res.status(200).json(req.advancedResults)
    }

})


//@route    GET /api/courses/:id
//@access   Public
//@desc     Get single course  by id
exports.getCourseById = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse(`Course by id ${req.params.id} doesnt exist`), 404)
    }

    return res.status(200).json({
        success: true,
        data: course
    })
})


//@route    POST /api/bootcamps/:bootcampId/courses
//@access   Private
//@desc     Post new course
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next(new ErrorResponse(`Not found bootcamp with id ${req.params.bootcampId}`), 404)
    }


    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to add a course to bootcamp`, 401))
    }

    const course = await Course.create(req.body)

    return res.status(200).json({
        status: true,
        data: course
    })
})


//@route    PUT /api/courses/:id
//@access   Private
//@desc     Update course by id
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse(`Course with id ${req.params.id} doesnt exist`, 404))
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this course`, 401))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    return res.status(200).json({
        success: true,
        data: course
    })
})


//@route    DELETE /api/courses/:id
//@access   Private
//@desc     DELETE course by id
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse(`Course with id ${req.params.id} not found`, 404))
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this course`, 401))
    }

    await course.remove()

    return res.status(200).json({
        success: true
    })
})