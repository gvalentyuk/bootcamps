const {Router} = require('express')
const router = Router({mergeParams: true})
const {getCourses, getCourseById, addCourse, deleteCourse, updateCourse} = require('../controllers/courses')
const {protect, authorize} = require('../middleware/auth')
const Course = require('../models/Course')
const advancedResults = require('../utills/advancedResults')


router.route('/').get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}), getCourses).post(protect, authorize('admin', 'publisher'), addCourse)

router.route('/:id')
    .get(getCourseById)
    .put(protect, authorize('admin', 'publisher'), updateCourse)
    .delete(protect, authorize('admin', 'publisher'), deleteCourse)

module.exports = router