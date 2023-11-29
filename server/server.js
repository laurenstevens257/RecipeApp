const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());

const userCredentials = new Map();

app.post('/signup', (req, res) => {

  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  if (userCredentials.has(username)) {
      console.log('username already exists');
      res.status(400).json({ error: 'Username already exists', success: false });
  } else {
      userCredentials.set(username, password);
      console.log('username DNE');
      res.send({ token: 'test123', success: true });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log(password)

  if(userCredentials.get(username) == password){
    res.send({
      token: 'test321',
      success: true
    });
  }
  else{
    console.log('failed login')
    res.status(400).json({ error: 'incorrect password', success: false });
  }
});

app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));

//Set up endpoints for adding recipes and viewing them
let recipes = []; //to store recipes

//endpoint for adding recipes
app.post('/recipe', (req, res) => {
  const recipeName = req.body.name;
  recipes.push(recipeName)
  res.status(201).send('Recipe added: ${recipeName}');
});

//endpoint for retrieving recipes to view them
app.get('/recipes', (req, res) => {
  res.json(recipes);
});