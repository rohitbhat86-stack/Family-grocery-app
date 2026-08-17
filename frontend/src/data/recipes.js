// The family recipe catalogue.
//
// `ingredients` lists CORE items only — enough to build a useful grocery list.
// For recipes that live behind a link, always open the link for exact amounts and
// the full list. Edit these arrays freely; the grocery list recalculates from them.

export const COURSES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SIDE: 'side',
  SNACK: 'snack',
};

export const RECIPES = [
  // ——— Breakfast ———
  {
    id: 'idli',
    name: 'Soft Idli',
    url: 'https://hebbarskitchen.com/how-to-make-soft-idli-wet-grinder/',
    courses: [COURSES.BREAKFAST],
    ingredients: ['idli rice', 'urad dal', 'fenugreek seeds', 'salt'],
  },
  {
    id: 'mixed-dal-dosa',
    name: 'Mixed Dal Dosa (no rice)',
    url: 'https://www.youtube.com/watch?v=I2w3E3CAqCo',
    note: 'High-protein dosa made without rice.',
    courses: [COURSES.BREAKFAST],
    ingredients: ['chana dal', 'moong dal', 'toor dal', 'urad dal', 'fenugreek seeds', 'salt'],
  },
  {
    id: 'tofu-scramble',
    name: 'South Indian Tofu Scramble',
    courses: [COURSES.BREAKFAST],
    ingredients: ['firm tofu', 'onion', 'tomato', 'turmeric', 'mustard seeds', 'curry leaves', 'green chili'],
  },
  {
    id: 'upma',
    name: 'Upma',
    courses: [COURSES.BREAKFAST],
    ingredients: ['semolina (rava)', 'onion', 'mustard seeds', 'curry leaves', 'green chili', 'ginger', 'cashews'],
  },
  {
    id: 'sajjige-rotti',
    name: 'Sajjige Rotti',
    courses: [COURSES.BREAKFAST],
    ingredients: ['semolina (rava)', 'fresh coconut', 'onion', 'green chili', 'curd', 'coriander'],
  },
  {
    id: 'cabbage-dosa',
    name: 'Cabbage Dosa',
    courses: [COURSES.BREAKFAST],
    ingredients: ['cabbage', 'rice flour', 'semolina (rava)', 'curd', 'green chili', 'coriander'],
  },

  // ——— Mains ———
  {
    id: 'creamy-white-beans-spinach',
    name: 'Creamy White Beans with Spinach',
    url: 'https://www.twopeasandtheirpod.com/creamy-white-beans-with-spinach/',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['white beans', 'spinach', 'garlic', 'onion', 'heavy cream', 'parmesan', 'olive oil', 'lemon'],
  },
  {
    id: 'peanut-noodle-stir-fry',
    name: 'Peanut Noodle Stir Fry with Air-Fried Tofu',
    url: 'https://youtu.be/y8nkIfAYE20',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['noodles', 'firm tofu', 'peanut butter', 'soy sauce', 'garlic', 'ginger', 'lime', 'mixed vegetables'],
  },
  {
    id: 'tempeh-stir-fry',
    name: 'Tempeh Stir Fry',
    url: 'https://www.noracooks.com/tempeh-stir-fry/',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['tempeh', 'bell pepper', 'broccoli', 'soy sauce', 'garlic', 'ginger', 'sesame oil'],
  },
  {
    id: 'vegan-laksa',
    name: 'Vegan Laksa',
    url: 'https://www.lazycatkitchen.com/vegan-laksa/',
    courses: [COURSES.DINNER],
    ingredients: ['rice noodles', 'coconut milk', 'laksa paste', 'tofu puffs', 'bean sprouts', 'lime', 'coriander'],
  },
  {
    id: 'vegetable-lasagna',
    name: 'Vegetable Lasagna',
    url: 'https://cookieandkate.com/best-vegetable-lasagna-recipe/',
    courses: [COURSES.DINNER],
    ingredients: ['lasagna noodles', 'ricotta', 'mozzarella', 'parmesan', 'marinara sauce', 'spinach', 'zucchini', 'bell pepper'],
  },
  {
    id: 'lemon-chickpea-skillet',
    name: 'Lemon Chickpea Skillet',
    url: 'https://theplantbasedschool.com/chickpea-lemon-skillet/',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['chickpeas', 'lemon', 'garlic', 'spinach', 'onion', 'olive oil'],
  },
  {
    id: 'brown-rice-risotto',
    name: 'Baked Brown Rice Risotto with Peas and Zucchini',
    url: 'https://www.yummytoddlerfood.com/easy-baked-brown-rice-risotto-with-peas-and-zucchini/',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['brown rice', 'peas', 'zucchini', 'parmesan', 'vegetable broth', 'onion'],
  },
  {
    id: 'black-pepper-tofu',
    name: 'Black Pepper Tofu with Green Beans',
    url: 'https://shortgirltallorder.com/black-pepper-tofu-green-beans',
    courses: [COURSES.DINNER],
    ingredients: ['firm tofu', 'green beans', 'black pepper', 'soy sauce', 'garlic', 'ginger', 'cornstarch'],
  },
  {
    id: 'peanut-fried-rice',
    name: 'Vegetable Peanut Fried Rice',
    url: 'https://domesticgothess.com/blog/2020/04/05/vegetable-peanut-fried-rice/',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['cooked rice', 'peanuts', 'mixed vegetables', 'soy sauce', 'garlic', 'spring onion'],
  },
  {
    id: 'white-bean-stew',
    name: 'Cozy White Bean Stew',
    url: 'https://frommybowl.com/cozy-white-bean-stew/',
    courses: [COURSES.DINNER],
    ingredients: ['white beans', 'carrot', 'celery', 'onion', 'garlic', 'vegetable broth', 'kale'],
  },
  {
    id: 'mushroom-corn-pasta',
    name: 'Mushroom Corn Pasta',
    url: 'https://delightfulplate.com/mushroom-corn-pasta/',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['pasta', 'mushrooms', 'sweetcorn', 'garlic', 'cream', 'parmesan'],
  },
  {
    id: 'quesadilla',
    name: 'Cheese and Black Bean Quesadilla',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['tortillas', 'black beans', 'cheddar cheese', 'onion', 'bell pepper', 'cumin'],
  },
  {
    id: 'arancini',
    name: 'Vegetarian Arancini Balls',
    courses: [COURSES.DINNER, COURSES.SNACK],
    ingredients: ['arborio rice', 'mozzarella', 'parmesan', 'breadcrumbs', 'eggs', 'vegetable broth'],
  },
  {
    id: 'yellow-dal',
    name: 'Yellow Dal',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['toor dal', 'turmeric', 'tomato', 'onion', 'garlic', 'cumin seeds', 'ghee'],
  },
  {
    id: 'mixed-dal',
    name: 'Mixed Dal',
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: ['toor dal', 'moong dal', 'chana dal', 'masoor dal', 'turmeric', 'tomato', 'onion', 'cumin seeds'],
  },

  // ——— Sides ———
  {
    id: 'roasted-cauliflower-salad',
    name: 'Roasted Cauliflower Salad',
    url: 'https://www.halfbakedharvest.com/roasted-cauliflower-salad/',
    courses: [COURSES.SIDE, COURSES.LUNCH],
    ingredients: ['cauliflower', 'olive oil', 'lemon', 'feta', 'mixed herbs', 'pomegranate'],
  },
  {
    id: 'smashed-potatoes',
    name: 'Crispy Smashed Potatoes',
    url: 'https://cookieandkate.com/crispy-smashed-potatoes-recipe/',
    courses: [COURSES.SIDE],
    ingredients: ['baby potatoes', 'olive oil', 'salt', 'mixed herbs'],
  },
  {
    id: 'parmesan-cauliflower',
    name: 'Parmesan Roasted Cauliflower',
    url: 'https://twokooksinthekitchen.com/parmesan-roasted-cauliflower/',
    courses: [COURSES.SIDE],
    ingredients: ['cauliflower', 'parmesan', 'olive oil', 'garlic'],
  },
  {
    id: 'dijon-sweet-potatoes',
    name: 'Dijon Roasted Mini Sweet Potatoes',
    url: 'https://www.seasonsandsuppers.ca/dijon-roasted-mini-sweet-potatoes/',
    courses: [COURSES.SIDE],
    ingredients: ['mini sweet potatoes', 'dijon mustard', 'olive oil', 'mixed herbs'],
  },
  {
    id: 'broccoli-cauliflower-bake',
    name: 'Broccoli Cauliflower Bake',
    url: 'https://girlheartfood.com/broccoli-cauliflower-bake/',
    courses: [COURSES.SIDE, COURSES.DINNER],
    ingredients: ['broccoli', 'cauliflower', 'cheddar cheese', 'cream', 'breadcrumbs', 'butter'],
  },
  {
    id: 'raita',
    name: 'Raita',
    courses: [COURSES.SIDE],
    ingredients: ['yogurt', 'cucumber', 'onion', 'cumin powder', 'coriander'],
  },

  // ——— Snacks ———
  {
    id: 'chickpea-sundal',
    name: 'Chickpea Sundal',
    url: 'https://cookilicious.com/chickpeas-sundal-vegan-snack/',
    courses: [COURSES.SNACK],
    ingredients: ['chickpeas', 'fresh coconut', 'mustard seeds', 'curry leaves', 'green chili', 'asafoetida'],
  },
  {
    id: 'date-balls',
    name: 'Date Balls',
    url: 'https://www.loveandlemons.com/date-balls/',
    courses: [COURSES.SNACK],
    ingredients: ['dates', 'almonds', 'rolled oats', 'cocoa powder', 'salt'],
  },

  // ——— Saved links that still need a name ———
  // Instagram requires a login, so the dish name could not be read automatically.
  // Open the link, then replace `name` and fill in `ingredients`.
  {
    id: 'instagram-reel-1',
    name: 'Untitled Instagram recipe (1)',
    url: 'https://www.instagram.com/reel/DWXUsG6j1eR/',
    needsName: true,
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: [],
  },
  {
    id: 'instagram-reel-2',
    name: 'Untitled Instagram recipe (2)',
    url: 'https://www.instagram.com/reel/Da0JrC0T5BJ/',
    needsName: true,
    courses: [COURSES.LUNCH, COURSES.DINNER],
    ingredients: [],
  },
];

export const RECIPES_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export const getRecipe = (id) => RECIPES_BY_ID[id] || null;

/** Recipes that suit a given meal, listed first, then everything else. */
export function recipesForCourse(course) {
  const suited = RECIPES.filter((r) => r.courses.includes(course));
  const rest = RECIPES.filter((r) => !r.courses.includes(course));
  const byName = (a, b) => a.name.localeCompare(b.name);
  return { suited: suited.sort(byName), rest: rest.sort(byName) };
}

const GROCERY_CATEGORIES = [
  ['Produce', ['onion', 'tomato', 'spinach', 'cabbage', 'cauliflower', 'broccoli', 'zucchini', 'potato', 'sweet potato', 'carrot', 'celery', 'kale', 'green bean', 'bell pepper', 'mushroom', 'cucumber', 'lemon', 'lime', 'ginger', 'garlic', 'chili', 'curry leaves', 'coriander', 'herbs', 'spring onion', 'bean sprouts', 'peas', 'sweetcorn', 'coconut', 'pomegranate', 'dates', 'vegetables']],
  ['Dairy & Eggs', ['cheese', 'mozzarella', 'parmesan', 'ricotta', 'feta', 'cream', 'butter', 'ghee', 'curd', 'yogurt', 'eggs']],
  ['Protein', ['tofu', 'tempeh', 'beans', 'chickpeas', 'dal', 'peanuts', 'almonds']],
  ['Grains & Pantry', ['rice', 'noodles', 'pasta', 'semolina', 'flour', 'breadcrumbs', 'tortillas', 'oats', 'lasagna']],
  ['Spices & Condiments', ['turmeric', 'mustard', 'cumin', 'fenugreek', 'asafoetida', 'salt', 'pepper', 'soy sauce', 'peanut butter', 'laksa paste', 'marinara', 'broth', 'coconut milk', 'olive oil', 'sesame oil', 'cornstarch', 'cocoa']],
];

export function categorizeIngredient(ingredient) {
  const lower = ingredient.toLowerCase();
  for (const [category, keywords] of GROCERY_CATEGORIES) {
    if (keywords.some((k) => lower.includes(k))) return category;
  }
  return 'Other';
}

export const GROCERY_CATEGORY_ORDER = [...GROCERY_CATEGORIES.map(([c]) => c), 'Other'];
