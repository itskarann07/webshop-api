const jwt = require('jsonwebtoken');

// JWT Secret key (stored in environment variables)
const jwtSecret = process.env.JWT_SECRET || 'yourSecretKey';

module.exports = function (req, res, next) {
    // Get the token from the header
    const token = req.header('Authorization');

    // Check if no token is provided
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);

        // Attach the decoded user to the request object (req.user)
        req.user = decoded.user;

        // Proceed to the next middleware/route handler
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
