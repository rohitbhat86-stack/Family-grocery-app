// Shape of a week's plan, shared by the calendar view and the admin page.

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MEALS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
];

export const EATERS = [
  { id: 'adults', label: 'Adults' },
  { id: 'arjun', label: 'Arjun' },
];

/** Three slots per meal, per person — room for more than one dish. */
export const SLOTS = 3;

export function emptyWeek() {
  return {
    weekLabel: '',
    days: Object.fromEntries(
      DAYS.map((day) => [
        day,
        Object.fromEntries(
          MEALS.map((meal) => [
            meal.id,
            Object.fromEntries(EATERS.map((eater) => [eater.id, Array(SLOTS).fill('')])),
          ])
        ),
      ])
    ),
    extraGroceries: [],
  };
}

/**
 * Fills in anything missing from a stored plan so an older or partial payload
 * can't crash the UI with an undefined lookup.
 */
export function normalizeWeek(stored) {
  const base = emptyWeek();
  if (!stored || typeof stored !== 'object') return base;

  base.weekLabel = typeof stored.weekLabel === 'string' ? stored.weekLabel : '';
  base.extraGroceries = Array.isArray(stored.extraGroceries)
    ? stored.extraGroceries.filter((item) => typeof item === 'string')
    : [];

  DAYS.forEach((day) => {
    MEALS.forEach((meal) => {
      EATERS.forEach((eater) => {
        const slots = stored?.days?.[day]?.[meal.id]?.[eater.id];
        if (!Array.isArray(slots)) return;
        base.days[day][meal.id][eater.id] = Array.from(
          { length: SLOTS },
          (_, i) => (typeof slots[i] === 'string' ? slots[i] : '')
        );
      });
    });
  });

  return base;
}

/** Every recipe id chosen anywhere in the week, de-duplicated. */
export function chosenRecipeIds(week) {
  const ids = new Set();
  DAYS.forEach((day) => {
    MEALS.forEach((meal) => {
      EATERS.forEach((eater) => {
        week.days[day][meal.id][eater.id].forEach((id) => {
          if (id) ids.add(id);
        });
      });
    });
  });
  return [...ids];
}
