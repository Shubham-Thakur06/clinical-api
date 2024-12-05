const express = require('express');
const router = express.Router();
const multer = require('multer');

const { addClinicalData, getClinicalDataRange } = require('../controllers/clinicalDataController');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
});

router.route("/")
    .post(upload.single('file'), addClinicalData)
    .get(getClinicalDataRange);

module.exports = router;
