const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');
const auth = require('../middleware/authJwt');
const adminAuth = require('../middleware/adminAuth');

// @route    GET /api/products
// @desc     Get all products with optional filters (price, category)
// @access   Public
router.get('/', productController.getProducts);

// @route    GET /api/products/:id
// @desc     Get product by ID
// @access   Public
router.get('/:id', productController.getProductById);

// @route    POST /api/products
// @desc     Add a new product
// @access   Private (Admin or Product Manager)
router.post('/', auth, adminAuth, productController.addProduct);

// @route    PUT /api/products/:id
// @desc     Update a product by ID
// @access   Private (Admin or Product Manager)
router.put('/:id', auth, adminAuth, productController.updateProduct);

// @route    DELETE /api/products/:id
// @desc     Delete a product by ID
// @access   Private (Admin or Product Manager)
router.delete('/:id', auth, adminAuth, productController.deleteProduct);

module.exports = router;
