import React, { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Settings, ShoppingBasket, Sparkles, AlertCircle } from 'lucide-react';
import { getJSON, putJSON } from './api';
import { emptyWeek, normalizeWeek } from './data/week';
import WeekView from './components/WeekView';
import GroceryList from './components/GroceryList';
import Activities from './components/Activities';
import AdminView from './components/AdminView';
import RecipeSheet from './components/RecipeSheet';

export default function App() {
  const [view, setView] = useState('week');
  const [week, setWeek] = useState(emptyWeek);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getJSON('/api/menu')
      .then((stored) => {
        if (!cancelled) setWeek(normalizeWeek(stored));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await putJSON('/api/menu', week);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }, [week]);

  const handleChange = useCallback((next) => {
    setWeek(next);
    setSavedAt(null);
  }, []);

  const tabs = [
    { id: 'week', label: 'This Week', icon: CalendarDays },
    { id: 'admin', label: 'Admin access', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-20 border-b border-cream-300 bg-cream-50/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-clay-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight text-clay-900 sm:text-xl">
                83D Food and Activities Calendar
              </h1>
              {week.weekLabel && (
                <p className="mt-0.5 truncate text-sm text-clay-600">{week.weekLabel}</p>
              )}
            </div>
          </div>

          <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`tap shrink-0 gap-2 whitespace-nowrap border-b-2 px-3 text-sm font-semibold transition ${
                  view === id
                    ? 'border-clay-600 text-clay-800'
                    : 'border-transparent text-clay-500 hover:text-clay-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:py-8">
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="min-w-0 flex-1 break-words text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="tap -my-2 shrink-0 px-2 font-semibold text-red-700 underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-clay-500">Loading this week…</p>
        ) : view === 'week' ? (
          <>
            <section>
              <h2 className="mb-3 text-xl font-bold text-clay-900 sm:text-2xl">
                Meals, Monday to Saturday
              </h2>
              <WeekView week={week} onOpenRecipe={setOpenRecipe} />
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-clay-900 sm:text-2xl">
                Arjun's activities
              </h2>
              <Activities />
            </section>

            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-clay-900 sm:text-2xl">
                <ShoppingBasket className="h-5 w-5 text-clay-500" />
                Grocery list for the week
              </h2>
              <GroceryList week={week} />
            </section>
          </>
        ) : (
          <AdminView
            week={week}
            onChange={handleChange}
            onSave={handleSave}
            saving={saving}
            savedAt={savedAt}
            error={null}
          />
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 pt-2">
        <p className="text-xs text-clay-400">
          Tap any dish to see its recipe. Set the week under “Admin access”.
        </p>
      </footer>

      <RecipeSheet recipe={openRecipe} onClose={() => setOpenRecipe(null)} />
    </div>
  );
}
