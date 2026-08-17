import React, { useEffect } from 'react';
import { X, ExternalLink, BookOpen } from 'lucide-react';

/**
 * Recipe detail. Rises from the bottom on a phone (thumb-reachable close button),
 * centres as a dialog on wider screens.
 */
export default function RecipeSheet({ recipe, onClose }) {
  useEffect(() => {
    if (!recipe) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    // Stop the page behind the sheet from scrolling under it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-clay-900/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={recipe.name}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-lift
                   sm:max-w-lg sm:rounded-2xl"
      >
        <div className="sticky top-0 flex items-start gap-3 border-b border-cream-200 bg-white px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold leading-snug text-clay-900">{recipe.name}</h2>
            {recipe.note && <p className="mt-1 text-sm text-clay-700">{recipe.note}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close recipe"
            className="tap -mr-2 -mt-1 shrink-0 rounded-lg px-2 text-clay-600 hover:bg-cream-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          {recipe.needsName && (
            <p className="rounded-lg border border-honey-200 bg-honey-50 p-3 text-sm text-clay-800">
              This one is saved as a link only — Instagram needs a login, so the dish name
              couldn't be read automatically. Open it, then rename it in
              <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">src/data/recipes.js</code>.
            </p>
          )}

          {recipe.url ? (
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open full recipe
            </a>
          ) : (
            <p className="flex items-start gap-2 rounded-lg bg-cream-100 p-3 text-sm text-clay-700">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0" />
              A family recipe — no link saved. Cook it the way you always do.
            </p>
          )}

          {recipe.ingredients.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-clay-500">
                Core ingredients
              </h3>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing) => (
                  <li key={ing} className="flex gap-2 text-sm text-clay-800">
                    <span className="text-clay-300">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
              {recipe.url && (
                <p className="mt-3 text-xs text-clay-500">
                  Main items only — open the recipe for exact amounts and the full list.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
