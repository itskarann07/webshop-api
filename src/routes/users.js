const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authJwt');
const adminAuth = require('../middleware/adminAuth');

// @route    GET /api/users
// @desc     Get all users (Admin only)
// @access   Private (Admin)
router.get('/', auth, adminAuth, userController.getAllUsers);

// @route    GET /api/users/:id
// @desc     Get user by ID (Admin or the user themselves)
// @access   Private
router.get('/:id', auth, userController.getUserById);

// @route    PUT /api/users/:id
// @desc     Update user role (Admin only)
// @access   Private (Admin)
router.put('/:id', auth, adminAuth, userController.updateUserRole);

// @route    DELETE /api/users/:id
// @desc     Delete user (Admin only)
// @access   Private (Admin)
router.delete('/:id', auth, adminAuth, userController.deleteUser);

module.exports = router;
