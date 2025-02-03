/** I acknowledge that I have used ChatGPT to help me understand different parts of this assignment. */

// Note Constructor
class Note {
    constructor(content) {
        this.content = content || '';
    }

    save() {
        return { content: this.content };
    }
}

// Handling localStorage interactions
const localStorageKey = 'notes';
const notesContainer = document.getElementById('notes-container');
const displayNotes = document.getElementById('display-notes');

/**
 * Loads notes from localStorage, converts them into Note objects, and returns them as an array.
 * @returns {Note[]} An array of Note objects loaded from localStorage.
 */
function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem(localStorageKey)) || []; 
    return savedNotes.map(note => new Note(note.content));
}

/**
 * Saves the given array of Note objects to localStorage and updates the save time display.
 * @param {Note[]} notes - An array of Note objects to be saved to localStorage.
 */
function saveNotes(notes) {
    const notesToSave = notes.map(note => note.save());
    localStorage.setItem(localStorageKey, JSON.stringify(notesToSave));
    const currentTime = new Date().toLocaleTimeString();
    if (document.getElementById('save-time')) {
        document.getElementById('save-time').textContent = currentTime;
    }
}

/**
 * Adds a new note to the writer page by creating a textarea and a remove button, 
 * and saves the current notes to localStorage.
 */
function addNewNote() {
    const noteElement = document.createElement('textarea');
    const removeButton = document.createElement('button');
    removeButton.textContent = messages.removeNote; // Use messages from user.js
    removeButton.addEventListener('click', () => {
        notesContainer.removeChild(noteElement);
        notesContainer.removeChild(removeButton);
        saveCurrentNotes();
    });
    notesContainer.appendChild(noteElement);
    notesContainer.appendChild(removeButton);
    saveCurrentNotes();
}

/**
 * Saves the current notes present in writer.html by extracting the content of each textarea
 * and storing them in localStorage.
 */
function saveCurrentNotes() {
    const textareas = document.querySelectorAll('textarea');
    const notes = [];
    textareas.forEach(textarea => {
        notes.push(new Note(textarea.value));
    });
    saveNotes(notes);
}

/**
 * Loads existing notes from localStorage when writer.html is opened, creates corresponding textareas 
 * for each note, and sets up remove buttons to delete notes.
 */
function loadExistingNotes() {
    const notes = loadNotes();
    notes.forEach(note => {
        const noteElement = document.createElement('textarea');
        noteElement.value = note.content;
        const removeButton = document.createElement('button');
        removeButton.textContent = messages.removeNote; // Use messages from user.js
        removeButton.addEventListener('click', () => {
            notesContainer.removeChild(noteElement);
            notesContainer.removeChild(removeButton);
            saveCurrentNotes();
        });
        notesContainer.appendChild(noteElement);
        notesContainer.appendChild(removeButton);
    });
}

/**
 * Displays notes on the reader.html page by loading them from localStorage, creating a div for each note,
 * and showing the last update time.
 */
function displayNotesInReader() {
    const notes = loadNotes();
    displayNotes.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.textContent = note.content;
        displayNotes.appendChild(noteElement);
    });
    const currentTime = new Date().toLocaleTimeString();
    if (document.getElementById('update-time')) {
        document.getElementById('update-time').textContent = currentTime;
    }
}

// Event listeners for adding notes and saving them every 2 seconds, determines whether it is writer.html or reader.html based on the presence of notesContainer or displayNotes.
if (notesContainer) {
    document.getElementById('add-note').textContent = messages.addNote; // Use messages from user.js
    document.getElementById('add-note').addEventListener('click', addNewNote);
    loadExistingNotes();
    setInterval(saveCurrentNotes, 2000);
} else if (displayNotes) {
    setInterval(displayNotesInReader, 2000);
}

/**
 * Sets the static content for the back buttons on the page using messages from user.js.
 */
document.addEventListener('DOMContentLoaded', () => {
    const backLinks = document.querySelectorAll('a[href="index.html"]');
    backLinks.forEach(link => {
        link.textContent = messages.backHome; // Set the back button text
    });
});
