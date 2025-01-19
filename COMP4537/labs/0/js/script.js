/**
 * Represents an individual button in the game.
 */
class Button {
  /**
   * Constructs a Button object.
   * @param {number} id - The button's identifier.
   * @param {number} number - The number displayed on the button.
   * @param {HTMLElement} container - The container to append the button to.
   * @param {function} clickHandler - The function to call when the button is clicked.
   * @param {string} color - The color of the button.
   */
  constructor(id, number, container, clickHandler, color) {
      this.id = id;
      this.number = number;
      this.buttonElement = document.createElement('button');
      this.buttonElement.textContent = number;
      this.buttonElement.style.backgroundColor = color;
      this.buttonElement.addEventListener('click', () => clickHandler(this.id));
      container.appendChild(this.buttonElement);
  }

  /**
   * Sets the position of the button in the window.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   */
  setPosition(x, y) {
      this.buttonElement.style.position = 'absolute';
      this.buttonElement.style.left = `${x}px`;
      this.buttonElement.style.top = `${y}px`;
  }

  /**
   * Hides the button's number (sets the text to '?').
   */
  hideNumber() {
      this.buttonElement.textContent = '?';
  }

  /**
   * Reveals the button's number.
   */
  revealNumber() {
      this.buttonElement.textContent = this.number;
  }
}

/**
* Manages the game logic, including creating buttons and handling user interactions.
*/
class ButtonGame {
  constructor() {
      this.buttons = [];
      this.correctOrder = [];
      this.userOrder = [];
      this.shuffler = null;

      // Available unique colors for the buttons
      this.availableColors = ['#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33F6', '#33FFF6', '#FF9933'];
  }

  /**
   * Starts the game with a given number of buttons.
   * @param {number} buttonCount - The number of buttons to create.
   */
  startGame(buttonCount) {
      this.clearGame();
      this.createButtons(buttonCount);
      this.correctOrder = [...Array(buttonCount).keys()].map(i => i + 1);

      // Initialize the Shuffler with the buttons and start shuffling
      this.shuffler = new Shuffler(this.buttons);
      this.shuffler.startShuffling(buttonCount);
  }

  /**
   * Clears the current game state.
   */
  clearGame() {
      const container = document.getElementById('buttonContainer');
      container.innerHTML = '';  // Clear existing buttons
      this.buttons = [];
      this.correctOrder = [];
      this.userOrder = [];
      UserMessages.clearMessage();
  }

  /**
   * Creates buttons with random unique colors.
   * @param {number} buttonCount - The number of buttons to create.
   */
  createButtons(buttonCount) {
      const container = document.getElementById('buttonContainer');
      const shuffledColors = this.shuffleArray(this.availableColors.slice(0, buttonCount));  // Shuffle colors
      for (let i = 1; i <= buttonCount; i++) {
          const color = shuffledColors[i - 1];  // Assign unique color
          const button = new Button(i, i, container, this.handleButtonClick.bind(this), color);
          this.buttons.push(button);
      }
  }

  /**
   * Shuffles an array.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} - The shuffled array.
   */
  shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];  // Swap elements
      }
      return array;
  }

  /**
   * Handles the button click event.
   * @param {number} id - The ID of the clicked button.
   */
  handleButtonClick(id) {
      const expectedId = this.correctOrder[this.userOrder.length];
      if (id === expectedId) {
          this.buttons[id - 1].revealNumber();
          this.userOrder.push(id);

          if (this.userOrder.length === this.correctOrder.length) {
              UserMessages.displayMessage('Excellent Memory!');
          }
      } else {
          UserMessages.displayMessage('Wrong order!');
          this.revealCorrectOrder();
      }
  }

  /**
   * Reveals the correct order of the buttons when the user makes a mistake.
   */
  revealCorrectOrder() {
      this.correctOrder.forEach(id => {
          this.buttons[id - 1].revealNumber();
      });
  }
}

/**
* Handles scrambling of the buttons, ensuring no overlap and staying within window bounds.
*/
class Shuffler {
  constructor(buttons) {
      this.buttons = buttons;
      this.scrambleCount = 0;
      this.maxScrambles = 0;
  }

  /**
   * Starts the shuffling process.
   * @param {number} buttonCount - The number of times to scramble.
   */
  startShuffling(buttonCount) {
      this.scrambleCount = 0;
      this.maxScrambles = buttonCount;
      setTimeout(() => this.scramble(buttonCount), buttonCount * 1000);
  }

  /**
   * Scrambles the buttons' positions without overlap and keeps them inside window bounds.
   * @param {number} buttonCount - The number of buttons.
   */
  scramble(buttonCount) {
      if (this.scrambleCount >= this.maxScrambles) {
          this.hideAllNumbers();
          return;
      }

      const usedPositions = [];  // Track occupied positions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const buttonSize = this.buttons[0].buttonElement.offsetWidth;
      const maxX = windowWidth - buttonSize;
      const maxY = windowHeight - buttonSize;

      for (const button of this.buttons) {
          let positionFound = false;
          let x, y;

          // Retry finding a non-overlapping position
          while (!positionFound) {
              x = Math.floor(Math.random() * maxX);
              y = Math.floor(Math.random() * maxY);

              if (!this.isOverlapping(x, y, usedPositions, buttonSize)) {
                  positionFound = true;
                  usedPositions.push({ x, y });
              }
          }

          button.setPosition(x, y);
      }

      this.scrambleCount++;
      setTimeout(() => this.scramble(buttonCount), 2000);
  }

  /**
   * Checks if a button's new position overlaps with any existing buttons.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {Array} usedPositions - The list of used positions.
   * @param {number} buttonSize - The size of the buttons.
   * @returns {boolean} - True if overlapping, false otherwise.
   */
  isOverlapping(x, y, usedPositions, buttonSize) {
      for (const pos of usedPositions) {
          const distX = Math.abs(pos.x - x);
          const distY = Math.abs(pos.y - y);
          if (distX < buttonSize && distY < buttonSize) {
              return true;  // Overlap detected
          }
      }
      return false;
  }

  /**
   * Hides the numbers on all buttons after scrambling.
   */
  hideAllNumbers() {
      this.buttons.forEach(button => button.hideNumber());
  }
}

// Initialize game on "Go" button click
document.getElementById('goButton').addEventListener('click', () => {
  const buttonCount = parseInt(document.getElementById('numButtons').value);
  if (buttonCount >= 3 && buttonCount <= 7) {
      const game = new ButtonGame();
      game.startGame(buttonCount);
  } else {
      alert('Please enter a number between 3 and 7.');
  }
});
