const {Router} = require('express')
const router = Router()
const {
    getBootcamps,
    getBootcampById,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp
} = require('../controllers/bootcamps')

router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcampById).delete(deleteBootcamp).put(updateBootcamp)

module.exports = router