# AGENTS.md

## Quick Start

```bash
pnpm install
pnpm dev
```

## Monorepo Navigation

- Root scripts use Turbo: `dev`, `build`, `test`, `lint`
- Package-specific scripts require navigation to package directory
- Three valid patterns for package scripts:
  - `cd apps/web && pnpm <script>`
  - `pnpm --filter @enge401-mastery/web <script>`
  - `pnpm -C apps/web <script>`

## Script Reference

**Root-level** (run from root):
- `pnpm dev` - Start all dev servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages

**App-specific** (`apps/web`):
- `db:generate` - Generate Drizzle migrations
- `db:migrate` - Run migrations
- `db:push` - Push schema changes
- `db:studio` - Open Drizzle Studio
- `db:check` - Check schema

**Package scripts** (`packages/*`):
- `build` - TypeScript check
- `test` - Vitest run
- `lint` - TypeScript check

## Code Standards

- TypeScript strict mode enabled
- Use `workspace:*` for internal dependencies
- Package naming: `@enge401-mastery/*`

## Common Tasks

```bash
# Start dev server
pnpm dev

# Database operations
cd apps/web && pnpm db:push

# Run tests
pnpm test

# Build all packages
pnpm build
```

## Structure

```
root/           Turbo orchestration
apps/web/       Next.js app with database
packages/
  spaced-repetition/
  math-engine/
  exercise-generator/
```
