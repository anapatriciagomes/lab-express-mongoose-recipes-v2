const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe.model');

const app = express();

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = 'mongodb://127.0.0.1:27017/express-mongoose-recipes-dev';

mongoose
  .connect(MONGODB_URI)
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
  res.send('<h1>LAB | Express Mongoose Recipes</h1>');
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post('/recipes', async (req, res) => {
  const {
    title,
    instructions,
    level,
    ingredients,
    image,
    duration,
    isArchived,
    created,
  } = req.body;

  try {
    const createdRecipe = await Recipe.create({
      title,
      instructions,
      level,
      ingredients,
      image,
      duration,
      isArchived,
      created,
    });

    console.log('Recipe created', createdRecipe);
    res.status(201).send(createdRecipe);
  } catch (error) {
    console.log('Error creating recipe', error);
    res.status(500).send({ error: 'Failed to create recipe' });
  }
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({});

    console.log('All recipes', recipes);

    res.status(200).send(recipes);
  } catch (error) {
    console.log('Error getting all recipes', error);
    res.status(500).send({ error: 'Failed to get all recipes' });
  }
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipe = await Recipe.findById(recipeId);

    console.log('Recipe', recipe);

    res.status(200).send(recipe);
  } catch (error) {
    console.log('Error loading the recipe');

    res.status(500).send({ error: 'Failed to load recipe' });
  }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
      new: true,
    });

    console.log('Recipe update', updatedRecipe);

    res.status(200).send(updatedRecipe);
  } catch (error) {
    console.log('Error updating recipe', error);

    res.status(500).send({ error: 'Failed to update recipe' });
  }
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    console.log('Recipe deleted');

    res.status(204).send();
  } catch (error) {
    console.log('Error deleting recipe', error);

    res.status(500).send({ error: 'Failed to delete recipe' });
  }
});

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
