const fs = require('fs');

const recipeTextToJSON = (filePath) => {
  const textData = fs.readFileSync(filePath, 'utf8');
  const lines = textData.split('\n');
  const recipes = lines.map(line => {
    const [name, cookTime, prepTime, numIngredients, ingredientsString, instructions, tagsString] = line.split('_');

    //Split ingredientsString by ','
    const allIngredientsData = ingredientsString.split('&');
    console.log(allIngredientsData);

    //Iterate through the data for each individual ingredient
    const ingredients = [];
    const ingredientData = [];
    for (let i = 0; i < numIngredients; i++) {
        ingredientData.push(allIngredientsData[i].split('|'));
        const ingredientName = ingredientData[i][0];
        const quantity = parseInt(ingredientData[i][1]);
        const units = ingredientData[i][2];

        ingredients.push({
            name: ingredientName.trim(),
            quantity,
            units: units.trim()
        });
        
    }

    console.log(ingredients);

    // Split rawTags by ','
    const tags = tagsString.split(',').map(tag => tag.trim()); // Trim whitespace

    return {
      name,
      cookTime: parseInt(cookTime),
      prepTime: parseInt(prepTime),
      ingredients,
      instructions,
      tags,
      createdBy: "6573cf093c0311ebc13fc3a8", //Chef-Khovsgun
      flavedBy: [],
      __v: 0,
    };
  });

  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2));
};

recipeTextToJSON('./recipeText.txt');