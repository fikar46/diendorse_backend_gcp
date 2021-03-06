var express = require('express');
var router = express.Router();
const {paymentController} = require('../controllers');
const {auth} = require('./../helpers/jwt')

router.post('/get-information',paymentController.getAccountInformation);
router.post('/get-status-briva',paymentController.getBrivaStatus);
router.post('/get-transaksi-by-id',paymentController.getTransaksiById);
router.post('/aprove-influencer',paymentController.aproveInfuencer);
module.exports = router;