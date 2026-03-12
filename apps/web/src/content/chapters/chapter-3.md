# Chapter 3: Exponential and Logarithmic Functions

## Overview

We defined the polynomial $a^x$ in Chapter 1, however $x$ was restricted to rational numbers. We now want to explore $a^x$ where $x$ is any real number. Consider $y = 2^x$. This is an *exponential* function because the variable $x$ is in the exponent.

## Key Concepts

### The Exponential Function $f(x) = a^x$

Let $y = a^x$ where $a > 0$. Here, $f(x) = a^x$ is called an **exponential function** where $a$ is called the **base**.

- **Domain:** The set of real numbers, $\mathbb{R}$
- **Range:** $(0, \infty)$
- The $x$-axis forms an asymptote

**Growth vs Decay:**
- When $0 < a < 1$: $y = a^x$ "decays" as $x$ gets large
- When $a > 1$: $y = a^x$ "grows" as $x$ gets large

### The Natural Exponential Function

The special base $e \approx 2.71828...$ gives the natural exponential function:

$$f(x) = e^x$$

This function has unique properties that make it fundamental in calculus and engineering applications.

### Logarithmic Functions

The logarithm is the inverse of the exponential function. If $y = a^x$, then:

$$x = \log_a(y)$$

**Key properties:**
- $\log_a(a^x) = x$
- $a^{\log_a(x)} = x$
- $\log_a(1) = 0$
- $\log_a(a) = 1$

### Natural Logarithm

When the base is $e$, we write $\ln(x)$ instead of $\log_e(x)$:

$$y = \ln(x) \iff x = e^y$$

## Formulas

### Exponent Rules
$$a^m \cdot a^n = a^{m+n}$$

$$\frac{a^m}{a^n} = a^{m-n}$$

$$(a^m)^n = a^{mn}$$

$$a^{-n} = \frac{1}{a^n}$$

$$a^{\frac{m}{n}} = \sqrt[n]{a^m}$$

### Logarithm Rules
$$\log_a(xy) = \log_a(x) + \log_a(y)$$

$$\log_a\left(\frac{x}{y}\right) = \log_a(x) - \log_a(y)$$

$$\log_a(x^n) = n\log_a(x)$$

$$\log_a(x) = \frac{\log_b(x)}{\log_b(a)} \quad \text{(change of base)}$$

### Transformations of Exponential Functions

| Transformation | Effect |
|----------------|--------|
| $y = a \cdot f(x)$ | Vertical stretch by factor $a$ |
| $y = f(bx)$ | Horizontal stretch by factor $\frac{1}{b}$ |
| $y = f(x) + c$ | Vertical shift up by $c$ |
| $y = f(x - d)$ | Horizontal shift right by $d$ |
| $y = -f(x)$ | Reflection in $x$-axis |
| $y = f(-x)$ | Reflection in $y$-axis |

## Learning Objectives

1. Evaluate exponential functions for given inputs
2. Graph exponential functions and identify key features
3. Apply the laws of exponents to simplify expressions
4. Convert between exponential and logarithmic forms
5. Apply the laws of logarithms to simplify expressions
6. Solve exponential and logarithmic equations
7. Model growth and decay problems using exponential functions

---

*Content adapted from ENGE401 Engineering Mathematics Course Manual by Jeff Nijsse (AUT), licensed under CC-BY-4.0*
