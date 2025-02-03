/**
 * server.js
 *
 * This is the main server file for the assignment.
 * It implements three GET endpoints:
 *
 * 1. GET /COMP4537/labs/3/getDate/?name=YourName
 *    - Returns an HTML page with a greeting and the current server date and time,
 *      styled in blue (inline CSS).
 *
 * 2. GET /COMP4537/labs/3/writeFile/?text=YourText
 *    - Appends the provided text (plus a newline) to 'file.txt'.
 *      If the file does not exist, it is created.
 *
 * 3. GET /COMP4537/labs/3/readFile/file.txt
 *    - Reads the contents of 'file.txt' and returns them as plain text.
 *      If the file does not exist, a 404 error is returned.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Import the getDate function from our utils module.
const { getDate } = require('./modules/utils');

// Define the file path for file.txt (placed in the same directory as server.js)
const filePath = path.join(__dirname, 'file.txt');

// Create the HTTP server.
const server = http.createServer((req, res) => {
  // Parse the URL and its query parameters.
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // -----------------------------------------------------------
  // Endpoint 1: GET /COMP4537/labs/3/getDate/?name=YourName
  // -----------------------------------------------------------
  if (
    pathname === '/COMP4537/labs/3/getDate/' ||
    pathname === '/COMP4537/labs/3/getDate'
  ) {
    // Get the 'name' parameter; default to "Guest" if not provided.
    const name = query.name || 'Guest';
    // Generate the HTML response using the getDate function.
    const htmlResponse = getDate(name);
    // Send the HTML response with a 200 status code.
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlResponse);

  // -----------------------------------------------------------
  // Endpoint 2: GET /COMP4537/labs/3/writeFile/?text=YourText
  // -----------------------------------------------------------
  } else if (
    pathname === '/COMP4537/labs/3/writeFile/' ||
    pathname === '/COMP4537/labs/3/writeFile'
  ) {
    // Extract the text query parameter; default to an empty string.
    const text = query.text || '';
    // Append the provided text (with a newline) to file.txt.
    fs.appendFile(filePath, text + '\n', (err) => {
      if (err) {
        // On error, return a 500 status code with an error message.
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to write to file');
      } else {
        // On success, return a plain text success message.
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Text appended to file.txt');
      }
    });

  // -----------------------------------------------------------
  // Endpoint 3: GET /COMP4537/labs/3/readFile/file.txt
  // -----------------------------------------------------------
  } else if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
    // Read the content of file.txt using UTF-8 encoding.
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // If the file is not found or an error occurs, return a 404 error.
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File file.txt not found`);
      } else {
        // Return the file content with a 200 status code.
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    });

  // -----------------------------------------------------------
  // Fallback for any undefined endpoints.
  // -----------------------------------------------------------
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Determine the port from the environment or default to 3000.
const PORT = process.env.PORT || 3000;

// Start the server.
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
