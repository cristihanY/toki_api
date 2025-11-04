const bcrypt = require('bcrypt');
const userRepo = require('../repository/userRepository');

/**
 * Hashes a given password using bcrypt.
 * @param {string} password - The password to hash
 * @returns {Promise<string>} The hashed password
 */
async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

/**
 * Verifies a user's password.
 * @param {string} user_name - The username of the user
 * @param {string} password - The password entered by the user
 * @returns {Promise<boolean>} True if password is correct, false otherwise
 */
async function verifyPassword(user_name, password) {
    const user = await userRepo.findByUserName(user_name);
    if (!user) {
        return false;
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid;
}

async function verifyBasicPassword(password, passwordHash) {
    const isValid = await bcrypt.compare(password, passwordHash);
    return isValid;
}

module.exports = { hashPassword, verifyPassword, verifyBasicPassword };

