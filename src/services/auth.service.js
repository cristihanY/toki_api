const jwt = require('jsonwebtoken');
const { createUser } = require('../services/users.service');
const secret = process.env.MY_SECRET || 'my_secret';

/**
 * Generates a JWT token for a given user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
    const payload = {
        sub: user.id,
        userName: user.user_name,
        identifier: user.identifier,
        role: user.role || 'customer'
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}


/**
 * Registers a new user and returns a JWT along with the user data.
 * @param {Object} userData - The data to create the new user (e.g., username, email, password)
 * @returns {Object} An object containing the created user (without password hash) and the JWT token
 */
async function registerAndLogin(userData) {
    const user = await createUser(userData);
    const token = generateToken(user);
    delete user.password_hash;
    return { user, token };
}

module.exports = {
    generateToken,
    registerAndLogin
};