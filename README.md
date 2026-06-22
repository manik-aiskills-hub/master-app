# German B1 Planner

30-day telc Deutsch B1 exam preparation app.

## Features (MVP)
- 30 themed chapters mapped to telc B1 topics
- Vocabulary: 20 words/day with flashcards, typing, MCQ
- Verbs: 10 verbs/day with conjugation drills
- Grammar: formulas + fill-in + sentence writing
- Lesen, Hören, Schreiben, Sprechen practice
- Mock tests every 5 days + full mock in final 3 days
- Weak areas tracking with spaced repetition
- Progress dashboard with pace tracking
- Dark/light mode, DE/EN language toggle
- PWA: works on web and mobile

## Tech Stack
- **Frontend:** Next.js 15 + React 19
- **Database:** SQLite via Prisma
- **Package Manager:** pnpm
- **Testing:** Jest + React Testing Library
- **Deployment:** Docker

## Getting Started

```bash
# Run with Docker
docker compose up

# Run tests
docker compose run --rm test
```

App runs at http://localhost:3000
