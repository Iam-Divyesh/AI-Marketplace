const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/', upload.single('model'), productController.createProduct);
router.get('/model/:filename', productController.serveModel);

module.exports = router;