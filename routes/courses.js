const {Router} = require('express')
const router = Router({mergeParams: true})
const {getCourses, getCourseById, addCourse, deleteCourse, updateCourse} = require('../controllers/courses')

router.route('/').get(getCourses).post(addCourse)

router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse)

module.exports = router