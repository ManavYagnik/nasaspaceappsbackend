const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 4001;
const cors = require('cors');
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins
  }));
// Path to the file where tokens will be saved
const TOKEN_FILE_PATH = path.join(__dirname, 'tokens.json');

// Helper function to save token to a JSON file
const saveTokenToFile = (token) => {
  // Read existing tokens from the file
  fs.readFile(TOKEN_FILE_PATH, 'utf8', (err, data) => {
    let tokens = [];

    if (!err && data) {
      tokens = JSON.parse(data); // Parse existing tokens if the file exists and has content
    }

    // Add the new token to the list
    tokens.push({ token, timestamp: new Date().toISOString() });

    // Write the updated token list back to the file
    fs.writeFile(TOKEN_FILE_PATH, JSON.stringify(tokens, null, 2), (err) => {
      if (err) {
        console.error('Error saving token to file:', err);
      } else {
        console.log('Token saved successfully');
      }
    });
  });
};

// POST route to handle token saving
app.post('/api/save-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  // Save the token to the JSON file
  saveTokenToFile(token);

  // Send a success response
  return res.status(200).json({ message: 'Token saved successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
