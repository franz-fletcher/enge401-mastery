# Chapter 5: Integration

## Overview

In mathematics we are often given a function $f$ and asked to find a function $F$ whose derivative is $f$. $F$ in this situation is called the **integral** of $f$. The terms integration and anti-differentiation are synonymous.

The process of "reversing" or "undoing" a derivative has its own symbol, the integrand: $\displaystyle\int$

$$\int f'(x)\, dx = f(x) + C$$

## Key Concepts

### Indefinite Integrals

An indefinite integral $\int f(x)\, dx$ represents a family of functions (all antiderivatives of $f$). These use a constant $C$ called the **constant of integration**, where $C$ takes a different value for each member of the family.

### Definite Integrals

A definite integral $\int_a^b f(x)\, dx$ represents a number - the signed area under the curve between $x = a$ and $x = b$.

**Evaluation Theorem:**
$$\int_a^b f(x)\, dx = \left[\int f(x)\, dx\right]_a^b = F(b) - F(a)$$

### The Power Rule for Integration

$$\int x^n\, dx = \frac{x^{n+1}}{n+1} + C, \quad \text{where } n \neq -1$$

**Special case:** When $n = -1$:
$$\int \frac{1}{x}\, dx = \ln|x| + C$$

## Formulas

### Standard Integrals

| Function $f(x)$ | Integral $\int f(x)\, dx$ |
|-----------------|---------------------------|
| $1$ | $x + C$ |
| $A$ (constant) | $Ax + C$ |
| $x^n$, $n \neq -1$ | $\frac{x^{n+1}}{n+1} + C$ |
| $e^x$ | $e^x + C$ |
| $\frac{1}{x}$ | $\ln|x| + C$ |
| $\ln(x)$ | $x\ln|x| - x + C$ |
| $\sin(x)$ | $-\cos(x) + C$ |
| $\cos(x)$ | $\sin(x) + C$ |
| $\sec^2(x)$ | $\tan(x) + C$ |
| $\tan(x)$ | $\ln|\sec(x)| + C$ |

### Integration Rules

**Sum Rule:**
$$\int [f(x) + g(x)]\, dx = \int f(x)\, dx + \int g(x)\, dx$$

**Constant Multiple Rule:**
$$\int c \cdot f(x)\, dx = c \int f(x)\, dx$$

### Integration Techniques

**Substitution (u-substitution):**
If $u = g(x)$, then $du = g'(x)\, dx$ and:
$$\int f(g(x)) \cdot g'(x)\, dx = \int f(u)\, du$$

**Integration by Parts:**
$$\int u\, dv = uv - \int v\, du$$

Choose $u$ using the LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential).

### Area and Volume Applications

**Area between curves:**
$$A = \int_a^b [f(x) - g(x)]\, dx$$

where $f(x) \geq g(x)$ on $[a, b]$.

**Volume of revolution (disk method):**
$$V = \pi \int_a^b [f(x)]^2\, dx$$

## Learning Objectives

1. Understand integration as the reverse process of differentiation
2. Evaluate indefinite integrals using basic rules
3. Evaluate definite integrals using the Fundamental Theorem of Calculus
4. Apply the power rule, sum rule, and constant multiple rule
5. Use substitution to evaluate integrals
6. Apply integration by parts for products of functions
7. Calculate areas between curves and volumes of revolution

---

*Content adapted from ENGE401 Engineering Mathematics Course Manual by Jeff Nijsse (AUT), licensed under CC-BY-4.0*
