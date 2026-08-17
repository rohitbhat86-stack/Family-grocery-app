import React from 'react';
import { Sunrise, Sun, Moon, UtensilsCrossed } from 'lucide-react';
import { DAYS, MEALS, EATERS } from '../data/week';
import { getRecipe } from '../data/recipes';

const MEAL_ICON = { breakfast: Sunrise, lunch: Sun, dinner: Moon };

function EaterColumn({ eater, slots, onOpenRecipe }) {
  const dishes = slots.map(getRecipe).filter(Boolean);

  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-clay-500">
        {eater.label}
      </p>
      {dishes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-cream-300 px-3 py-2.5 text-sm text-clay-400">
          Not set
        </p>
      ) : (
        <ul className="space-y-1.5">
          {dishes.map((recipe, i) => (
            <li key={`${recipe.id}-${i}`}>
              <button onClick={() => onOpenRecipe(recipe)} className="dish-chip">
                {recipe.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function WeekView({ week, onOpenRecipe }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {DAYS.map((day) => {
        const dayHasAnything = MEALS.some((meal) =>
          EATERS.some((eater) => week.days[day][meal.id][eater.id].some(Boolean))
        );

        return (
          <section key={day} className="card overflow-hidden">
            <header className="border-b border-cream-200 bg-cream-50 px-4 py-3">
              <h2 className="text-lg font-bold text-clay-900">{day}</h2>
            </header>

            {!dayHasAnything ? (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-clay-400">
                <UtensilsCrossed className="h-4 w-4" />
                Nothing planned yet
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {MEALS.map((meal) => {
                  const Icon = MEAL_ICON[meal.id];
                  const mealHasAnything = EATERS.some((eater) =>
                    week.days[day][meal.id][eater.id].some(Boolean)
                  );
                  if (!mealHasAnything) return null;

                  return (
                    <div key={meal.id} className="px-4 py-3">
                      <div className="mb-2.5 flex items-center gap-2">
                        <Icon className="h-4 w-4 text-clay-500" />
                        <h3 className="text-sm font-bold uppercase tracking-wide text-clay-700">
                          {meal.label}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        {EATERS.map((eater) => (
                          <EaterColumn
                            key={eater.id}
                            eater={eater}
                            slots={week.days[day][meal.id][eater.id]}
                            onOpenRecipe={onOpenRecipe}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
