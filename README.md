# PopChoice

PopChoice helps groups pick a movie to watch together. Each participant submits a short text about their favorite movie and answers a few simple preference questions (new vs classic, mood/genre). PopChoice finds movies from a Supabase-backed vector search that best match the group's combined preferences and uses an OpenAI model to summarize and recommend the top matches with short reasons.

This README explains what the app does, how it works, required configuration, how to run it locally, and troubleshooting tips.

Features
- Collect short free-text preferences from multiple users through a simple UI.
- Build a single query embedding from the groups responses (OpenAI embeddings).
- Use Supabase vector search (RPC) to find the movies closest to the group's combined embedding.
- Use an OpenAI chat model to summarize and generate human-friendly recommendations and short reasons for each suggested movie.
- Clean, responsive UI built with React + Vite + TailwindCSS.


How it works (high level)
1. The user enters the number of participants and submits responses for each person.
2. When all responses are collected, the app:
   - Builds a short textual query that includes each user's answers.
   - Calls the OpenAI embeddings API to create a single embedding for that combined query.
   - Calls a Supabase RPC (match_movies) which performs a vector similarity search against a movies table (movies are expected to have precomputed embeddings) and returns the closest matches.
   - Sends the matched movie content and the users' preferences to an OpenAI chat completion to produce succinct, user-friendly recommendations with reasons.
3. The UI displays the top recommendations with pagination and short reasons.


Project structure (important files)
- src/
  - App.jsx - primary app component and orchestration of recommendation loading.
  - components/ - header, form, and results UI components.
  - util/supaBaseUtils.js - core logic for building the query, creating embeddings, calling Supabase RPC, and asking OpenAI to generate the recommendation text.
  - config/ai-config.js - OpenAI and Supabase client initialization (reads environment variables).
- public/, index.html - standard Vite static entry.
- package.json - scripts and dependencies (dev, build, preview, lint, seed).


Prerequisites
- Node.js (v16+ recommended)
- npm (or yarn)
- A Supabase project with a movies table containing text content and vector embeddings (the app expects an RPC named `match_movies` to be available).
- An OpenAI API key with access to embeddings and chat models.


Environment variables
Create a .env file at the project root (or set the following environment variables in your environment). Example file: .env

- VITE_OPENAI_API_KEY - Your OpenAI API key used for embeddings and chat completions.
- VITE_SUPABASE_URL - Your Supabase project URL (example: https://xyzcompany.supabase.co)
- VITE_SUPABASE_ANON_KEY - The Supabase anon (public) key used by the client.

Important: ai-config.js will throw an error on startup if these variables are not set.


Setup & installation
1. Clone the repository and change into the project directory.

   git clone <repo-url>
   cd pop-choice

2. Install dependencies

   npm install

3. Create a .env file (or set environment variables) using the keys mentioned in Environment variables above. A sample .env.example file is included in the project to help.


Running locally (development)
- Start the dev server with:

  npm run dev

- Open http://localhost:5173 (or the port Vite reports) and use the app.

Notes:
- The app relies on the browser client to call OpenAI and Supabase directly. The code in src/config/ai-config.js uses the OpenAI Node client with dangerouslyAllowBrowser: true and will attempt to call OpenAI from the browser runtime. This is convenient for demos but not recommended for production (see Security notes).


Building for production
- Build the static assets with:

  npm run build

- Preview the production build locally with:

  npm run preview


- Supabase setup notes:
  - Create a table (e.g. movies) with at least these columns: id (uuid), title (text), content (text), embedding (vector or jsonb depending on how you store embeddings).
  - Create or enable any RPC required by the app (this project expects a stored RPC named `match_movies` which accepts a query_embedding and returns nearby movie rows). See Supabase vector similarity docs for guidance: https://supabase.com/docs/guides/database/pgvector


Security notes
- This project stores API keys in VITE_ prefixed environment variables so they are embedded in the client bundle. This means keys are exposed to end-users and should only be used with keys that are safe for client usage (e.g., Supabase anon key). Do NOT embed a sensitive server-side OpenAI secret in client-exposed env variables.
- For production, implement a small backend (serverless or API) that:
  - Holds your OpenAI secret safely.
  - Accepts client requests, forwards them to OpenAI (embeddings / chat) or Supabase (if needed), and returns safe results to the client.


Troubleshooting
- "VITE_OPENAI_API_KEY is required." or similar startup errors:
  - Confirm .env exists and variables are spelled correctly. Restart the dev server after changing env variables.

- No recommendations or empty results:
  - Ensure Supabase match_movies RPC is set up and the movies table contains embeddings.
  - Make sure OpenAI embeddings API works with your API key.
  - Check browser console and server logs for errors coming from supabase.rpc or openai calls.

- Errors about missing scripts/seedMovies.js when running npm run seed:
  - Either add a seed script at scripts/seedMovies.js or update package.json to point to your seeding implementation.
