const Bootcamp = require('../models/Bootcamp')

//@route    /api/bootcamps
//@access   Public
//@desc     Get all bootcamps
exports.getBootcamps = async (req, res, next) => {
    try{
        const bootcamps = await Bootcamp.find()
        res
            .status(200)
            .json({
                success: true,
                data: bootcamps
            })
    }catch (e) {
        res.status(400).json({success: false})
    }
    res.status(200).json({success: true, msg: 'Get all bootcamps'})
}

//@route    /api/bootcamps/:id
//@access   Public
//@desc     Get bootcamp by id
exports.getBootcampById = async (req, res, next) => {
    try{
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return res.status(400).json({success: false})
        }

        res
            .status(200)
            .json({success: true, data: bootcamp})
    }catch (e) {
        res.status(400).json({success: false})
    }
    res.status(200).json({success: true, msg: `Get bootcamp by id ${req.params.id}`})
}

//@route    /api/bootcamps
//@access   Private
//@desc     Post new bootcamp
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res
            .status(200)
            .json({
                succes: true,
                msg: `Create new bootcamps`,
                data: bootcamp
            })

    } catch (e) {
        res.status(400).json({success: false})
    }
}

//@route    /api/bootcamps/:id
//@access   Private
//@desc     Update bootcamp
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update bootcamp by id ${req.params.id}`})
}

//@route    /api/bootcamps/:id
//@access   Private
//@desc     Delete bootcamp
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete bootcamp by id ${req.params.id}`})
}