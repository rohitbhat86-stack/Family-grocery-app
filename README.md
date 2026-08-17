# 83D Food and Activities Calendar

A warm, view-only weekly calendar you can share with the cook: meals for Monday–Saturday
split by meal and by who's eating, Arjun's activities, and the grocery list for the week.
A separate **Admin access** page is where you set the menu.

- `backend/` — Node/Express API; stores the week as JSON
- `frontend/` — Create React App + Tailwind

There is no login — anyone with the link sees the calendar. Editing it needs a passcode.
See [Access](#access).

In production the Express server also serves the built React app, so the whole thing runs
as **one service on one URL**. See [Deploying](#deploying).

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

No accounts — the cook opens the link and sees the calendar. The **Admin access** tab is
behind a passcode (default `0000`), checked both in the browser and on the server, so the
week can't be rewritten by calling the API directly.

Change it by setting `ADMIN_PASSCODE` in the backend environment.

> **This is a "don't touch" latch, not security.** The passcode is sent from the browser
> and the repo is public, so anyone determined can find it. It stops the cook editing the
> week by accident; it would not stop someone who wanted in. For real protection, put the
> site behind Basic Auth or Cloudflare Access at the hosting layer.

Reading the menu never requires the passcode — that's the whole point of the shared link.

## Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `PORT` | `backend/.env` | Backend port. Defaults to 5050. Hosts like Render inject their own. |
| `ADMIN_PASSCODE` | backend env | Passcode for the Admin tab. Defaults to `0000`. |
| `ANTHROPIC_API_KEY` | `backend/.env` | Only needed if AI suggestions are re-enabled (off by default). |
| `REACT_APP_API_URL` | frontend build env | Only needed if you split the frontend onto a separate host. Leave unset for the single-service deploy. |
| `REACT_APP_ENABLE_AI_SUGGESTIONS` | frontend build env | `true` re-enables AI menu suggestions. Off by default. |

`REACT_APP_*` variables are inlined by CRA at **build** time, so they must be set when you
run `npm run build` — setting them on the host at runtime has no effect:

```bash
cd frontend
REACT_APP_API_URL=https://your-backend.onrender.com npm run build
```

## Deploying

One service serves both halves. On Render (or similar):

| Setting | Value |
| --- | --- |
| Root Directory | *(blank — the repo root)* |
| Build Command | `npm run build` |
| Start Command | `npm start` |

`npm run build` installs both projects and builds the React bundle; `npm start` runs the
Express server, which serves that bundle alongside `/api`. Because they share an origin
there is no CORS setup and no `REACT_APP_API_URL` to configure.

**Attach a persistent disk** mounted at `<repo>/backend/data`, or the saved week is lost
on every redeploy. On Render that path is `/opt/render/project/src/backend/data`.

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
