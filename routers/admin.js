const express = require('express');
const router = express.Router();

const adminController = require('../controllers/AdminController')

// router.get('/login', function(req, res) {
//     res.render('login')
// })

router.get('/register', adminController.register)
router.post('/register', adminController.postRegister)
router.get('/login', adminController.login)
router.post('/login', adminController.postLogin)
router.get('/dashboard', adminController.dashboard)
router.get('/manage', adminController.manage)
router.get('/user-detail/:id', adminController.userDetail)
router.get('/logout', adminController.logout)

module.exports = router