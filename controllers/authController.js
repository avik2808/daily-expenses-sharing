const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config');

exports.register = async (req, res) => {
    try {
        const { email, name, mobile } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({ email, name, mobile });
        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, mobile } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (user.mobile !== mobile) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
