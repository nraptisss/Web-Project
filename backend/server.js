const express = require('express');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
// Use the cors middleware to enable CORS
app.use(cors());

// Import the app objects from the get.js, post.js, and jwt.js files
const get = require('./get');
const post = require('./post');
const jwt = require('./jwt');

// Set up routes for each of the endpoints
app.use('/', get);
app.use('/', post);
app.use('/', jwt);

// Schedule a task to run at the end of every month at 23:59:59
cron.schedule('59 59 23 L * *', async () => {
    try {
        await distributeTokens();
        console.log('Tokens distributed successfully');
    } catch (error) {
        console.log('Error distributing tokens:', error);
    }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});