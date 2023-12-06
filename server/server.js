/*
*********************************************************
 SETUP
*********************************************************
*/

//Load necessary Node modules
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

//Set up express and cors
const app = express();
app.use(express.json());
app.use(cors());

//Connect to MongoDB using mongoose
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://recipeapp33:recipe123@recipedb.3evocay.mongodb.net/?retryWrites=true&w=majority";
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

/*
*********************************************************
 DEFINE SCHEMAS AND MODELS
*********************************************************
*/

//Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  likedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  groceryList: [{
    text: String, 
    checked: Boolean
  }]
});

//Define Recipe Schema
const recipeSchema = new mongoose.Schema({
  name: String,
  cookTime: Number,
  prepTime: Number,
  ingredients: [
    {
      name: String,
      quantity: String,
      units: String
    }
  ],
  instructions: String,
  tags: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flavedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Create Models
const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

//Token generator
function generateToken(user) {
  const tokenPayload = { id: user._id, username: user.username };
  return jwt.sign(tokenPayload, 'your_jwt_secret', { expiresIn: '1h' }); // Replace 'your_jwt_secret' with your actual secret key
}

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
    
    const token = generateToken(user);
    res.send({ token, success: true });
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
    // console.log(user);
    
    const token = generateToken(user);
    res.send({ token, success: true });
    //res.send({ token: 'generated-token', success: true }); // Implement token validation
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Middleware to authenticate and set user in the request
const authenticate = async (req, res, next) => {

  const authorizationHeader = req.headers.authorization;
  const tokenIndex = authorizationHeader.indexOf('Bearer ') + 'Bearer '.length;
  const tokenString = authorizationHeader.slice(tokenIndex);
  const parsedToken = JSON.parse(tokenString);
  const token = parsedToken.token;

  console.log('parsed token: ', token);
  
  if (!token) {
    console.log('token messed up');

    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // console.log('checkpoint');

    console.log('pre-decode');

    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your secret key

    console.log('decoded: ', decoded);

    req.user = decoded; // Assuming the JWT has user information encoded

    next();
  } catch (error) {
    console.log('invalid token');
    res.status(400).json({ error: 'Invalid token.' });
  }
}

// Add Recipe Route
app.post('/add-recipe', authenticate, async (req, res) => {
  const { name, cookTime, prepTime, ingredients, instructions, tags } = req.body;

  try {
    if (!req.user) {
      return res.status(400).json({ error: 'User authentication failed' });
    }

    console.log('ingredients: ', ingredients);

    const recipe = new Recipe({
      name,
      cookTime,
      prepTime,
      ingredients,
      instructions,
      tags,
      createdBy: req.user.id, // Set the createdBy field to the authenticated user's ID
      flavedBy: []
    });

    console.log('recipe: ', recipe);

    await recipe.save();

    res.status(201).json({ success: true, message: 'Recipe added successfully' });
  } catch (error) {
    res.status(500).send('Error in adding recipe: ' + error.message);
  }
});


// Fetch Recipes Route - Modified to support search functionality
app.get('/home', authenticate, async (req, res) => {
  try {

    console.log('chckpt1: ', req.user);

    const recipes = await Recipe.find({ createdBy: req.user.id }).populate({
      path: 'createdBy',
      select: 'username'
    });

    console.log('checkpoint2: ', recipes);
    
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send('Error in fetching recipes');
  }
});

//Search Route
app.get('/search', async (req, res) => {
  const { search, searchByUser } = req.query;

  try {
    let query = {};
    if (searchByUser === 'true') {

      // Search by User
      const users = await User.find({ username: { $regex: search, $options: 'i' } });
      const userIds = users.map(user => user._id);
      query.createdBy = { $in: userIds };
    } else {
      // Search by Recipe Name
      query.name = { $regex: search, $options: 'i' };
    }


    const recipes = await Recipe.find(query).populate('createdBy', 'username');

    // console.log('recipes: ', recipes);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send('Error in fetching recipes');
  }
});

//Flave Route
app.post('/flave-recipe', authenticate, async (req, res) => {
  try {
    const { recipe } = req.body;

    console.log('recipe: ', recipe);

    const recipeToModify = await Recipe.findById(recipe._id);

    console.log(recipeToModify);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('initial: ', user);

    const recipeIndex = user.likedRecipes.indexOf(recipeToModify._id);

    if (!(recipeIndex > -1)) {
      user.likedRecipes.push(recipeToModify._id); // Append only if not already liked
      recipeToModify.flavedBy.push(user._id);

      console.log('liked: ', user);

      console.log('recipe: ', recipeToModify);

      await recipeToModify.save();

      console.log('recipe saved');

      await user.save(); // Save the user with the updated likedRecipes

      
      res.status(200).json({ message: 'Recipe flaved', likedRecipes: user.likedRecipes });
      
    } else {

      user.likedRecipes.splice(recipeIndex, 1);

      const userIndex = recipeToModify.flavedBy.indexOf(user._id);
      if(userIndex === -1){
        recipeToModify.flavedBy.splice(userIndex, 1);

      }
      console.log('unliked: ', user);

      await recipeToModify.save();
      await user.save(); // Save the user with the updated likedRecipes

      res.status(200).json({ message: 'Recipe unflaved' });
    }
  } catch (error) {
    res.status(500).send('Error in flaving recipes');
  }
});

// Route to get the user's Flavorites
app.get('/user/flavorites', authenticate, async (req, res) => {
  try {
      // Assuming the authenticate middleware adds the user's ID to `req.user`
      const user = await User.findById(req.user.id).populate({
          path: 'likedRecipes',
          populate: { path: 'createdBy', select: 'username' } // Populate the createdBy field in each recipe
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respond with the populated list of liked recipes
      res.json(user.likedRecipes);
  } catch (error) {
      console.error('Error fetching favorite recipes:', error);
      res.status(500).json({ message: 'Error fetching favorite recipes' });
  }
});

//Route to update user's grocery list
// Route to update the user's grocery list
app.post('/user/grocerylist', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.groceryList = req.body.groceryList;
    await user.save();
    res.status(200).json({ message: 'Grocery list updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating grocery list' });
  }
});

//Get grocery list route
app.get('/user/grocerylist', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.groceryList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grocery list' });
  }
});

//Get random recipe
app.get('/random-recipe', async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomRecipe = await Recipe.findOne().skip(random).populate({
      path: 'createdBy',
      select: 'username'
    });
    res.json(randomRecipe);
  } catch (error) {
    res.status(500).send('Error fetching random recipe');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});