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

  if(!(username === '' || password === '')){  
    if (userCredentials.has(username)) {
        console.log('username already exists');
        res.status(400).json({ error: 'Username already exists', success: false });
    } else {
        userCredentials.set(username, password);
        console.log('username DNE');
        res.send({ token: 'test123', success: true });
    }
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

//Set up endpoints for adding recipes and viewing them
let recipes = []; //to store recipes

//endpoint for adding recipes
app.post('/recipe', (req, res) => {   //RENAME THIS
  const recipeName = req.body.name;
  recipes.push(recipeName);
  console.log(recipes);
  res.status(201).send({message: 'Recipe added: ${recipeName}', success: true});
});

//endpoint for retrieving recipes to view them
app.get('/recipe-list', (req, res) => {
  res.json(recipes);
});

app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));