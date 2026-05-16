# IMDB Video Generator

A lightweight Next.js app that turns an IMDB URL or movie title into a **2-minute cinematic video**: fetch metadata (OMDB) → AI script (Gemini) → Remotion preview (and optional MP4 export).

## Quick start

```bash
npm install
cp .env.example .env.local
# Add OMDB_API_KEY (required) and GEMINI_API_KEY (optional — uses mock script if missing)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OMDB_API_KEY` | Yes | [OMDB API](https://www.omdbapi.com/apikey.aspx) |
| `GEMINI_API_KEY` | No | [Google AI Studio](https://aistudio.google.com/apikey) — without it, a demo script is used |
| `SKIP_VIDEO_RENDER` | No | Set `true` to skip server MP4 render (default in `.env.example`) |

## Features

- Dark cinematic UI (Playfair Display + DM Sans)
- IMDB URL or title search
- Gemini-generated 2-minute script (JSON structure)
- Editable script sections after generation
- In-browser Remotion preview
- Optional server MP4 export (requires ffmpeg + `SKIP_VIDEO_RENDER=false`)

## Project structure

See `app/`, `components/`, `lib/`, `remotion/`, and `app/api/` for the full pipeline.
