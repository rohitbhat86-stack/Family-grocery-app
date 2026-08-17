const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs/promises');
const { existsSync } = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// The week's plan lives in a JSON file so the cook loads the same menu the
// planner saved, from any device. No database needed for a single household.
const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

const client = new Anthropic();

const MODEL = 'claude-opus-5';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        error: 'The server is missing ANTHROPIC_API_KEY. Copy backend/.env.example to backend/.env and add your key.',
      });
    }

    const recipeNames = sampleRecipes.map(r => r.name);

    const prompt = `You are a nutritional meal planner. Based on these vegetarian recipes that a person loves eating, suggest a balanced 7-day weekly menu.

RECIPES THE USER LOVES:
${sampleRecipes.map(r => `- ${r.name} (${r.protein}g protein, ${r.prepTime} min)`).join('\n')}

NUTRITION TARGETS:
- Daily protein: ${userPrefs.dailyProtein}g
- Daily calories: ${userPrefs.dailyCalories}
- Dietary: Vegetarian only

CONSTRAINTS:
1. Each day gets exactly one recipe
2. Vary recipes throughout the week (no repeats)
3. Aim for the daily protein target
4. Mix quick and longer meals across the week
5. Balance flavors (Indian, wraps, curries, simple meals)`;

    // Structured outputs guarantee a parseable response and constrain each day to a
    // real recipe name, so the frontend's lookup by name can never miss.
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      output_config: {
        effort: 'low',
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: Object.fromEntries(
              DAYS.map(day => [day, { type: 'string', enum: recipeNames }])
            ),
            required: DAYS,
            additionalProperties: false,
          },
        },
      },
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content.find(block => block.type === 'text')?.text;
    if (!text) {
      throw new Error(`Model returned no text (stop_reason: ${message.stop_reason})`);
    }

    const byDay = JSON.parse(text);
    const menu = DAYS.map(day => byDay[day]);

    res.json({ menu });
  } catch (error) {
    // Full detail to the server log; a short, actionable line to the browser.
    console.error('Error suggesting menu:', error);
    const status = error?.status && error.status >= 400 ? error.status : 500;
    res.status(status).json({
      error: 'Failed to generate menu suggestions',
      detail: describeError(error),
    });
  }
});

function describeError(error) {
  switch (error?.status) {
    case 401:
    case 403:
      return "The server's ANTHROPIC_API_KEY was rejected. Check the key in backend/.env.";
    case 429:
      return 'Rate limited by the Anthropic API. Wait a moment and try again.';
    case 529:
      return 'The Anthropic API is temporarily overloaded. Try again shortly.';
    default:
      if (error?.status >= 500) return 'The Anthropic API had a server error. Try again shortly.';
      return error?.message || String(error);
  }
}

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

app.get('/api/menu', async (req, res) => {
  try {
    const raw = await fs.readFile(MENU_FILE, 'utf8');
    res.json(JSON.parse(raw));
  } catch (error) {
    // No plan saved yet is the normal first-run state, not an error.
    if (error.code === 'ENOENT') return res.json(null);
    console.error('Error reading menu:', error);
    res.status(500).json({ error: 'Could not read the saved menu.' });
  }
});

app.put('/api/menu', async (req, res) => {
  try {
    const week = req.body;
    if (!week || typeof week !== 'object' || typeof week.days !== 'object') {
      return res.status(400).json({ error: 'Expected a week object with a "days" field.' });
    }

    await fs.mkdir(DATA_DIR, { recursive: true });
    // Write to a temp file then rename, so an interrupted save can't leave
    // a half-written menu.json behind.
    const tmp = `${MENU_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(week, null, 2), 'utf8');
    await fs.rename(tmp, MENU_FILE);

    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving menu:', error);
    res.status(500).json({ error: 'Could not save the menu.' });
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

// In production this one service serves the built React app as well as the API,
// so the calendar and /api share an origin — no second service, no CORS, and no
// REACT_APP_API_URL to keep in sync. In local dev the build folder doesn't exist
// and the CRA dev server on :3000 handles the UI instead.
const FRONTEND_BUILD = path.join(__dirname, '..', 'frontend', 'build');

if (existsSync(FRONTEND_BUILD)) {
  app.use(express.static(FRONTEND_BUILD));

  // Any non-API route is a client-side route — hand back index.html and let
  // React render it. Registered after the API routes so it can't shadow them.
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
  });

  console.log('Serving frontend build from', FRONTEND_BUILD);
} else {
  console.log('No frontend build found — API only (run the CRA dev server for the UI)');
}

// 5000 is occupied by macOS Control Center (AirPlay Receiver), so default to 5050.
// Hosts like Render inject their own PORT, so this only affects local dev.
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
