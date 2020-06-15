const ErrorResponse = require('../utills/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = {...err}

    error.message = err.message

    if(err.name === 'CastError'){
        const message = `Resourses not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    if(err.code == 11000){
        const message = `Duplicate field value`
        error = new ErrorResponse(message, 400)
    }

    if(err.name == 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        message: error.message || 'Server error',
        status: false
    })
    next()
}

module.exports = errorHandler