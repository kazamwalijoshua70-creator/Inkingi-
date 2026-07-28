# Inkingi — local dev / preview

This is a standard Vite + React project. Everything about the app itself
(UI, Supabase, Cloudinary, auth, database logic) is unchanged from
`App.jsx` — this packaging only adds the standard files a real project
needs to run: `package.json`, `vite.config.js`, `index.html`, and the
`src/main.jsx` entry point that mounts `App.jsx`.

## Why this exists

Claude's in-chat artifact preview is a sandboxed renderer, not a real Vite
build — it doesn't actually run `npm install`/`vite dev` behind the scenes,
so packaging real Vite config files does not change what that preview does.
The "Cannot use 'import.meta' outside a module" error comes from how that
preview sandbox executes code, not from anything in this project (see the
earlier root-cause discussion) — this project is meant to be run for real,
on your own machine or a real host, where a real Vite dev server resolves
that error the normal way (because it genuinely is running the file as an
ES module).

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

The `.env` file already has the real Supabase/Cloudinary credentials from
our setup — the app will start in full production mode (real database,
real auth, real image uploads) as soon as you run it. See `SETUP.md` for
the database schema you still need to run in Supabase (`SCHEMA.sql`) and
how to create your first admin account, if you haven't done that yet.

## Build for deployment

```bash
npm run build
```

Outputs a static `dist/` folder you can deploy to any static host (Vercel,
Netlify, your own server, etc.) — set the same environment variables from
`.env` in that host's dashboard rather than shipping the `.env` file
itself.
