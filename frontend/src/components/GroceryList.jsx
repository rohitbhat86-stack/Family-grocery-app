import React, { useMemo, useState } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { chosenRecipeIds } from '../data/week';
import { getRecipe, categorizeIngredient, GROCERY_CATEGORY_ORDER } from '../data/recipes';

/**
 * Builds the week's shopping list from whatever dishes are on the calendar.
 * Each ingredient records which dishes need it, so the cook can tell why it's there.
 */
function buildList(week) {
  const map = new Map();

  chosenRecipeIds(week).forEach((id) => {
    const recipe = getRecipe(id);
    if (!recipe) return;
    recipe.ingredients.forEach((ingredient) => {
      const key = ingredient.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { ingredient, usedIn: new Set(), category: categorizeIngredient(ingredient) });
      }
      map.get(key).usedIn.add(recipe.name);
    });
  });

  (week.extraGroceries || []).forEach((raw) => {
    const ingredient = raw.trim();
    if (!ingredient) return;
    const key = ingredient.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { ingredient, usedIn: new Set(), category: categorizeIngredient(ingredient) });
    }
    map.get(key).usedIn.add('Added by hand');
  });

  return [...map.values()].map((item) => ({ ...item, usedIn: [...item.usedIn] }));
}

export default function GroceryList({ week }) {
  const items = useMemo(() => buildList(week), [week]);
  const [checked, setChecked] = useState({});

  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }));
  const doneCount = items.filter((i) => checked[i.ingredient.toLowerCase()]).length;

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <ShoppingBasket className="mx-auto mb-3 h-9 w-9 text-cream-300" />
        <p className="font-semibold text-clay-800">Nothing to buy yet</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-clay-500">
          Once dishes are chosen in Admin access, the week's groceries appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-clay-600">
        {doneCount} of {items.length} picked up · main items only, check each recipe for amounts
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GROCERY_CATEGORY_ORDER.map((category) => {
          const inCategory = items.filter((i) => i.category === category);
          if (inCategory.length === 0) return null;

          return (
            <section key={category} className="card overflow-hidden">
              <h3 className="border-b border-cream-200 bg-cream-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-clay-600">
                {category}
              </h3>
              <ul className="divide-y divide-cream-200">
                {inCategory.map((item) => {
                  const key = item.ingredient.toLowerCase();
                  return (
                    <li key={key}>
                      <label className="flex cursor-pointer items-start gap-3 px-4 py-3 transition active:bg-cream-50 sm:hover:bg-cream-50">
                        <input
                          type="checkbox"
                          checked={!!checked[key]}
                          onChange={() => toggle(key)}
                          className="mt-0.5 h-5 w-5 shrink-0 rounded accent-clay-600"
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm ${
                              checked[key] ? 'text-clay-400 line-through' : 'text-clay-900'
                            }`}
                          >
                            {item.ingredient}
                          </span>
                          <span className="mt-0.5 block text-xs text-clay-500">
                            {item.usedIn.join(', ')}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
