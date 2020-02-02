var express = require('express');
var router = express.Router();
const {authController} = require('../controllers');

router.post('/register', authController.register);
router.get('/getuser',authController.getLengthUser);
module.exports = router;