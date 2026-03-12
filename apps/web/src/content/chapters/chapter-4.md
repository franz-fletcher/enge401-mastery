# Chapter 4: Differentiation

## Overview

Differentiation is the process of finding the derivative of a function. The derivative represents the instantaneous rate of change of a function at any point, which geometrically corresponds to the slope of the tangent line to the curve at that point.

## Key Concepts

### Rate of Change

**Average rate of change** between $x = a$ and $x = b$:

$$\text{Average rate of change} = \frac{f(b) - f(a)}{b - a}$$

This is the slope of the **secant line** between two points on the curve.

**Instantaneous rate of change** at $x = a$:

$$f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}$$

This is the slope of the **tangent line** at a single point.

### The Derivative

The derivative of $f(x)$ is denoted as:
- $f'(x)$ (Lagrange notation)
- $\frac{dy}{dx}$ or $\frac{d}{dx}[f(x)]$ (Leibniz notation)

The differential operator $d$ means "a little bit of" - so $\frac{dy}{dx}$ represents the ratio of a small change in $y$ to a small change in $x$.

### Differentiability

A function is differentiable at a point if:
1. It is continuous at that point
2. It has no sharp corners or cusps
3. It has no vertical tangent lines

## Formulas

### Basic Differentiation Rules

**Power Rule:**
$$\frac{d}{dx}[x^n] = nx^{n-1}$$

**Constant Rule:**
$$\frac{d}{dx}[c] = 0$$

**Constant Multiple Rule:**
$$\frac{d}{dx}[c \cdot f(x)] = c \cdot f'(x)$$

**Sum/Difference Rule:**
$$\frac{d}{dx}[f(x) \pm g(x)] = f'(x) \pm g'(x)$$

### Standard Derivatives

| Function $f(x)$ | Derivative $f'(x)$ |
|-----------------|-------------------|
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
| $a^x$ | $a^x \ln(a)$ |
| $\ln(x)$ | $\frac{1}{x}$ |
| $\log_a(x)$ | $\frac{1}{x\ln(a)}$ |
| $\sin(x)$ | $\cos(x)$ |
| $\cos(x)$ | $-\sin(x)$ |
| $\tan(x)$ | $\sec^2(x)$ |

### Product and Quotient Rules

**Product Rule:**
$$\frac{d}{dx}[f(x) \cdot g(x)] = f'(x) \cdot g(x) + f(x) \cdot g'(x)$$

**Quotient Rule:**
$$\frac{d}{dx}\left[\frac{f(x)}{g(x)}\right] = \frac{f'(x) \cdot g(x) - f(x) \cdot g'(x)}{[g(x)]^2}$$

### Chain Rule

For composite functions:
$$\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)$$

Or in Leibniz notation:
$$\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$$

## Learning Objectives

1. Understand the concept of a derivative as an instantaneous rate of change
2. Apply the limit definition to find derivatives
3. Use the power rule, product rule, quotient rule, and chain rule
4. Differentiate polynomial, exponential, logarithmic, and trigonometric functions
5. Find equations of tangent and normal lines to curves
6. Apply differentiation to solve optimization problems
7. Use implicit differentiation for functions defined implicitly

---

*Content adapted from ENGE401 Engineering Mathematics Course Manual by Jeff Nijsse (AUT), licensed under CC-BY-4.0*
