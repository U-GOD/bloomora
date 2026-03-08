---
name: bloomora-design-system
description: >-
  Use this skill when implementing Bloomora UI components, styling, color palette, typography,
  animations, and responsive design. Covers the dark garden theme, glassmorphism cards, 
  micro-animations, mobile-first breakpoints, and component design patterns.
author: bloomora-team
---

# Bloomora Design System

## Color Palette

```css
:root {
  /* Core palette */
  --garden-bg: #0A0F1C;
  --garden-bg-secondary: #0F1629;
  --garden-surface: #131B2E;
  --garden-surface-hover: #1A2340;
  --garden-border: rgba(110, 231, 183, 0.1);
  --garden-border-hover: rgba(110, 231, 183, 0.25);

  /* Accent colors */
  --garden-accent: #6EE7B7;          /* Primary green */
  --garden-accent-light: #A7F3D0;
  --garden-gold: #FBBF24;            /* Yield/rewards */
  --garden-gold-light: #FDE68A;
  --garden-danger: #F87171;           /* Risk warnings */
  --garden-info: #60A5FA;             /* Info/ETH blue */

  /* Glow effects */
  --garden-glow: rgba(110, 231, 183, 0.15);
  --garden-glow-strong: rgba(110, 231, 183, 0.3);
  --garden-gold-glow: rgba(251, 191, 36, 0.15);

  /* Text */
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  /* Vault-specific colors */
  --vault-usd: #A78BFA;   /* Purple - lavender */
  --vault-eth: #60A5FA;   /* Blue - oak */
  --vault-btc: #F59E0B;   /* Amber - vine */
  --vault-eur: #34D399;   /* Emerald - tulip */
  --vault-gold: #FBBF24;  /* Gold - sunflower */
}
```

## Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-primary: 'Outfit', system-ui, sans-serif;
}

/* Scale */
.text-display { font-size: 3rem; font-weight: 800; letter-spacing: -0.02em; }
.text-h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.01em; }
.text-h2 { font-size: 1.5rem; font-weight: 600; }
.text-h3 { font-size: 1.25rem; font-weight: 600; }
.text-body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
.text-small { font-size: 0.875rem; font-weight: 400; }
.text-xs { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.05em; }
```

## Glassmorphism Card Pattern

```css
.glass-card {
  background: rgba(19, 27, 46, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(110, 231, 183, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.glass-card:hover {
  border-color: rgba(110, 231, 183, 0.25);
  box-shadow: 0 0 30px rgba(110, 231, 183, 0.08);
  transform: translateY(-2px);
}
```

## Button Styles

```css
/* Primary action (Plant, Deposit) */
.btn-primary {
  background: linear-gradient(135deg, #6EE7B7, #34D399);
  color: #0A0F1C;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(110, 231, 183, 0.4);
}

/* Danger action (Harvest/Redeem) */
.btn-harvest {
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  color: #0A0F1C;
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--garden-border);
  color: var(--text-primary);
}
```

## Responsive Breakpoints (Mobile-First)

```css
/* Base: 360px+ (mobile) */
/* sm: 640px+ */
/* md: 768px+ (tablet) */
/* lg: 1024px+ (desktop) */
/* xl: 1280px+ (wide) */
```

- Garden canvas: Full viewport height on mobile, split view on desktop
- Bottom navigation on mobile, side nav on desktop
- Touch targets: minimum 44x44px
- Font sizes scale down on mobile (clamp())

## Micro-Animations

```css
/* Fade in + slide up */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Gentle pulse for live yield */
@keyframes yieldPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Glow effect for active deposits */
@keyframes gardenGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(110, 231, 183, 0.1); }
  50% { box-shadow: 0 0 40px rgba(110, 231, 183, 0.2); }
}
```

## Component Patterns

- All interactive elements have `:focus-visible` ring
- Loading states: skeleton shimmer (not spinners)
- Success states: green checkmark with confetti
- Error states: red border + toast notification
- Empty states: illustrated placeholder with CTA
