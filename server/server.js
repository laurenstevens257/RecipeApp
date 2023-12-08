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
  tags: [String],
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

//exports for scripting
module.exports = { User, Recipe };

//Token generator
function generateToken(user) {
  const tokenPayload = { id: user._id, username: user.username };
  return jwt.sign(tokenPayload, 'your_jwt_secret', { expiresIn: '1h' }); // Replace 'your_jwt_secret' with your actual secret key
}

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === '' || password === '') {
      return res.status(401).json({
        error: 'Please enter a username and password',
        success: false
      });
    }

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      const randNum = Math.floor(100 + Math.random() * 900);
      const suggestUsername = `${username}${randNum}`;
      return res.status(400).json({
        error: `Username taken. Maybe try ${suggestUsername}?`,
        success: false
      });
    }

    const passwordPolicyRegex = {
      number: /(?=.*\d)/,
      upperCase: /(?=.*[A-Z])/,
      lowerCase: /(?=.*[a-z])/,
      specialChar: /(?=.*[!@#$%^&*])/,
      noSpaces: /^(?!.*\s).*$/
    };

    let errors = [];

    if (password.length < 8) {
      errors.push("Too short: need 8 characters");
    }
    if(password.length > 20) {
      errors.push("Too long: max 20 characters");
    }

    if (!passwordPolicyRegex.number.test(password)) {
      errors.push("Include at least one number");
    }
    if (!passwordPolicyRegex.upperCase.test(password)) {
      errors.push("Include at least one uppercase letter");
    }
    if (!passwordPolicyRegex.lowerCase.test(password)) {
      errors.push("Include at least one lowercase letter");
    }
    if (!passwordPolicyRegex.specialChar.test(password)) {
      errors.push("Include at least one special character (!@#$%^&*)");
    }
    if (!passwordPolicyRegex.noSpaces.test(password)) {
      errors.push("No spaces allowed");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        error: "Password errors: " + errors.join("; "),
        success: false
      });
    }

    // Hashing the password with Argon2id
    const hash = await argon2.hash(password, { type: argon2.argon2id });

    // Create new user
    user = new User({ username, password: hash });
    await user.save();

    // Generate token
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
        console.log('invalid username');
        return res.status(400).json({
            error: 'This username does not exist',
            success: false
        });
    }

    // Verifying the provided password with the stored hash
      if (!(await argon2.verify(user.password, password))) {

        console.log('wrong password');
        return res.status(400).json({
            error: 'Incorrect password',
            success: false
        });
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

  
  if (!token) {
    console.log('token messed up');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // console.log('checkpoint');
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your secret key
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

//Delete Recipe Route
app.delete('/delete-recipe/:id', authenticate, async (req, res) => {
  try {
    const recipeId = req.params.id;
    console.log('Recipe ID to delete:', recipeId);

    const recipe = await Recipe.findById(recipeId);
    console.log('Recipe found:', recipe);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    console.log('Recipe createdBy:', recipe.createdBy);
    console.log('User ID:', req.user.id);

    //945532 - should not be necessary because delete doesn't render at all unless you own it.
    // Check if the logged-in user is the creator of the recipe
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized to delete this recipe');
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(recipeId); //Note that .remove() does not work! Deprecated in newer versions of Mongo.
    console.log('Recipe removed successfully');
    res.status(200).send({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error in delete route:', error);
    res.status(500).send('Server error');
  }
});


// Fetch Recipes Route - Modified to support search functionality
app.get('/home', authenticate, async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id }).populate({
      path: 'createdBy',
      select: 'username'
    });

    const aggregatedRecipes = await Recipe.aggregate([
      { $match: { _id: { $in: recipes.map(r => r._id) } } },
      { $addFields: { flavedByCount: { $size: "$flavedBy" } } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: "$creator" },
      {
        $addFields: {
          likedByUser: {
            $in: ["$_id", "$creator.likedRecipes"]
          }
        }
      },
      { $sort: { flavedByCount: -1 } },
      { $project: { 'creator.password': 0, 'creator.likedRecipes': 0, 'creator.groceryList': 0 } }
    ]);

    res.status(200).json(aggregatedRecipes);
  } catch (error) {
    res.status(500).send('Error in fetching recipes');
  }
});

//Search Route
app.get('/search', authenticate, async (req, res) => {
  const { search, searchByUser,  searchByTags} = req.query;

  try {
    let query = {};
    if (searchByUser === 'true') {
      console.log('user search');
      // Search by User
      const users = await User.find({ username: { $regex: search, $options: 'i' } });
      const userIds = users.map(user => user._id);
      query.createdBy = { $in: userIds };
    } else if (searchByTags === 'true'){
      console.log('tag search');
      query.tags = { $regex: search, $options: 'i' };
    } else {
      console.log('name search');
      // Search by Recipe Name
      query.name = { $regex: search, $options: 'i' };
    }

    // const recipes = await Recipe.find(query).populate('createdBy', 'username');
    let recipes = await Recipe.find(query).lean();

    recipes = await Recipe.aggregate([
      { $match: { _id: { $in: recipes.map(r => r._id) } } },
      { $addFields: { flavedByCount: { $size: "$flavedBy" } } },
      { $sort: { flavedByCount: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      { $unwind: "$createdBy" }, // if createdBy is always one user, we can unwind it
      { $project: { 'createdBy.password': 0, 'createdBy.groceryList': 0 } }
    ]);

    const user = await User.findById(req.user.id);
    const likedRecipes = user.likedRecipes.map(id => id.toString());

    const isLikedArray = recipes.map(recipe => likedRecipes.includes(recipe._id.toString()));

    // Pair each recipe with its 'liked' status
    const recipesWithLikeStatus = recipes.map((recipe, index) => {
      return { ...recipe, likedByUser: isLikedArray[index] };
    });

    //console.log('recipes: ', recipes);

    res.status(200).json(recipesWithLikeStatus);
  } catch (error) {
    res.status(500).send('Error in fetching recipes');
  }
});

//Flave Route
app.post('/flave-recipe', authenticate, async (req, res) => {
  try {
    const { recipe } = req.body;

    let recipeToModify = await Recipe.findById(recipe._id);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipeIndex = user.likedRecipes.indexOf(recipeToModify._id);
    const userIndex = recipeToModify.flavedBy.indexOf(user._id);

    if (recipeIndex === -1) {
      user.likedRecipes.push(recipeToModify._id); // Append only if not already liked
      if(userIndex === -1){
        recipeToModify.flavedBy.push(user._id);
      }

      console.log('checkpoint');

      await recipeToModify.save();
      await user.save();

      console.log('recipe: ', recipeToModify);

      recipeToModify = await Recipe.aggregate([
        { $match: { _id: recipeToModify._id } },
        { $addFields: { flavedByCount: { $size: "$flavedBy" }, likedByUser: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
          }
        },
        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        { $project: { 'createdBy.password': 0, 'createdBy.groceryList': 0 } }
      ]);
      
      console.log('final: ', recipeToModify);

      res.status(200).json(recipeToModify);
      
    } else {

      user.likedRecipes.splice(recipeIndex, 1);
      console.log('uIndex: ', userIndex);

      if(userIndex !== -1){
        recipeToModify.flavedBy.splice(userIndex, 1);
      }

      await recipeToModify.save();
      await user.save(); // Save the user with the updated likedRecipes

      console.log('ch2');

      recipeToModify = await Recipe.aggregate([
        { $match: { _id: recipeToModify._id } },
        { $addFields: { flavedByCount: { $size: "$flavedBy" }, likedByUser: false } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
          }
        },
        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        { $project: { 'createdBy.password': 0, 'createdBy.groceryList': 0 } }
      ]);

      console.log('final: ', recipeToModify);
      res.status(200).json(recipeToModify);

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

      const likedRecipesWithFlaves = await Recipe.aggregate([
        { $match: { _id: { $in: user.likedRecipes.map(r => r._id) } } },
        { $addFields: { flavedByCount: { $size: "$flavedBy" }, likedByUser: true } },
        { $sort: { flavedByCount: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
          }
        },
        { $unwind: "$createdBy" }, // if createdBy is always one user, we can unwind it
        { $project: { 'createdBy.password': 0, 'createdBy.groceryList': 0 } }
      ]);

      // Respond with the populated list of liked recipes
      res.json(likedRecipesWithFlaves);
  } catch (error) {
      console.error('Error fetching favorite recipes:', error);
      res.status(500).json({ message: 'Error fetching favorite recipes' });
  }
});

// Route to update the user's grocery list
app.post('/user/update-grocerylist', authenticate, async (req, res) => {
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
app.get('/user/get-grocerylist', authenticate, async (req, res) => {
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

//add to grocery list from recipe
app.post('/user/add-to-grocerylist', authenticate, async (req, res) => {

  try{
    const { recipeID } = req.body;
    const recipe = await Recipe.findById(recipeID);

    console.log('recipe: ', recipe);

    const user = await User.findById(req.user.id);

    console.log('user: ', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const ingredients = recipe.ingredients;
  
    recipe.ingredients.forEach(ingredient => {  //add any ingredients not in groceryList already
      const ingredientText = `${ingredient.name} - ${ingredient.quantity} ${ingredient.units}`;
    //   const found = user.groceryList.some(item => item.text === ingredientText);
  
    //   if (!found) {
      user.groceryList.push({ text: ingredientText, checked: false });
    //   }
      });

    // 945532
    // concious choice to alow duplication, multiple recipe ingredients added to cart => need more of that ingredient

    console.log('finalUser: ', user);
  
    await user.save();
    res.status(200).json({ message: 'Grocery list updated' });  
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grocery list' });
  }

});

//Get random recipe
app.get('/random-recipe', authenticate, async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    const random = Math.floor(Math.random() * count);

    let randomRecipe = await Recipe.findOne().skip(random).populate({
      path: 'createdBy',
      select: 'username'
    });

    console.log(randomRecipe);

    const user = await User.findById(req.user.id);

    console.log(user);

    const isLiked = user.likedRecipes.includes(randomRecipe._id);

    console.log('isliked? ', isLiked);

    randomRecipe = await Recipe.aggregate([
      { $match: { _id: randomRecipe._id } },
      { $addFields: { flavedByCount: { $size: "$flavedBy" }, likedByUser: isLiked } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      { $unwind: "$createdBy" },
      { $project: { 'createdBy.password': 0, 'createdBy.groceryList': 0 } }
    ]);

    console.log('randomRecipe');

    res.json(randomRecipe);
    
  } catch (error) {
    res.status(500).send('Error fetching random recipe');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});