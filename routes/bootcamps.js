const {Router} = require('express')
const router = Router()
const {
    getBootcamps,
    getBootcampsById,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp
} = require('../controllers/bootcamps')

router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcampsById).delete(deleteBootcamp).put(updateBootcamp)

module.exports = router