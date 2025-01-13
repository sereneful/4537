/**
 * Handles displaying and clearing messages to the user.
 */
class UserMessages {
  /**
   * Displays a message to the user.
   * @param {string} message - The message to display.
   */
  static displayMessage(message) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = message;
  }

  /**
   * Clears any displayed message.
   */
  static clearMessage() {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = '';
  }
}
