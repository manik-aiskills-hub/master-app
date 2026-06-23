# German B1 Planner

30-day **telc Deutsch B1 General** exam preparation app built with Next.js 15, React 19, SQLite, and Docker.

## Features

| Feature | Description |
|---------|-------------|
| **Vocabulary** | 20 words/day across 30 themed chapters — flashcard flip, typing, and MCQ modes |
| **Verbs** | 10 verbs/day with full conjugation tables (Präsens, Perfekt, Präteritum) and fill-in drills |
| **Grammar** | Formula cards, fill-in-the-blank, and sentence writing with correction feedback |
| **Lesen (Reading)** | Timed reading passages with MCQ comprehension questions |
| **Hören (Listening)** | YouTube-based listening exercises with active quiz and passive "Listen & Learn" mode |
| **Quiz** | Spaced repetition engine — review random, weak, or due items |
| **Settings** | Dark/light theme, DE/EN language toggle, exam date with pace tracking |
| **Audio TTS** | Native text-to-speech for every German word — per-word speaker buttons and "Listen All" batch playback |
| **PWA** | Installable on iOS and Android — works offline with service worker caching |

## Tech Stack

- **Framework:** Next.js 15 + React 19 (App Router)
- **Database:** SQLite via Prisma ORM (16 models)
- **Package Manager:** pnpm 9
- **Testing:** Jest + React Testing Library + ts-jest (TDD)
- **Containerization:** Docker with multi-stage builds
- **Architecture:** Modular vertical slices

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- Or: Node.js 22+, pnpm 9

## Quick Start with Docker (Recommended)

### 1. Clone and configure

```bash
git clone https://github.com/manikaiskills/german-b1-planner.git
cd german-b1-planner
```

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./data/german-b1.db"
```

### 2. Start the app

```bash
docker compose up --build
```

This will:
- Build the Docker image (Node 22 Alpine + pnpm 9)
- Push the Prisma schema to create the SQLite database
- Start the Next.js dev server with hot reload

The app is now running at **http://localhost:3000**

### 3. Seed the database

In a separate terminal, seed the database with all 30 days of learning content:

```bash
docker compose exec app pnpm db:seed
```

This populates:
- 30 chapters (one per day, mapped to telc B1 topics)
- 600 vocabulary words (20 per chapter)
- 110+ verbs with full conjugation data
- Grammar rules with fill-in and sentence exercises
- Reading passages with timed MCQ questions
- Listening exercises with YouTube links

### 4. Stop the app

```bash
docker compose down
```

## Running Tests

### With Docker

```bash
docker compose run --rm test
```

### Without Docker (local)

```bash
pnpm install
npx prisma generate
pnpm test
```

### Test coverage

```bash
pnpm test:coverage
```

### Watch mode (local development)

```bash
pnpm test:watch
```

**Current test suites:** 9 test files covering all engine modules (word, verb, grammar, quiz, reading, listening, pace, i18n, database schema).

## Running Without Docker

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Create/update database schema
pnpm db:push

# Seed the database
pnpm db:seed

# Start dev server
pnpm dev
```

App runs at **http://localhost:3000**

## Manual Testing Walkthrough

After starting the app and seeding the database, test each feature:

### Learn Tab (Home Page)
1. Open http://localhost:3000
2. You should see 30 chapter cards, one for each day
3. Click any chapter card (e.g., "Tag 1: Begrüßung & Vorstellung")
4. Test **Flashcard mode**: click cards to flip between German and English
5. Test **Typing mode**: type the English translation and submit
6. Test **MCQ mode**: select the correct translation from 4 options
7. Check that progress bars update after answering

### Verb Drills
1. From a chapter page, click the verb drill link
2. Test **Table mode**: view the full conjugation table (ich, du, er/sie/es, wir, ihr, sie/Sie)
3. Check Perfekt and Präteritum forms are displayed
4. Test **Fill-in mode**: type the correct conjugation for a random pronoun
5. Verify correct/wrong feedback

### Grammar
1. From a chapter page, click the grammar link
2. Read the grammar rule with formula and examples
3. Click to start exercises
4. Test **fill-in-the-blank**: type the missing word
5. Test **sentence writing**: write the full sentence; verify correction feedback detects capitalization errors, missing punctuation, and wrong words

### Quiz Tab
1. Navigate to the Quiz tab in the bottom nav
2. Select a quiz mode:
   - **Random**: quizzes on items you've already seen
   - **Weak**: focuses on items with <60% accuracy
   - **Due**: items due for spaced repetition review
3. Answer questions by typing
4. Check the end score and grade (Excellent/Good/Fair/Poor)

### Exam Tab
1. Navigate to the Exam tab
2. **Lesen (Reading)**: click a reading passage, answer timed MCQ questions
3. Verify the countdown timer works and turns red under 60 seconds
4. Submit or wait for auto-submit when time runs out
5. Check score display with correct/wrong highlighting
6. **Hören (Listening)**: click a listening exercise
7. Test Active mode (watch video then answer questions)
8. Test Passive mode (just watch and listen, no quiz)

### Settings Tab
1. Navigate to Settings
2. Toggle **Theme**: switch between Light and Dark — UI should update instantly
3. Toggle **Language**: switch between EN and DE — all labels should translate
4. Set **Exam Date**: pick a date and verify the pace badge shows days left and pace level (Relaxed/Normal/Intense/Cramming)

## Project Structure

```
master-app/
├── prisma/
│   ├── schema.prisma      # 16 database models
│   └── seed.ts            # Comprehensive seed script
├── src/
│   ├── __tests__/          # Jest test files (TDD)
│   ├── app/
│   │   ├── api/            # API routes (chapters, words, verbs, grammar, quiz, reading, listening, settings)
│   │   ├── chapter/[slug]/ # Word learning page (flashcard, typing, MCQ)
│   │   ├── exam/           # Exam section (Lesen + Hören)
│   │   ├── grammar/[slug]/ # Grammar rules + exercises
│   │   ├── listening/[slug]/ # YouTube listening exercises
│   │   ├── quiz/           # Spaced repetition quiz
│   │   ├── settings/       # App settings
│   │   ├── verbs/[slug]/   # Verb conjugation drills
│   │   ├── globals.css     # All styles (light/dark theme)
│   │   ├── layout.tsx      # Root layout with providers
│   │   └── page.tsx        # Home page (chapter list)
│   ├── components/
│   │   ├── BottomNav.tsx   # Fixed bottom navigation
│   │   └── RegisterSW.tsx  # Service worker registration
│   └── lib/
│       ├── db.ts           # Prisma client singleton
│       ├── grammar-engine.ts
│       ├── i18n.ts         # DE/EN translations
│       ├── listening-engine.ts
│       ├── pace.ts         # Pace calculator
│       ├── quiz-engine.ts  # Spaced repetition algorithm
│       ├── reading-engine.ts
│       ├── settings-context.tsx
│       ├── verb-engine.ts
│       └── word-engine.ts
├── docker-compose.yml      # Dev + test services
├── Dockerfile              # Multi-stage build (dev, test, build)
└── jest.config.js          # Jest + ts-jest configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm db:push` | Push Prisma schema to SQLite |
| `pnpm db:seed` | Seed database with learning content |
| `pnpm db:studio` | Open Prisma Studio (database GUI) |

## Docker Services

| Service | Target | Purpose |
|---------|--------|---------|
| `app` | `dev` | Development server with hot reload |
| `test` | `test` | Run test suite (use with `--profile test`) |

```bash
# Start dev server
docker compose up

# Run tests
docker compose run --rm test

# Rebuild after dependency changes
docker compose up --build

# View logs
docker compose logs -f app
```

## Database

SQLite database stored at `./data/german-b1.db`. The `data/` directory is gitignored.

To inspect the database:

```bash
# Via Prisma Studio (local)
pnpm db:studio

# Via Docker
docker compose exec app npx prisma studio
```

To reset and re-seed:

```bash
# Delete the database file
rm -f data/german-b1.db

# Recreate schema and seed
docker compose exec app sh -c "pnpm db:push && pnpm db:seed"
```

## Mobile Access

### Same Wi-Fi network

Find your computer's local IP and open the app on your phone:

```bash
# macOS — get your local IP
ipconfig getifaddr en0
```

Then open `http://<YOUR_IP>:3000` in your phone's browser.

> If using `next dev`, add your IP to `allowedDevOrigins` in `next.config.ts`:
> ```ts
> allowedDevOrigins: ["http://192.168.x.x:3000"],
> ```

### Any network (ngrok tunnel)

[ngrok](https://ngrok.com/) creates a public HTTPS URL that tunnels to your local server.

```bash
# Install ngrok (macOS)
brew install ngrok

# Authenticate (one-time — get your token at https://dashboard.ngrok.com)
ngrok config add-authtoken YOUR_TOKEN

# Start tunnel
ngrok http 3000
```

Open the `https://...ngrok-free.dev` URL on any device. The free tier shows an interstitial page on first visit — just click "Visit Site".

> **Security:** Never commit your ngrok authtoken to git.

## Install as iOS / Android App (PWA)

The app is a Progressive Web App. To install on your home screen:

### iOS (Safari)
1. Open the app URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

### Android (Chrome)
1. Open the app URL in **Chrome**
2. Tap the **three-dot menu** → **Add to Home Screen** (or **Install App**)
3. Tap **Install**

The app launches fullscreen like a native app and caches pages for offline use.

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Web Speech API for TTS** | Zero-cost, no API keys, works offline with native OS voices. Every iOS/macOS device ships with high-quality German voices. |
| **PWA over native app** | No App Store review, instant updates, single codebase. The `standalone` display mode gives a native feel. |
| **Network-first service worker** | Always serves fresh data when online, falls back to cache when offline. Avoids stale content issues with cache-first strategies. |
| **SQLite + Prisma** | Single-file database, no external services, portable. Prisma gives type-safe queries with zero config. |
| **Docker dev environment** | Eliminates "works on my machine" — one `docker compose up` gets everything running. |
| **Spaced repetition** | Evidence-based learning: words you get wrong come back sooner. Reduces study time by focusing on weak areas. |
| **Accordion chapter layout** | All content (words, verbs, grammar, reading, listening) on one page per day — no context switching between tabs. |
| **DE/EN toggle** | Immersive mode (all-German) for advanced learners, English labels for beginners. |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `pnpm: not found` in Docker | Ensure Dockerfile uses `corepack prepare pnpm@9` |
| macOS `._*` files causing Docker issues | Run `find . -name '._*' -delete` before building |
| Database locked errors | Stop all containers, delete `data/*.db`, restart |
| `.next` directory errors on external drive | The `docker-compose.yml` uses an anonymous volume for `/app/.next` to avoid filesystem issues |
| Tests fail with module resolution | Check `jest.config.js` has `moduleNameMapper` for `@/` paths |
