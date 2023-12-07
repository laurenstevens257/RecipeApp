const mongoose = require('mongoose');
const fs = require('fs');
const { Recipe } = require('../server/server.js');

// MongoDB connection string
const uri = "mongodb+srv://recipeapp33:recipe123@recipedb.3evocay.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Create and save the recipe
const addRecipe = async (recipeData) => {
    try {
      const recipe = new Recipe(recipeData);
      const savedRecipe = await recipe.save();
      console.log('Recipe added:', savedRecipe);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
    // Disconnect from MongoDB
    mongoose.disconnect();
  };

const addRecipesFromFile = async () => {
    try {
      const data = fs.readFileSync('recipes.json', 'utf8');
      const recipes = JSON.parse(data);
  
      for (const recipeData of recipes) {
        await addRecipe(recipeData);
      }
  
      mongoose.disconnect();
    } catch (error) {
      console.error('Error reading from file:', error);
      mongoose.disconnect();
    }
  };
  
  addRecipesFromFile();


// // Define the recipe data
// const recipeData = {
//   name: 'Delicious Lasagna',
//   cookTime: 45,
//   prepTime: 30,
//   ingredients: [
//     { name: 'Lasagna noodles', quantity: '12', units: 'pieces' },
//     { name: 'Ground beef', quantity: '1', units: 'pound' },
//     { name: 'Ricotta cheese', quantity: '1', units: 'cup' },
//     { name: 'Mozzarella cheese', quantity: '2', units: 'cups' },
//     { name: 'Parmesan cheese', quantity: '1/4', units: 'cup' },
//     { name: 'Tomato sauce', quantity: '24', units: 'ounces' },
//   ],
//   instructions: 'Preheat oven to 375°F. Boil noodles. Layer noodles, meat sauce, and cheese. Repeat layers. Bake for 45 minutes.',
//   tags: ['Italian', 'Pasta', 'Cheese'],
//   createdBy: "65710a43c6767303fb8b83fd"
// };

