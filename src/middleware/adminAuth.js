module.exports = function (req, res, next) {
    // Check if the user's role is 'admin'
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only' });
    }

    // Proceed to the next middleware/route handler if the role is 'admin'
    next();
};
