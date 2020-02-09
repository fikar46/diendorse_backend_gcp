var express = require('express');
var router = express.Router();
const {projectController} = require('../controllers');
const {auth} = require('./../helpers/jwt')

router.post('/create-ads',auth,projectController.createAds);
router.get('/get-ongoing-ads/:id_user',auth,projectController.getAdsOngoing);
router.get('/get-history-ads/:id_user',auth,projectController.getAdsHistory);
router.post('/get-all-ads-ongoing',auth,projectController.getAllAdsOnGoing);
router.get('/get-all-category',auth,projectController.getAllCategoris);
router.get('/get-all-kabupaten',auth,projectController.getAllKabupaten);
module.exports = router;