# ENGE401 Mastery — Learning Guide

How to use this repo as a TypeScript developer to learn engineering mathematics, chapter by chapter, following the [ENGE401 course manual](https://github.com/millecodex/ENGE401).

---

## The Learning Model: "Understand it well enough to code it"

This repo has three layers, and **your learning happens in the code itself**, chapter by chapter.

### Layer 1: `packages/math-engine/src/` — Implement the maths

Each chapter of the ENGE401 manual maps to a source file where the maths concepts are encoded as TypeScript functions:

| Ch | Manual Topic | File | What you study |
|----|-------------|------|----------------|
| 1 | Algebra | `algebra.ts` | Linear equations, quadratic formula, simplification, factoring |
| 2 | Trigonometry | `trig.ts` | Unit circle, degree/radian conversion, trig identities |
| 3 | Exponentials | `exponentials.ts` | Exponential equations, compound growth, logarithms |
| 4 | Differentiation | `differentiation.ts` | Power/product/quotient/chain rules, nth derivatives |
| 5 | Integration | `integration.ts` | Antiderivatives, definite integrals, substitution |
| 6 | Diff Equations | `diffeq.ts` | Euler's method, separable & first-order linear ODEs |

You can't write (or read) this code without understanding the underlying maths. For example, the quadratic formula in `algebra.ts`:

```typescript
export function solveQuadratic(a: number, b: number, c: number): [number, number] | null {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const sqrtD = Math.sqrt(discriminant);
  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);
  return [x1, x2];
}
```

Or the chain rule in `differentiation.ts`:

```typescript
export function chainRuleDerivative(outer: string, inner: string): string {
  const outerPrime = differentiate(outer, 'u');
  const innerPrime = differentiate(inner, 'x');
  const substituted = outerPrime.replace(/\bu\g, `(${inner})`);
  return simplify(`(${substituted}) * (${innerPrime})`).toString();
}
```

### Layer 2: `packages/math-engine/__tests__/` — Verify your understanding

Each chapter has a test file. This is where you **prove you understand the concept** — if you can predict what the test expects, you understand the maths:

| Ch | Test file |
|----|-----------|
| 1 | `__tests__/algebra.test.ts` |
| 2 | `__tests__/trig.test.ts` |
| 3 | `__tests__/exponentials.test.ts` |
| 4 | `__tests__/differentiation.test.ts` |
| 5 | `__tests__/integration.test.ts` |
| 6 | `__tests__/diffeq.test.ts` |

Run them with:

```bash
cd packages/math-engine && pnpm test
```

### Layer 3: `packages/exercise-generator/src/` — Drill yourself with random problems

Each chapter has an exercise generator that creates randomised practice problems at varying difficulty levels (`easy`, `medium`, `hard`), using the math-engine to compute the correct answer:

| Ch | Generator file |
|----|---------------|
| 1 | `algebra-exercises.ts` |
| 2 | `trig-exercises.ts` |
| 3 | `exponential-exercises.ts` |
| 4 | `differentiation-exercises.ts` |
| 5 | `integration-exercises.ts` |
| 6 | `diffeq-exercises.ts` |

---

## Chapter-by-Chapter Workflow

For **each chapter (1 → 6)**, follow these steps:

### 1. Read the manual chapter

Go to [millecodex/ENGE401](https://github.com/millecodex/ENGE401) and read the corresponding chapter to understand the theory.

### 2. Study the math-engine source

Open the relevant file in `packages/math-engine/src/` (e.g. `algebra.ts` for Chapter 1). Read the functions, trace the formulas, and understand *why* the code works.

### 3. Run the tests

```bash
cd packages/math-engine && pnpm test
```

Try to **predict the output** before you see it. If you can explain why `solveQuadratic(1, -5, 6)` returns `[3, 2]`, you understand the quadratic formula.

### 4. Extend the code

Add new test cases for edge cases you find in the manual, or add new functions for topics the engine doesn't cover yet. This is where the deepest learning happens.

### 5. Try the exercise generator

Look at how the randomised problems are built in `packages/exercise-generator/src/`. Then run the web app and practise interactively:

```bash
pnpm dev
# Open http://localhost:3000/practice
```

Select a chapter and difficulty, and work through the generated exercises.

### 6. Use spaced repetition

The `/dashboard` page (http://localhost:3000/dashboard) tracks what's due for review via FSRS scheduling. The `packages/spaced-repetition/` package handles the scheduling algorithm. Consistent short daily sessions work better than occasional long ones.

---

## Quick Reference: Getting Started

```bash
# Prerequisites: Node.js v20+, pnpm v9+
git clone https://github.com/franz-fletcher/enge401-mastery.git
cd enge401-mastery
pnpm install

# Run all tests
pnpm test

# Run tests for a specific chapter's math engine
cd packages/math-engine && pnpm test

# Start the web app
pnpm dev
# Open http://localhost:3000
```

---

## Tips

- **Start with Chapter 1 (Algebra)** even if you're comfortable — the later chapters build on it.
- **Use the manual alongside the code** — the theory sections in the web app link directly to the ENGE401 manual for full explanations, worked examples, and derivations.
- **The core idea: if you can implement the maths in TypeScript, you understand the maths.** The tests are your proof.
- **Increase difficulty gradually** in practice mode — start on Easy, move to Medium once you're comfortable, then Hard.
- **Practice daily** — the spaced repetition system works best with consistent short sessions.