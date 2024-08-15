const User = require('../models/userSchema');

// @route    GET /api/users
// @desc     Get all users (admin only)
// @access   Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route    GET /api/users/:id
// @desc     Get user by ID (profile)
// @access   Private (Admin or self)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Only allow access if the user is admin or the same user
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
};

// @route    PUT /api/users/:id
// @desc     Update user role (admin only)
// @access   Private (Admin)
exports.updateUserRole = async (req, res) => {
    const { role } = req.body;

    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Only allow admins to update roles
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        user.role = role;
        await user.save();

        res.json({ msg: 'User role updated', user });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
};

// @route    DELETE /api/users/:id
// @desc     Delete user (admin only)
// @access   Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Only allow admins to delete users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        await user.remove();

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
};
