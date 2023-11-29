const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017/recipesdb';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });


const userCredentials = new Map();

const recipesCollection = client.db('recipesdb').collection('recipes');

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


app.post('/recipe', async (req, res) => {
  const recipeName = req.body.name;

  try {
    // Save the recipe to MongoDB
    const result = await recipesCollection.insertOne({ name: recipeName });
    
    console.log(`Recipe added: ${recipeName}`);
    res.status(201).send({ message: `Recipe added: ${recipeName}`, success: true });
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ error: 'Internal Server Error', success: false });
  }
});

app.get('/recipes', async (req, res) => {
  try {
    // Retrieve all recipes from MongoDB
    const recipes = await recipesCollection.find().toArray();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Set up endpoints for adding recipes and viewing them
/*let recipes = []; //to store recipes

//endpoint for adding recipes
app.post('/recipe', (req, res) => {   //RENAME THIS
  const recipeName = req.body.name;
  recipes.push(recipeName)
  console.log(recipes);
  res.status(201).send({message: 'Recipe added: ${recipeName}', success: true});
});

//endpoint for retrieving recipes to view them
app.get('/recipes', (req, res) => {
  res.json(recipes);
});*/

app.listen(8080, () => console.log('API is running on http://localhost:8080'));