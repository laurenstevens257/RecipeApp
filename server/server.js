const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
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
    console.log(user);
    
    const token = generateToken(user);
    res.send({ token, success: true });
    //res.send({ token: 'generated-token', success: true }); // Implement token validation
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Add Recipe Route

// Middleware to authenticate and set user in the request
const authenticate = async (req, res, next) => {
  // const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent in the "Authorization" header
  console.log('check1');

  const authorizationHeader = req.headers.authorization;
  const tokenIndex = authorizationHeader.indexOf('Bearer ') + 'Bearer '.length;
  const tokenString = authorizationHeader.slice(tokenIndex);
  const parsedToken = JSON.parse(tokenString);
  const token = parsedToken.token;
  
  console.log('token: ', token);

  if (!token) {
    console.log('token messed up');

    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    console.log('checkpoint');

    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your secret key

    console.log('decoded: ', decoded);

    req.user = decoded; // Assuming the JWT has user information encoded
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Add Recipe Route
app.post('/add-recipe', authenticate, async (req, res) => {
  const { name } = req.body;

  console.log('name: ', name);

  try {
    if (!req.user) {
      return res.status(400).json({ error: 'User authentication failed' });
    }

    const recipe = new Recipe({
      name,
      createdBy: req.user.id // Set the createdBy field to the authenticated user's ID
    });

    await recipe.save();
    res.status(201).json({ success: true, message: 'Recipe added successfully' });
  } catch (error) {
    res.status(500).send('Error in adding recipe: ' + error.message);
  }
});


// Fetch Recipes Route


app.get('/home', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate({
      path: 'createdBy',
      select: 'username' // Selects only the 'username' field from the User model
    });

    console.log('recipes: ', recipes);
    
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send('Error in fetching recipes');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}/login`);
});