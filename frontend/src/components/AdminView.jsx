import React, { useState } from 'react';
import { Save, Eraser, Check, Sunrise, Sun, Moon } from 'lucide-react';
import { DAYS, MEALS, EATERS, SLOTS, emptyWeek } from '../data/week';
import { recipesForCourse } from '../data/recipes';

const MEAL_ICON = { breakfast: Sunrise, lunch: Sun, dinner: Moon };

function RecipePicker({ value, course, onChange, label }) {
  const { suited, rest } = recipesForCourse(course);
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field text-sm"
    >
      <option value="">— empty —</option>
      <optgroup label={`Good for ${course}`}>
        {suited.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Everything else">
        {rest.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

export default function AdminView({ week, onChange, onSave, saving, savedAt, error }) {
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  const setSlot = (day, mealId, eaterId, index, recipeId) => {
    const next = structuredClone(week);
    next.days[day][mealId][eaterId][index] = recipeId;
    onChange(next);
  };

  const clearDay = (day) => {
    const next = structuredClone(week);
    next.days[day] = emptyWeek().days[day];
    onChange(next);
  };

  const dayFilledCount = (day) =>
    MEALS.reduce(
      (total, meal) =>
        total +
        EATERS.reduce(
          (sum, eater) => sum + week.days[day][meal.id][eater.id].filter(Boolean).length,
          0
        ),
      0
    );

  return (
    <div className="space-y-5">
      <div className="card p-4 sm:p-5">
        <label htmlFor="week-label" className="mb-1.5 block text-sm font-semibold text-clay-800">
          Week
        </label>
        <input
          id="week-label"
          type="text"
          value={week.weekLabel}
          placeholder="e.g. Week of 17 August"
          onChange={(e) => onChange({ ...week, weekLabel: e.target.value })}
          className="field max-w-sm"
        />
      </div>

      {/* Day picker — editing one day at a time keeps this usable on a phone. */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DAYS.map((day) => {
          const count = dayFilledCount(day);
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`tap shrink-0 gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition ${
                activeDay === day
                  ? 'border-clay-600 bg-clay-600 text-white'
                  : 'border-cream-300 bg-white text-clay-700 hover:bg-cream-50'
              }`}
            >
              {day}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    activeDay === day ? 'bg-white/25' : 'bg-cream-200 text-clay-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-cream-200 bg-cream-50 px-4 py-3">
          <h2 className="text-lg font-bold text-clay-900">{activeDay}</h2>
          <button
            onClick={() => clearDay(activeDay)}
            className="tap gap-1.5 rounded-lg px-2 text-sm font-semibold text-clay-600 hover:bg-cream-200"
          >
            <Eraser className="h-4 w-4" />
            Clear day
          </button>
        </header>

        <div className="divide-y divide-cream-200">
          {MEALS.map((meal) => {
            const Icon = MEAL_ICON[meal.id];
            return (
              <div key={meal.id} className="px-4 py-4">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-clay-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wide text-clay-700">
                    {meal.label}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {EATERS.map((eater) => (
                    <div key={eater.id}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-clay-500">
                        {eater.label}
                      </p>
                      <div className="space-y-2">
                        {Array.from({ length: SLOTS }, (_, index) => (
                          <RecipePicker
                            key={index}
                            label={`${activeDay} ${meal.label} ${eater.label} dish ${index + 1}`}
                            value={week.days[activeDay][meal.id][eater.id][index]}
                            course={meal.id}
                            onChange={(recipeId) =>
                              setSlot(activeDay, meal.id, eater.id, index, recipeId)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-4 sm:p-5">
        <label htmlFor="extras" className="mb-1.5 block text-sm font-semibold text-clay-800">
          Extra grocery items
        </label>
        <p className="mb-2 text-xs text-clay-500">
          Anything not tied to a recipe — milk, fruit, snacks. One per line.
        </p>
        <textarea
          id="extras"
          rows={4}
          value={(week.extraGroceries || []).join('\n')}
          onChange={(e) =>
            onChange({ ...week, extraGroceries: e.target.value.split('\n') })
          }
          placeholder={'milk\nbananas\nbread'}
          className="field font-sans"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 border-t border-cream-300 bg-cream-100/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="flex items-center gap-3">
          <button onClick={onSave} disabled={saving} className="btn-primary flex-1 gap-2 sm:flex-none">
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save week'}
          </button>
          {savedAt && !saving && (
            <span className="flex items-center gap-1.5 text-sm text-sage-700">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
