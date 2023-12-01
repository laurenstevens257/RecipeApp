const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://recipeapp33:recipe123@recipedb.3evocay.mongodb.net/?retryWrites=true&w=majority";

// for password hashing
const argon2 = require('argon2');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB via Mongoose');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define User and Recipe Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const recipeSchema = new mongoose.Schema({
  name: String,
  // ingredients: [String],
  // instructions: String,
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }
});

// Create Models
const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

app.use(cors());
app.use(express.json());

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === '' || password === ''){
      return res.status(401).json({error: 'please enter a username and password', success: false});
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: 'Username already exists', success: false });
    }

    // Hashing the password with Argon2id
    const hash = await argon2.hash(password, { type: argon2.argon2id });

    user = new User({ username, password: hash });
    await user.save();
    res.send({ token: 'generated-token', success: true }); // Implement token generation
  } catch (error) {
    res.status(500).send('Error in saving');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid Credentials');
    }

    // Verifying the provided password with the stored hash
    if (!(await argon2.verify(user.password, password))) {
      return res.status(400).send('Invalid Credentials');
    }
    
    res.send({ token: 'generated-token', success: true }); // Implement token validation
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Add Recipe Route
app.post('/add-recipe', async (req, res) => {
  const { name } = req.body;
  try {
    const recipe = new Recipe({
      name,
    });
    await recipe.save();
    res.status(201).json({ success: true, message: 'Recipe added successfully' });
  } catch (error) {
    res.status(500).send('Error in adding recipe');
  }
});

// Fetch Recipes Route
app.get('/recipe-list', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send('Error in fetching recipes');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}/login`);
});
