var express = require('express');
var router = express.Router();
const {getAllInfluencers} = require('../controllers/influencerController');
const {auth} = require('./../helpers/jwt')

router.post('/getallinfluencer' ,getAllInfluencers)


module.exports = router