import React, { useState, useEffect } from 'react';
import { ChefHat, ShoppingCart, Menu, Settings, LogOut, Eye } from 'lucide-react';

const sampleRecipes = [
  { id: 1, name: 'Besan Chilla', servings: 2, prepTime: 15, ingredients: ['besan (gram flour)', 'onion', 'green chili', 'salt'], protein: 12 },
  { id: 2, name: 'Omelette / Masala Omelette', servings: 2, prepTime: 10, ingredients: ['eggs', 'onion', 'tomato', 'green chili'], protein: 18 },
  { id: 3, name: 'Moong Dal Chilla', servings: 2, prepTime: 20, ingredients: ['moong dal', 'onion', 'ginger', 'green chili'], protein: 14 },
  { id: 4, name: 'Wraps with Tofu', servings: 2, prepTime: 15, ingredients: ['tofu', 'lettuce', 'tomato', 'cucumber', 'dressing'], protein: 16 },
  { id: 5, name: 'Homemade Paneer Tikka Wrap', servings: 2, prepTime: 25, ingredients: ['paneer', 'yogurt', 'spices', 'whole wheat wrap'], protein: 20 },
  { id: 6, name: 'NY Times Chickpea Stew', servings: 4, prepTime: 30, ingredients: ['chickpeas', 'tomato', 'onion', 'garlic', 'spices'], protein: 15 },
  { id: 7, name: 'Thai Green Curry', servings: 3, prepTime: 25, ingredients: ['coconut milk', 'green curry paste', 'vegetables', 'tofu'], protein: 12 },
  { id: 8, name: 'Spinach Paneer Curry', servings: 3, prepTime: 30, ingredients: ['paneer', 'spinach', 'tomato', 'cream', 'spices'], protein: 18 },
  { id: 9, name: 'Dosa', servings: 2, prepTime: 20, ingredients: ['rice flour', 'urad dal', 'fenugreek', 'salt'], protein: 8 },
];

const GroceryApp = () => {
  const [view, setView] = useState('menu');
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('planner');
  const [weeklyMenu, setWeeklyMenu] = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null,
  });
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [suggestedMenu, setSuggestedMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPrefs, setUserPrefs] = useState({
    dailyProtein: 150,
    dailyCalories: 2100,
    dietaryRestrictions: 'vegetarian',
  });

  useEffect(() => {
    setRecipes(sampleRecipes);
    setUser({ name: 'Rohit', email: 'rohit@example.com' });
  }, []);

  const categorizeIngredient = (ingredient) => {
    const dairy = ['paneer', 'yogurt', 'cream', 'cheese'];
    const proteins = ['eggs', 'tofu', 'chickpeas', 'moong dal', 'urad dal'];
    const vegetables = ['onion', 'tomato', 'lettuce', 'cucumber', 'spinach', 'green chili', 'garlic'];
    const grains = ['rice flour', 'besan', 'whole wheat wrap'];

    if (dairy.some(d => ingredient.toLowerCase().includes(d))) return 'Dairy';
    if (proteins.some(p => ingredient.toLowerCase().includes(p))) return 'Proteins & Legumes';
    if (vegetables.some(v => ingredient.toLowerCase().includes(v))) return 'Vegetables';
    if (grains.some(g => ingredient.toLowerCase().includes(g))) return 'Grains & Flours';
    return 'Other';
  };

  const generateShoppingList = () => {
    const selectedRecipes = Object.values(weeklyMenu).filter(r => r);
    if (selectedRecipes.length === 0) {
      alert('Select recipes first');
      return;
    }

    const ingredientMap = {};
    selectedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        ingredientMap[ingredient] = (ingredientMap[ingredient] || 0) + 1;
      });
    });

    const list = Object.entries(ingredientMap).map(([ingredient, count]) => ({
      ingredient,
      quantity: count,
      category: categorizeIngredient(ingredient),
      checked: false,
    }));

    setShoppingList(list.sort((a, b) => a.category.localeCompare(b.category)));
  };

  const getSuggestedMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/suggest-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRecipes: sampleRecipes,
          userPrefs,
        }),
      });
      const data = await response.json();
      setSuggestedMenu(data.menu);
    } catch (error) {
      console.error('Error fetching menu suggestions:', error);
      alert('Could not get AI suggestions. Check backend is running.');
    }
    setLoading(false);
  };

  const applyMenu = (menu) => {
    const newMenu = { ...weeklyMenu };
    menu.forEach((item, index) => {
      const day = Object.keys(weeklyMenu)[index];
      newMenu[day] = recipes.find(r => r.name === item);
    });
    setWeeklyMenu(newMenu);
    setSuggestedMenu(null);
  };

  const toggleShoppingItem = (index) => {
    const updated = [...shoppingList];
    updated[index].checked = !updated[index].checked;
    setShoppingList(updated);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole('planner');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <ChefHat className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-2xl font-bold text-center mb-6">Family Meal Planner</h1>
          
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            <input type="password" placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            <button onClick={() => setUser({ name: 'Rohit', email: 'rohit@example.com' })} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition">
              Login as Planner
            </button>
            <button onClick={() => { setUser({ name: 'Cook', email: 'cook@example.com' }); setUserRole('cook'); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
              Login as Cook (Read-only)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold">Family Meal Planner</h1>
            <span className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${userRole === 'planner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {userRole === 'planner' ? 'Planner' : 'Cook (Read-Only)'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {userRole === 'planner' ? (
            <>
              <button onClick={() => setView('menu')} className={`px-4 py-3 font-semibold border-b-2 transition ${view === 'menu' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}>
                <Menu className="w-4 h-4 inline mr-2" /> Weekly Menu
              </button>
              <button onClick={() => setView('recipes')} className={`px-4 py-3 font-semibold border-b-2 transition ${view === 'recipes' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}>
                Recipes
              </button>
              <button onClick={() => setView('shopping')} className={`px-4 py-3 font-semibold border-b-2 transition ${view === 'shopping' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}>
                <ShoppingCart className="w-4 h-4 inline mr-2" /> Shopping List
              </button>
              <button onClick={() => setView('settings')} className={`px-4 py-3 font-semibold border-b-2 transition ${view === 'settings' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'}`}>
                <Settings className="w-4 h-4 inline mr-2" /> Settings
              </button>
            </>
          ) : (
            <button onClick={() => setView('cook')} className={`px-4 py-3 font-semibold border-b-2 transition ${view === 'cook' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>
              <Eye className="w-4 h-4 inline mr-2" /> Today's Menu
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'menu' && userRole === 'planner' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Weekly Menu Planner</h2>
              <button onClick={getSuggestedMenu} disabled={loading} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50">
                {loading ? 'Generating...' : 'AI Suggestions'}
              </button>
            </div>

            {suggestedMenu && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-4">AI-Suggested Menu</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {suggestedMenu.map((recipe, i) => (
                    <div key={i} className="text-center">
                      <p className="text-sm font-semibold text-gray-600">{Object.keys(weeklyMenu)[i]}</p>
                      <p className="text-sm text-blue-900">{recipe}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => applyMenu(suggestedMenu)} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                  Apply This Menu
                </button>
              </div>
            )}

            <div className="grid grid-cols-7 gap-3">
              {Object.entries(weeklyMenu).map(([day, recipe]) => (
                <div key={day} className="bg-white p-4 rounded-lg shadow">
                  <p className="font-bold text-gray-700 mb-2">{day}</p>
                  <select value={recipe?.id || ''} onChange={(e) => { const selected = recipes.find(r => r.id === parseInt(e.target.value)); setWeeklyMenu({ ...weeklyMenu, [day]: selected }); }} className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="">Select Recipe</option>
                    {recipes.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
                  </select>
                  {recipe && (<p className="text-xs text-gray-600 mt-2">{recipe.prepTime} min | {recipe.protein}g protein</p>)}
                </div>
              ))}
            </div>

            <button onClick={generateShoppingList} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition">
              Generate Shopping List
            </button>
          </div>
        )}

        {view === 'recipes' && userRole === 'planner' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>⏱ {recipe.prepTime} minutes</p>
                    <p>👥 Serves {recipe.servings}</p>
                    <p>💪 {recipe.protein}g protein</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">INGREDIENTS:</p>
                    <ul className="text-sm space-y-1">
                      {recipe.ingredients.map((ing, i) => (<li key={i} className="text-gray-700">• {ing}</li>))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'shopping' && userRole === 'planner' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Shopping List</h2>
            {shoppingList.length === 0 ? (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
                <p className="text-gray-600">Select recipes and generate a shopping list first</p>
              </div>
            ) : (
              <div className="space-y-4">
                {['Dairy', 'Proteins & Legumes', 'Vegetables', 'Grains & Flours', 'Other'].map(category => {
                  const items = shoppingList.filter(i => i.category === category);
                  if (items.length === 0) return null;
                  return (
                    <div key={category}>
                      <h3 className="font-bold text-lg text-gray-800 mb-3">{category}</h3>
                      <div className="bg-white rounded-lg shadow p-4 space-y-2 mb-4">
                        {items.map((item, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input type="checkbox" checked={item.checked} onChange={() => toggleShoppingItem(shoppingList.indexOf(item))} className="w-4 h-4 accent-green-600" />
                            <span className={item.checked ? 'line-through text-gray-400' : 'text-gray-800'}>{item.ingredient}</span>
                            <span className="ml-auto text-sm text-gray-500">×{item.quantity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === 'settings' && userRole === 'planner' && (
          <div className="bg-white rounded-lg shadow p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Nutrition Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Protein Target (g)</label>
                <input type="number" value={userPrefs.dailyProtein} onChange={(e) => setUserPrefs({ ...userPrefs, dailyProtein: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Calorie Target</label>
                <input type="number" value={userPrefs.dailyCalories} onChange={(e) => setUserPrefs({ ...userPrefs, dailyCalories: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {view === 'cook' && userRole === 'cook' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Today's Menu</h2>
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <p className="text-gray-600 text-center">
                {Object.values(weeklyMenu).find(r => r) 
                  ? `Today: ${Object.values(weeklyMenu).find(r => r)?.name}` 
                  : 'No recipe planned for today'}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GroceryApp;
