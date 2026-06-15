# PolyVote

A Polymarket-style opinion voting app. Topics are **news headlines auto-imported from RSS feeds** across multiple categories. The community votes **thumbs up / thumbs down** and discusses each story in the comments.

> Not a money/prediction market — it's sentiment voting on real news.

## Features

- **Auto-imported topics** — news headlines pulled from RSS feeds (users don't create topics)
- **Categories** — Politics, Technology, Sports, Business, Entertainment, Science
- **Voting** — thumbs up / down, one vote per user per topic (changeable), server-authoritative counts
- **Comments** — discuss each story (flat list for v1)
- **Auth** — sign up / log in / log out with persistent sessions
- **Feed** — browse by category with sorting (newest, most votes, most controversial)

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + Vite |
| Styling | Tailwind CSS (dark theme) |
| Icons | Lucide React |
| Routing | React Router |
| Backend / DB / Auth | Back4App (Parse Server) via Parse JS SDK |
| Server logic | Parse Cloud Code (vote counting, RSS ingestion) |
| Hosting | Back4App Web Hosting (or Netlify) |

## Data Model (Parse Classes)

- **`Topic`** — a news article (title, description, category, sourceName, articleUrl, imageUrl, guid, publishedAt, cached up/down/comment counts)
- **`Vote`** — links a user to a topic with `value` (`1` up / `-1` down); unique per (user, topic)
- **`Comment`** — a comment on a topic (author, body)
- **`Feed`** — RSS feed config (url, sourceName, category, enabled)

## Cloud Code

- **`castVote(topicId, value)`** — upsert the user's vote and recompute counts
- **`addComment(topicId, body)`** — create a comment and increment count
- **`ingestFeeds`** — scheduled job that fetches enabled feeds, parses RSS, and creates new `Topic`s (de-duped by `guid`)

## Getting Started

> The app is currently in the planning/mockup stage. See `PLAN.md` and `BUILD_STEPS.md` for the full roadmap.

### Prerequisites

- Node.js 18+
- A [Back4App](https://www.back4app.com/) app (Application ID + JavaScript Key)

### Setup

```bash
# install dependencies
npm install

# create your env file from the example and fill in your Back4App keys
cp .env.example .env

# run the dev server
npm run dev
```

### Environment variables

```
VITE_PARSE_APP_ID=your_application_id
VITE_PARSE_JS_KEY=your_javascript_key
VITE_PARSE_SERVER_URL=https://parseapi.back4app.com
```

## Project Status

Planning and design assets are in place:

- **`PLAN.md`** — concept, scope, tech stack, data model, cloud code design
- **`BUILD_STEPS.md`** — incremental build steps with verify checkpoints
- **`MOCKUPS.md`** / **`mockup.html`** — UI mockups and dark-theme design
- **`DIAGRAMS.md`** — architecture/flow diagrams

Build order: scaffold → connect Parse → read topics → RSS ingest → auth → vote → comments → filter/sort → polish → deploy.

## License

ISC
