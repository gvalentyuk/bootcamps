const {Router} = require('express')
const router = Router()
const {
    getBootcamps,
    getBootcampById,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp,
    getBootcampswithRadius
} = require('../controllers/bootcamps')

const courseRouter = require('./courses')

router.use('/:bootcampId/courses', courseRouter)

router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcampById).delete(deleteBootcamp).put(updateBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcampswithRadius)

module.exports = router