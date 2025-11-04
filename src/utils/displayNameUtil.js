/**
 * Formats a username into a display name by replacing underscores or dots with spaces
 * and capitalizing the first letter of each word.
 * @param {string} userName - The username to format
 * @returns {string} The formatted display name
 */
function formatDisplayName(userName) {
  return userName
    .replace(/[_\.]/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generates a display name from a username.
 * If the username is empty or undefined, returns a default "Usuario".
 * @param {string} userName - The username to generate the display name from
 * @returns {string} The display name
 */
function generateDisplayName(userName) {
  if (!userName) return "Usuario";
  return formatDisplayName(userName);
}

module.exports = { generateDisplayName };
