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

const Bootcamp = require('../models/Bootcamp')

const {protect, authorize} = require('../middleware/auth')
const advancedResults = require('../utills/advancedResults')

const courseRouter = require('./courses')
const reviewsRouter = require('./reviews')

router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewsRouter)

router.route('/').get(advancedResults(Bootcamp, 'courses') ,getBootcamps).post(protect, authorize('admin', 'publisher'),createBootcamp)
router.route('/:id')
    .get(getBootcampById)
    .delete(protect, authorize('admin', 'publisher'), deleteBootcamp)
    .put(protect, authorize('admin', 'publisher'), updateBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcampswithRadius)

module.exports = router