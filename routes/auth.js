const {Router} = require('express')
const {
    registerUser,
    loginUser,
    getMyProfile,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout
} = require('../controllers/auth')
const {protect} = require('../middleware/auth')
const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logout)
router.route('/me').get(protect, getMyProfile)
router.route('/forgotpassword').post(forgotPassword)
router.route('/updatedetails').put(protect, updateDetails)
router.route('/forgotpassword/:resetPasswordToken').post(resetPassword)
router.route('/updatepassword').put(protect, updatePassword)

module.exports = router