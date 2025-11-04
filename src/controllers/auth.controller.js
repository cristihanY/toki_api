const passport = require('passport');
const { generateToken, registerAndLogin } = require('../services/auth.service');
const { mapUserToCamelCase } = require('../services/users.service')

const loginUser = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || 'Invalid credentials' });

        const token = generateToken(user);

        delete user.password_hash;

        user = mapUserToCamelCase(user);

        res.json({ user, token });
    })(req, res, next);
};

const registerUser = async (req, res, next) => {
    try {
        const result = await registerAndLogin(req.body);
        res.status(201).json({
            message: 'User registered and logged in successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser };
