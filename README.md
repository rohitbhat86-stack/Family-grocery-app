# 83D Food and Activities Calendar

A warm, view-only weekly calendar you can share with the cook: meals for Monday–Saturday
split by meal and by who's eating, Arjun's activities, and the grocery list for the week.
A separate **Admin access** page is where you set the menu.

- `backend/` — Node/Express API; stores the week as JSON
- `frontend/` — Create React App + Tailwind

There is no login. Anyone with the link sees the calendar, and anyone who opens
**Admin access** can change it — including your cook. See [Access](#access).

## Running locally

You need Node 18+.

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev               # http://localhost:5050
```

**2. Frontend** (second terminal)

```bash
cd frontend
npm install
npm start                 # http://localhost:3000
```

The frontend's `proxy` setting forwards `/api/*` to `localhost:5050`, so no frontend
env vars are needed locally.

> The backend defaults to port **5050**, not 5000 — on macOS, Control Center's AirPlay
> Receiver occupies 5000 and the server fails to start with `EADDRINUSE`.

## How it fits together

| Page | What it does |
| --- | --- |
| **This Week** | Read-only. Meals Mon–Sat, each split into Breakfast / Lunch / Dinner, and within each into **Adults** and **Arjun**. Tap any dish for its recipe. Below that: Arjun's activities and the week's grocery list. |
| **Admin access** | Pick dishes — up to **three per meal, per person, per day** — name the week, and add extra grocery items. Press **Save week**. |

The grocery list is generated from the dishes on the calendar: ingredients are pooled,
de-duplicated, grouped by aisle, and each line notes which dish needs it. Add anything
that isn't tied to a recipe (milk, fruit) under **Extra grocery items** in Admin.

Saving writes `backend/data/menu.json` on the server, so the cook opening the page on
their own phone sees the same week. That file is gitignored.

## Recipes

The catalogue lives in [`frontend/src/data/recipes.js`](frontend/src/data/recipes.js).
Each entry has a name, an optional link, and a list of **core** ingredients — enough to
build a useful grocery list, not a substitute for the recipe. Family dishes with no link
(Upma, Yellow Dal, Raita, and so on) are in there too.

To add a recipe, append an object with a unique `id`, `name`, `courses`, and
`ingredients`. It appears in the Admin dropdowns immediately.

> **Two entries still need names.** The two Instagram reels are saved as links only —
> Instagram requires a login, so the dish name couldn't be read. Open them, then replace
> `name` and fill in `ingredients` for `instagram-reel-1` and `instagram-reel-2`.

Arjun's activities are in [`frontend/src/data/activities.js`](frontend/src/data/activities.js).

## Access

The site is open by design — no accounts, so the cook doesn't need one. The practical
consequence is that **Admin access is not protected**: anyone who can reach the URL can
edit the week. That is fine on a private or home network. If you put this on the public
internet, put it behind a password at the hosting layer (Basic Auth, Cloudflare Access,
or similar) before sharing the link.

## Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `PORT` | `backend/.env` | Backend port. Defaults to 5050. Hosts like Render inject their own. |
| `ANTHROPIC_API_KEY` | `backend/.env` | Only needed if AI suggestions are re-enabled (off by default). |
| `REACT_APP_API_URL` | frontend build env | Backend origin for **production builds only**. Leave unset locally. |
| `REACT_APP_ENABLE_AI_SUGGESTIONS` | frontend build env | `true` re-enables AI menu suggestions. Off by default. |

`REACT_APP_*` variables are inlined by CRA at **build** time, so they must be set when you
run `npm run build` — setting them on the host at runtime has no effect:

```bash
cd frontend
REACT_APP_API_URL=https://your-backend.onrender.com npm run build
```

## AI menu suggestions (disabled)

Turned off — the app makes no Anthropic API calls and needs no API key. Nothing was
deleted: `POST /api/suggest-menu`, the `@anthropic-ai/sdk` dependency, and the client
code all remain. With the flag off, the build strips the call from the bundle entirely.

To turn it back on, put a real key in `backend/.env` and build with
`REACT_APP_ENABLE_AI_SUGGESTIONS=true`.

## Secrets

`.env` is gitignored; only `.env.example` (placeholders) is committed.

A `pre-commit` hook scans staged changes for Anthropic keys and blocks the commit.
Enable it once per clone:

```bash
git config core.hooksPath .githooks
```

Never put a real key in `.env.example` — that file is tracked, and it is how a key
leaked from this repo before.
