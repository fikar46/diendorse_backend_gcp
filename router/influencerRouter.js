var express = require('express');
var router = express.Router();
const {getAllInfluencers} = require('../controllers/influencerController');
const {auth} = require('./../helpers/jwt')

router.post('/getallinfluencer' , auth,getAllInfluencers)


module.exports = router