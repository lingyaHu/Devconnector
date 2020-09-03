const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

// Connect database
connectDB();

// initialize middleware for the bodyparser
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    // lead to the client folder created by react
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000; // port is for heroku connection

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
