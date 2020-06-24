const {Router} = require('express')
const router = Router()
const {
    getReviews,
    getReview,
    postReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews')

const Review = require('../models/Review')

const {protect, authorize} = require('../middleware/auth')
const advancedResults = require('../utills/advancedResults')

router.route('/')
    .get(advancedResults(Review,{
        path:'bootcamp'
    }), getReviews)
    .post(protect, authorize('user', 'admin'), postReview)

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user','admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router