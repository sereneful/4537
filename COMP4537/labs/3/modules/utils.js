/**
 * modules/utils.js
 *
 * This module defines the utility function for generating the greeting message.
 * The getDate() function produces an HTML string that greets the user by name and
 * displays the current server date and time. The output is styled in blue using inline CSS.
 */

// Import the language strings from the language file.
const lang = require('../lang/en/en');

/**
 * getDate - Generates an HTML page with a greeting message.
 *
 * @param {string} name - The user's name.
 * @returns {string} - An HTML string with inline styling that includes the greeting and current time.
 */
function getDate(name) {
  // Get the current date and time.
  const currentTime = new Date();
  // Replace the placeholder %1 in the greeting template with the provided name.
  const message = lang.greeting.replace('%1', name) + currentTime;
  // Return the HTML string with inline styling to set the text color to blue.
  return `
    <html>
      <body style="color: blue;">
        ${message}
      </body>
    </html>
  `;
}

// Export the getDate function.
module.exports = { getDate };
