// //const MongoClient = require('mongodb').MongoClient;
// const express = require('express');
// const cors = require('cors')
// const app = express();

// const connection_str = "mongodb+srv://haykgargaloyan:P@5w0rd!@recipedb.jhisujg.mongodb.net/?retryWrites=true&w=majority";

// app.use(cors());
// app.use(express.json());

// /////////////////////////////all new for mongodb stuff//////////////////////////////////////////////
// /*const uri = 'mongodb://localhost:27017/recipesdb';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Connect to MongoDB
// client.connect()
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//   });

// // we need to define a collection for the database to handle:
// // example of syntax where database name is recipesdb and collection is called recipes:
// // const recipesCollection = client.db('recipesdb').collection('recipes');

// //then below are the api endpoints, get and post but i think we need to sort these out together*/
// /////////////////////////////////////////////////////////////////////////////////////////////////////////


// const userCredentials = new Map();

// app.post('/signup', (req, res) => {

//   const { username, password } = req.body;
//   console.log(username);
//   console.log(password);

//   if(!(username === '' || password === '')){  
//     if (userCredentials.has(username)) {
//         console.log('username already exists');
//         res.status(400).json({ error: 'Username already exists', success: false });
//     } else {
//         userCredentials.set(username, password);
//         console.log('username DNE');
//         res.send({ token: 'test123', success: true });
//     }
//   }
// });

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   console.log(username);
//   console.log(password)

//   if(userCredentials.get(username) == password){
//     res.send({
//       token: 'test321',
//       success: true
//     });
//   }
//   else{
//     console.log('failed login')
//     res.status(400).json({ error: 'incorrect password', success: false });
//   }
// });

// //Set up endpoints for adding recipes and viewing them
// let recipes = []; //to store recipes

// //endpoint for adding recipes
// app.post('/recipe', (req, res) => {   //RENAME THIS
//   const recipeName = req.body.name;
//   recipes.push(recipeName);
//   console.log(recipes);
//   res.status(201).send({message: 'Recipe added: ${recipeName}', success: true});
// });

// //endpoint for retrieving recipes to view them
// app.get('/recipe-list', (req, res) => {
//   res.json(recipes);
// });

// app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://recipeapp33:recipe123@recipedb.3evocay.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

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
  ingredients: [String],
  instructions: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
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
    user = new User({ username, password });
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
    if (!user || user.password !== password) {
      return res.status(400).send('Invalid Credentials');
    }
    res.send({ token: 'generated-token', success: true }); // Implement token validation
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Add Recipe Route
app.post('/addrecipe', async (req, res) => {
    // Implement route to add a recipe
});

// Fetch Recipes Route
app.get('/recipes', async (req, res) => {
  // Implement route to get recipes
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}/login`);
});
