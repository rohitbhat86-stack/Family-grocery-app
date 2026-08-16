const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic();

const sampleRecipes = [
  { name: 'Besan Chilla', servings: 2, prepTime: 15, ingredients: ['besan (gram flour)', 'onion', 'green chili', 'salt'], protein: 12 },
  { name: 'Omelette / Masala Omelette', servings: 2, prepTime: 10, ingredients: ['eggs', 'onion', 'tomato', 'green chili'], protein: 18 },
  { name: 'Moong Dal Chilla', servings: 2, prepTime: 20, ingredients: ['moong dal', 'onion', 'ginger', 'green chili'], protein: 14 },
  { name: 'Wraps with Tofu', servings: 2, prepTime: 15, ingredients: ['tofu', 'lettuce', 'tomato', 'cucumber', 'dressing'], protein: 16 },
  { name: 'Homemade Paneer Tikka Wrap', servings: 2, prepTime: 25, ingredients: ['paneer', 'yogurt', 'spices', 'whole wheat wrap'], protein: 20 },
  { name: 'NY Times Chickpea Stew', servings: 4, prepTime: 30, ingredients: ['chickpeas', 'tomato', 'onion', 'garlic', 'spices'], protein: 15 },
  { name: 'Thai Green Curry', servings: 3, prepTime: 25, ingredients: ['coconut milk', 'green curry paste', 'vegetables', 'tofu'], protein: 12 },
  { name: 'Spinach Paneer Curry', servings: 3, prepTime: 30, ingredients: ['paneer', 'spinach', 'tomato', 'cream', 'spices'], protein: 18 },
  { name: 'Dosa', servings: 2, prepTime: 20, ingredients: ['rice flour', 'urad dal', 'fenugreek', 'salt'], protein: 8 },
];

app.post('/api/suggest-menu', async (req, res) => {
  try {
    const { userPrefs } = req.body;

    const prompt = `You are a nutritional meal planner. Based on these vegetarian recipes that a person loves eating, suggest a balanced 7-day weekly menu.

RECIPES THE USER LOVES:
${sampleRecipes.map(r => `- ${r.name} (${r.protein}g protein, ${r.prepTime} min)`).join('\n')}

NUTRITION TARGETS:
- Daily protein: ${userPrefs.dailyProtein}g
- Daily calories: ${userPrefs.dailyCalories}
- Dietary: Vegetarian only

CONSTRAINTS:
1. Each day should have one recipe
2. Vary recipes throughout the week (no repeats)
3. Aim for daily protein target
4. Consider prep time (mix quick and longer meals)
5. Balance flavors (Indian, wraps, curries, simple meals)

Respond with ONLY a JSON array of 7 recipe names, one per day (Monday-Sunday). Example format:
["Besan Chilla", "Omelette / Masala Omelette", "Wraps with Tofu", ...]

NO OTHER TEXT.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text.trim();
    const menu = JSON.parse(responseText);

    res.json({ menu });
  } catch (error) {
    console.error('Error suggesting menu:', error);
    res.status(500).json({ error: 'Failed to generate menu suggestions' });
  }
});

app.post('/api/shopping-list', async (req, res) => {
  try {
    const { selectedRecipes } = req.body;

    const ingredientMap = {};
    selectedRecipes.forEach(recipeName => {
      const recipe = sampleRecipes.find(r => r.name === recipeName);
      if (recipe) {
        recipe.ingredients.forEach(ingredient => {
          ingredientMap[ingredient] = (ingredientMap[ingredient] || 0) + 1;
        });
      }
    });

    const shoppingList = Object.entries(ingredientMap).map(([ingredient, count]) => ({
      ingredient,
      quantity: count,
      category: categorizeIngredient(ingredient),
    }));

    res.json({ shoppingList });
  } catch (error) {
    console.error('Error generating shopping list:', error);
    res.status(500).json({ error: 'Failed to generate shopping list' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running' });
});

function categorizeIngredient(ingredient) {
  const dairy = ['paneer', 'yogurt', 'cream', 'cheese'];
  const proteins = ['eggs', 'tofu', 'chickpeas', 'moong dal', 'urad dal'];
  const vegetables = ['onion', 'tomato', 'lettuce', 'cucumber', 'spinach', 'green chili', 'garlic'];
  const grains = ['rice flour', 'besan', 'whole wheat wrap'];

  if (dairy.some(d => ingredient.toLowerCase().includes(d))) return 'Dairy';
  if (proteins.some(p => ingredient.toLowerCase().includes(p))) return 'Proteins & Legumes';
  if (vegetables.some(v => ingredient.toLowerCase().includes(v))) return 'Vegetables';
  if (grains.some(g => ingredient.toLowerCase().includes(g))) return 'Grains & Flours';
  return 'Other';
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
