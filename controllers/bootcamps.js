//@route    /api/bootcamps
//@access   Public
//@desc     Get all bootcamps
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg:'Get all bootcamps'})
}

//@route    /api/bootcamps/:id
//@access   Public
//@desc     Get bootcamp by id
exports.getBootcampsById = (req, res, next) => {
    res.status(200).json({success:true, msg:`Get bootcamp by id ${req.params.id}`})
}

//@route    /api/bootcamps
//@access   Private
//@desc     Post new bootcamp
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({succes: true, msg:`Create new bootcamps`})
}

//@route    /api/bootcamps/:id
//@access   Private
//@desc     Update bootcamp
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg:`Update bootcamp by id ${req.params.id}`})
}

//@route    /api/bootcamps/:id
//@access   Private
//@desc     Delete bootcamp
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg:`Delete bootcamp by id ${req.params.id}`})
}