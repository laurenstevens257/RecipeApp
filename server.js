// const express = require('express');
// const cors = require('cors');
// const app = express();

// app.use(cors());

// app.use('/login', (req, res) => {
//     res.send({
//       token: 'test123'
//     });
//   });

//   app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));

// ________________________________________

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const users = []; // Placeholder for storing user information (username, password)

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in your user list (mocked here as users array)
  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    res.status(200).json({ token: 'generate_your_token_here' }); // Replace with actual token generation logic
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    res.status(400).json({ error: 'Username already exists' });
  } else {
    // Create a new user
    users.push({ username, password });
    res.status(200).json({ message: 'Signup successful' });
  }
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));

