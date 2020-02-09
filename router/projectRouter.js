var express = require('express');
var router = express.Router();
const {projectController} = require('../controllers');
const {auth} = require('./../helpers/jwt')

router.post('/create-ads',auth,projectController.createAds);
router.get('/get-ongoing-ads/:id_user',auth,projectController.getAdsOngoing);
router.get('/get-history-ads/:id_user',auth,projectController.getAdsHistory);
router.get('/get-all-ads-ongoing',auth,projectController.getAllAdsOnGoing);
module.exports = router;