var express = require('express');
var router = express.Router();
const {authController} = require('../controllers');
const {auth} = require('./../helpers/jwt')


router.post('/register', authController.register);
router.get('/getuser',authController.getLengthUser);
router.post('/login',authController.login);
module.exports = router;