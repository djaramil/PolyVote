# PolyVote — Incremental Build Steps

Each step is small and ends with a **Verify** checkpoint so you can confirm it works
before moving on. Stack: React + Vite + Tailwind + Back4App (Parse).

---

## Step 0 — Scaffold the frontend
**Goal:** A running Vite + React + Tailwind app showing the mockup feed with dummy data.

- `npm create vite@latest polyvote -- --template react` (or `react-ts`).
- Install Tailwind + plugins; install `lucide-react`, `react-router-dom`.
- Port the theme tokens from `mockup.html` (colors `ink/surface/edge/up/down/brand`, Inter font, radial bg) into `tailwind.config.js` + `index.css`.
- Break the mockup into components: `Navbar`, `FeedPage`, `TopicCard`, `VoteBar`, `VoteButtons`.
- Use a local `topics` array (same dummy data) for now.

**Verify:** `npm run dev` renders the dark feed grid identical to the mockup.
**Commit:** `feat: scaffold app + feed UI with dummy data`

---

## Step 1 — Connect Back4App (Parse SDK)
**Goal:** App talks to a real backend.

- Create a Back4App app; copy **Application ID** + **JavaScript Key**.
- `npm i parse`. Create `src/lib/parse.js` initializing Parse with keys from `.env` (`VITE_PARSE_APP_ID`, `VITE_PARSE_JS_KEY`, server URL `https://parseapi.back4app.com`).
- Add `.env` to `.gitignore`; commit a `.env.example`.

**Verify:** A throwaway `Parse.Cloud.run`/health query in the console succeeds (no auth errors).
**Commit:** `chore: wire Parse SDK + env config`

---

## Step 2 — Data model + read real Topics
**Goal:** Feed renders from the database instead of dummy data.

- Define classes in Back4App: `Topic`, `Vote`, `Comment`, `Feed` (fields per `PLAN.md` §4).
- Set Class-Level Permissions (public read for `Topic`; auth required to write `Vote`/`Comment`).
- Seed 3–4 `Topic` rows by hand (dashboard or a small script).
- Replace dummy data with a `Parse.Query(Topic)` in `FeedPage` (newest first).

**Verify:** Feed shows your seeded topics; deleting one in the dashboard removes it from the UI on refresh.
**Commit:** `feat: read Topics from Parse`

---

## Step 3 — RSS ingestion (Cloud Job)
**Goal:** Topics auto-populate from news feeds.

- Seed `Feed` config rows (one per category: Politics, Tech, Sports, Business, Entertainment, Science).
- Write `ingestFeeds` in Cloud Code: fetch each enabled feed, parse XML (`rss-parser`/`fast-xml-parser`), create `Topic`s, **skip duplicates by `guid`**, map feed → category.
- Deploy Cloud Code (Back4App MCP / dashboard). Run the job manually once.
- Schedule it (~every 30 min) in Back4App job scheduler.

**Verify:** Running the job fills `Topic` with real headlines; running twice creates **no** duplicates.
**Commit:** `feat: RSS ingestion cloud job`

---

## Step 4 — Authentication
**Goal:** Users can sign up, log in, log out; session persists.

- Build `LoginPage` + `SignupPage` (use the mockup auth wireframe styling).
- `AuthContext` wrapping `Parse.User.signUp/logIn/logOut/current()`.
- Navbar reflects auth state (show username + Log out, or Log in/Sign up).
- Add routing: `/`, `/topic/:id`, `/login`, `/signup`.

**Verify:** Sign up → reload → still logged in. Log out → state clears.
**Commit:** `feat: auth (signup/login/logout) + routing`

---

## Step 5 — Voting
**Goal:** Logged-in users vote; counts are server-authoritative.

- Cloud Function `castVote(topicId, value)`: upsert the user's `Vote`, toggle off if same value, recompute `upCount`/`downCount`.
- Wire `VoteButtons` to `Parse.Cloud.run("castVote", ...)` with **optimistic UI**, then reconcile with the returned counts.
- Gate voting behind auth (prompt login if anonymous).

**Verify:** Vote up → bar/% updates and persists after reload. Re-voting changes, not duplicates. Logged-out vote prompts login.
**Commit:** `feat: voting via castVote cloud function`

---

## Step 6 — Topic detail + Comments
**Goal:** Detail page with discussion.

- `TopicDetailPage` (`/topic/:id`): headline, summary, source link, vote section.
- Cloud Function `addComment(topicId, body)`: create `Comment`, increment `commentCount`.
- `CommentList` + `CommentForm` (auth-gated).

**Verify:** Posting a comment shows it instantly and increments the count; reload persists it.
**Commit:** `feat: topic detail + comments`

---

## Step 7 — Category filtering + sorting
**Goal:** The tabs and sort controls actually work.

- Category tabs filter the `Topic` query by `category`.
- Sort options: Newest (`publishedAt`), Most Votes (`upCount+downCount`), Most Controversial (closest to 50/50).
- Add pagination / "Load more" (`skip`/`limit`).

**Verify:** Switching tabs and sorts changes results correctly; Load more appends.
**Commit:** `feat: category filter + sorting + pagination`

---

## Step 8 — Polish
**Goal:** Production-feel states.

- Loading skeletons, empty state, error toasts, vote animation.
- Responsive pass (mobile feed from the wireframe).
- Optional: prune old Topics in the ingest job.

**Verify:** Throttle network → skeletons show; offline vote → error toast; mobile layout looks right.
**Commit:** `feat: loading/empty/error states + responsive polish`

---

## Step 9 — Deploy
**Goal:** Live app.

- `npm run build`; deploy the SPA (Back4App Web Hosting or Netlify).
- Confirm Cloud Code + scheduled `ingestFeeds` are live in production.
- Smoke test: sign up, vote, comment on the deployed URL.

**Verify:** Public URL works end-to-end; feed keeps refreshing on schedule.
**Commit:** `chore: deploy`

---

## Suggested order recap
0 scaffold → 1 connect → 2 read → 3 ingest → 4 auth → 5 vote → 6 comments → 7 filter/sort → 8 polish → 9 deploy.

> Each step is independently demoable. If you want, I can start at **Step 0** and we'll
> check the Verify box together before each next step.
