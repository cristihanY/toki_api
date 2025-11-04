const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique identifier (UUID v4).
 * @returns {string} Generated UUID
 */
function generateIdentifier() {
  return uuidv4();
}

module.exports = { generateIdentifier };

