# Chapter 6: Differential Equations

## Overview

Any equation involving derivatives of a function can be called a **differential equation**. For example, $\frac{dy}{dx} = 2x$ says "the derivative equals $2x$." As the derivative of $x^2$, this simple equation also represents a rate-of-change as a function of $x$.

Differential equations can arise when we formulate mathematical models of physical phenomena. They have the possibility of predicting the future by describing how quantities change over time.

## Key Concepts

### Order of a Differential Equation

The **order** of a differential equation is the order of the highest derivative present.

- **First order:** $\frac{dN}{dt} = kN$ (highest derivative is first)
- **Second order:** $m\frac{d^2x}{dt^2} = -kx$ (highest derivative is second)

### Solution of a Differential Equation

When asked to "solve" a differential equation, you are expected to find **all possible solutions**. The solution is another function (not a number).

**Example:** Find all solutions of $\frac{dy}{dx} = 2x$

By integrating: $y = x^2 + C$

where $C$ is an arbitrary constant.

### Initial Value Problems

An initial value problem consists of:
1. A differential equation
2. An initial condition (e.g., $y(0) = y_0$)

The initial condition allows us to determine the specific value of $C$.

### Separable Equations

A first-order differential equation is **separable** if it can be written as:

$$\frac{dy}{dx} = f(x) \cdot g(y)$$

**Solution method:**
1. Separate variables: $\frac{dy}{g(y)} = f(x)\, dx$
2. Integrate both sides: $\int \frac{dy}{g(y)} = \int f(x)\, dx$
3. Solve for $y$ if possible

## Formulas

### Population Growth Model

The basic model for population growth:

$$\frac{dN}{dt} = kN$$

**Solution:**
$$N(t) = N_0 e^{kt}$$

where:
- $N(t)$ = population at time $t$
- $N_0$ = initial population ($N$ at $t = 0$)
- $k$ = growth rate constant
- $k > 0$ for growth, $k < 0$ for decay

### Newton's Law of Cooling

$$\frac{dT}{dt} = -k(T - T_{env})$$

where $T_{env}$ is the environmental temperature.

### Simple Harmonic Motion

$$m\frac{d^2x}{dt^2} = -kx$$

or

$$\frac{d^2x}{dt^2} + \omega^2 x = 0$$

where $\omega = \sqrt{\frac{k}{m}}$

**General solution:**
$$x(t) = A\cos(\omega t) + B\sin(\omega t)$$

or equivalently:
$$x(t) = C\cos(\omega t + \phi)$$

### First-Order Linear ODE

Standard form:
$$\frac{dy}{dx} + P(x)y = Q(x)$$

**Integrating factor:**
$$\mu(x) = e^{\int P(x)\, dx}$$

**Solution:**
$$y = \frac{1}{\mu(x)}\int \mu(x)Q(x)\, dx$$

## Learning Objectives

1. Identify the order of a differential equation
2. Verify that a given function is a solution to a differential equation
3. Solve separable first-order differential equations
4. Solve initial value problems
5. Apply differential equations to model population growth and decay
6. Solve first-order linear differential equations using integrating factors
7. Understand applications in physics and engineering (cooling, motion, circuits)

---

*Content adapted from ENGE401 Engineering Mathematics Course Manual by Jeff Nijsse (AUT), licensed under CC-BY-4.0*
