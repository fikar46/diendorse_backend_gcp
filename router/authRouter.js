var express = require('express');
var router = express.Router();
const {authController} = require('../controllers');
const {auth} = require('./../helpers/jwt')


router.post('/register', authController.register);
router.post('/email-verification', authController.verificationEmail);
router.get('/getuser',authController.getLengthUser);
router.get('/testjwt',auth,authController.getLengthUser);
router.post('/login',authController.login);
router.post('/updateroleuser',auth,authController.updateRoleUser);
router.post('/completeprofile/:id_user',auth,authController.completeProfile);
router.get('/getuserdetail/:id_user',auth,authController.getUserDetail);
router.get('/getallkabupaten',auth,authController.getAllKabupaten);


module.exports = router;