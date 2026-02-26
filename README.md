# enge401-mastery

An interactive, self-paced engineering mathematics learning system based on the [ENGE401 course manual](https://github.com/millecodex/ENGE401) from AUT. Covers 6 chapters: Algebra, Trigonometry, Exponentials, Differentiation, Integration, and Differential Equations.

## Monorepo Structure

```
enge401-mastery/
├── turbo.json                  # Turborepo pipeline config
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # pnpm workspaces
├── tsconfig.base.json          # Shared TypeScript config
├── .gitignore
├── apps/
│   └── web/                    # Next.js 15 App Router application
└── packages/
    ├── math-engine/            # Core TypeScript math utilities
    ├── exercise-generator/     # Randomised question generators per topic
    └── spaced-repetition/      # FSRS-based review scheduling
```

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+ (`npm install -g pnpm`)

## Installation

```bash
pnpm install
```

## Development

Start all apps and packages in watch mode:

```bash
pnpm dev
```

The web app will be available at [http://localhost:3000](http://localhost:3000).

## Build

Build all packages and apps:

```bash
pnpm build
```

## Tests

Run all tests across the monorepo:

```bash
pnpm test
```

Run tests for a specific package:

```bash
cd packages/math-engine && pnpm test
```

## Lint

```bash
pnpm lint
```

## Database Setup

The project uses Drizzle ORM with SQLite for data persistence.

### Database Schema

The database includes the following tables:

- **users** — Anonymous user authentication with unique anonymous IDs
- **progress** — Exercise completion tracking with accuracy and attempts
- **spaced_repetition** — SM-2 algorithm data for review scheduling
- **study_sessions** — Study session tracking with duration and accuracy
- **calendar_events** — Study scheduling and milestone tracking

### Database Commands

```bash
# Generate migrations from schema changes
cd apps/web && pnpm run db:generate

# Apply pending migrations
pnpm run db:migrate

# Push schema directly (development only)
pnpm run db:push

# Open Drizzle Studio GUI
pnpm run db:studio

# Check migration status
pnpm run db:check
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database Configuration
DATABASE_URL=file:./data/dev.db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Database Connection

Import the database client in your code:

```typescript
import { db, users, progress } from '@/db';

// Query examples
const allUsers = await db.query.users.findMany();
const userProgress = await db.query.progress.findMany({
  where: (progress, { eq }) => eq(progress.userId, userId),
});
```

## Packages

### `@enge401-mastery/math-engine`

Core symbolic math utilities covering all 6 ENGE401 chapters:

- **algebra** — `solveLinearEquation`, `solveQuadratic`, `simplifyExpression`, `expandExpression`, `factorExpression`
- **trig** — `degreesToRadians`, `radiansToDegrees`, `unitCircleValue`, `verifyIdentity`
- **exponentials** — `simplifyExponential`, `solveExponentialEquation`, `compoundGrowth`
- **differentiation** — `differentiate`, `powerRuleDerivative`, `productRuleDerivative`, `chainRuleDerivative`, `nthDerivative`, `quotientRuleDerivative`
- **integration** — `integrate`, `definiteIntegral`, `integrateBySubstitution`
- **diffeq** — `eulerMethod`, `solveSeparable`, `solveFirstOrderLinear`

### `@enge401-mastery/exercise-generator`

Randomised exercise generators for each topic. Each generator returns an `Exercise` object with a LaTeX question, answer, and hints.

### `@enge401-mastery/spaced-repetition`

FSRS-based spaced repetition scheduling wrapping [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs):

- `createNewCard(topic, chapter)` — creates a fresh review card
- `reviewCard(card, rating)` — processes a review and returns the updated card + next due date
- `getDueCards(cards)` — filters cards due for review

### `apps/web`

Next.js 15 App Router application with:

- **Landing page** (`/`) — hero section + chapter grid
- **Chapter pages** (`/chapter/[id]`) — theory placeholder + exercises
- **Practice mode** (`/practice`) — randomised drill mode
- **Dashboard** (`/dashboard`) — progress tracking & spaced repetition stats
- **Components** — `MathDisplay` (KaTeX), `ExerciseCard`, `ChapterNav`, `ProgressBar`

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Turborepo](https://turbo.build/) | Monorepo orchestration |
| [Next.js 15](https://nextjs.org/) | Web application framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety across all packages |
| [mathjs](https://mathjs.org/) | Symbolic math & derivatives |
| [Algebrite](http://algebrite.org/) | CAS (factoring, integration, simplification) |
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | FSRS spaced repetition |
| [KaTeX](https://katex.org/) | Math rendering |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Vitest](https://vitest.dev/) | Unit testing |
| [Drizzle ORM](https://orm.drizzle.team/) | TypeScript ORM |
| [SQLite](https://www.sqlite.org/) | Local database |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite driver |
