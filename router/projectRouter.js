var express = require('express');
var router = express.Router();
const {projectController} = require('../controllers');
const {auth} = require('./../helpers/jwt')

router.post('/create-ads',auth,projectController.createAds);
router.get('/get-ongoing-ads/:id_user',auth,projectController.getAdsOngoing);
router.get('/get-ongoing-ads-all/:id_user',auth,projectController.getAdsOngoingAll);
router.post('/get-ongoing-ads-detail',auth,projectController.getAdsOngoingDetail);
router.get('/get-history-ads/:id_user',auth,projectController.getAdsHistory);
router.get('/get-history-ads-all/:id_user',auth,projectController.getAdsHistoryAll);
router.get('/category-ads',auth,projectController.categorAds);
router.post('/upload-file',auth,projectController.uploadFile);
router.post('/get-all-ads-ongoing',auth,projectController.getAllAdsOnGoing);
router.get('/get-all-category',auth,projectController.getAllCategoris);
router.get('/get-all-kabupaten',auth,projectController.getAllKabupaten);
router.get('/get-project-ads-by-id',auth,projectController.getAdsById);
module.exports = router;