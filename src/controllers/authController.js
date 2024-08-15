const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/userSchema'); // User model
const { validationResult } = require('express-validator'); // For validating input

// Secret key for JWT (ideally, store it in .env)
const jwtSecret = process.env.JWT_SECRET;

// @route    POST /api/auth/register
// @desc     Register a new user
// @access   Public
exports.register = async (req, res) => {
    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user instance
        user = new User({
            name,
            email,
            password,
            role // Optional: Can default to 'user'
        });
        console.log(user);

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        user.password = await bcrypt.hash(password, salt);
        
        // Save the user to the database
        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id, // MongoDB automatically generates an ID
                role: user.role // Useful for role-based access control
            }
        };

        // Sign the JWT token
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' }, // Token expiration time
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the token to the client
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route    POST /api/auth/login
// @desc     Authenticate user & get token
// @access   Public
exports.login = async (req, res) => {
    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign the JWT token
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route    GET /api/auth/user
// @desc     Get logged-in user details (Protected route)
// @access   Private (requires JWT)
exports.getUser = async (req, res) => {
    try {
        // Get user data by ID (excluding password)
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
