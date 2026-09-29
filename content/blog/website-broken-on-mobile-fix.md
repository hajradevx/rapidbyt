---
title: "Website Looks Fine on Desktop But Broken on Mobile — How to Fix It"
description: "Overlapping text, buttons that don't work, images that overflow the screen — mobile layout bugs cost you more visitors than you think. Here's how to find and fix every common mobile issue."
date: 2026-10-20
readTime: 8
category: "Performance"
author: "RapidByt Team"
tags: ["mobile responsive", "mobile layout", "CSS", "viewport", "mobile UX", "responsive design"]
image: "/blog/website-broken-mobile.jpg"
---

More than 60% of web traffic is mobile. If your site looks great on your laptop and broken on a phone, you're effectively turning away the majority of your visitors.

The frustrating part: you often don't know. You built and tested the site on a desktop, clients report it on mobile, and by then you've lost countless visitors without a trace in your analytics.

This guide covers every common mobile breakage pattern and how to fix each one.

---

## Step 1: How to Actually Test Mobile Layout

### Option A: Chrome DevTools Device Mode (Fastest)

1. Open Chrome → right-click → Inspect (or F12)
2. Click the device icon in the top toolbar (or Ctrl+Shift+M)
3. Select device from dropdown: iPhone 14, Pixel 7, Samsung Galaxy S21
4. Test at both portrait and landscape orientation
5. Check at 375px width (iPhone SE — the tightest common screen)

**Important:** DevTools simulation is not 100% accurate. Always also test on a real device.

### Option B: Real Device Testing

Send yourself a link and open it on your actual phone. Check:
- Does the page fit the screen without horizontal scrolling?
- Can you read all text without zooming?
- Can you tap all buttons without hitting the wrong one?
- Does the navigation menu work?
- Do all images load?

### Option C: Google's Mobile-Friendly Test

Go to [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly) → enter your URL → see exactly what Google sees and what issues it flags.

---

## Fix 1: Missing or Wrong Viewport Meta Tag

If your site has no viewport meta tag, mobile browsers render it at desktop width and then scale it down — making everything tiny and unreadable.

**Check:** View source (Ctrl+U) and search for `viewport`.

**Fix:** Add this to your `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

This is the single most important mobile fix. Without it, nothing else matters.

**Wrong values to avoid:**

```html
<!-- Prevents users from zooming — bad for accessibility, penalised by Google -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

<!-- Fixed width — breaks on all phone sizes -->
<meta name="viewport" content="width=1200" />
```

---

## Fix 2: Horizontal Scrolling (Content Overflowing the Screen)

The page works but there's a scrollbar at the bottom — you can scroll right to see content that's cut off. This is almost always caused by one element that's wider than the viewport.

**Find the culprit:**

```css
/* Add this temporarily to identify the overflowing element */
* {
  outline: 1px solid red;
}
```

Or in Chrome DevTools console:

```javascript
// Logs every element that's wider than the viewport
document.querySelectorAll('*').forEach(el => {
  if (el.offsetWidth > document.documentElement.offsetWidth) {
    console.log(el);
  }
});
```

**Common causes and fixes:**

```css
/* Fixed-width elements — set a max-width instead */
.container {
  width: 1200px; /* BAD */
  max-width: 1200px; width: 100%; /* GOOD */
}

/* Images wider than their container */
img {
  max-width: 100%;
  height: auto;
}

/* Pre/code blocks that don't wrap */
pre, code {
  overflow-x: auto;
  white-space: pre-wrap;
}

/* Tables — wrap them */
.table-wrapper {
  overflow-x: auto;
}
table {
  min-width: 600px; /* table keeps its structure, wrapper scrolls */
}
```

**Global fix to add to your CSS:**

```css
html, body {
  overflow-x: hidden;
  max-width: 100%;
}
```

---

## Fix 3: Text Too Small to Read

If users have to pinch-and-zoom to read your content, they won't. Google also penalises pages with text under 12px.

**Minimum sizes:**
- Body text: **16px minimum** (14px is too small on mobile)
- Small/caption text: **12px minimum**
- Button text: **14px minimum**

```css
/* Responsive typography */
body {
  font-size: 16px;
}

h1 { font-size: clamp(1.75rem, 5vw, 3rem); }
h2 { font-size: clamp(1.5rem, 4vw, 2.25rem); }
h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); }
p  { font-size: clamp(1rem, 2.5vw, 1.125rem); }
```

`clamp()` gives you a minimum size, a fluid size, and a maximum size — text scales between screen sizes without breakpoints.

---

## Fix 4: Buttons and Links Too Small to Tap

Google's mobile-friendliness guideline requires touch targets to be at least **48×48px** with adequate spacing between them. Small, closely packed links cause mis-taps and frustration.

```css
/* Ensure all interactive elements are tappable */
button,
a,
input[type="submit"],
input[type="checkbox"],
input[type="radio"] {
  min-height: 48px;
  min-width: 48px;
}

/* For inline links, add padding to increase tap area */
nav a {
  padding: 12px 16px;
  display: inline-block;
}
```

---

## Fix 5: Navigation Menu Doesn't Work on Mobile

The hamburger menu opens but tapping menu items doesn't work, or the menu doesn't close after selecting, or links are hidden behind other elements.

**Common causes:**

1. **z-index too low** — menu is behind other elements

```css
.mobile-nav {
  z-index: 9999; /* Make sure it's on top of everything */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
```

2. **Pointer events disabled** — a CSS rule is blocking clicks

```css
/* Check if any parent has pointer-events: none */
.mobile-nav * {
  pointer-events: auto;
}
```

3. **JavaScript not initializing** — the menu toggle script fails silently

Open Chrome DevTools → Console tab → look for errors when you tap the hamburger.

---

## Fix 6: Images Not Displaying Correctly

**Problem: Images overflow or are too large**

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

**Problem: Hero image too tall on mobile, makes the page feel unusable**

```css
.hero {
  height: 80vh; /* Desktop: 80% of viewport height */
}

@media (max-width: 768px) {
  .hero {
    height: 50vh; /* Mobile: shorter */
    min-height: 300px;
  }
}
```

**Problem: Background image not covering correctly on mobile**

```css
.hero-bg {
  background-image: url('/hero.webp');
  background-size: cover;
  background-position: center center;
  /* For mobile, use a portrait-cropped version */
}

@media (max-width: 768px) {
  .hero-bg {
    background-image: url('/hero-mobile.webp'); /* Portrait crop */
    background-position: top center;
  }
}
```

---

## Fix 7: Forms Are Unusable on Mobile

**Problem: Input fields too small to type in**

```css
input, textarea, select {
  font-size: 16px; /* CRITICAL: below 16px triggers iOS auto-zoom */
  padding: 12px 16px;
  width: 100%;
  box-sizing: border-box;
}
```

Setting `font-size: 16px` on inputs prevents iOS Safari from auto-zooming when you tap a field — one of the most annoying mobile UX issues.

**Problem: Form fields too narrow on small screens**

```css
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns on desktop */
  gap: 16px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr; /* Single column on mobile */
  }
}
```

**Problem: Submit button hard to tap**

```css
button[type="submit"] {
  width: 100%; /* Full width on mobile — easy to tap */
  padding: 16px;
  font-size: 16px;
}

@media (min-width: 640px) {
  button[type="submit"] {
    width: auto; /* Back to auto on desktop */
  }
}
```

---

## Fix 8: Two-Column Layouts Stacking Wrong on Mobile

A sidebar layout (content + sidebar) looks fine on desktop but stacks with the sidebar above the main content on mobile — which is wrong.

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 320px; /* Content + sidebar */
  gap: 32px;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr; /* Single column */
  }

  /* Move sidebar below content on mobile */
  .sidebar {
    order: 2;
  }
  .main-content {
    order: 1;
  }
}
```

---

## Fix 9: Videos Breaking the Layout

Embedded YouTube or Vimeo iframes have a fixed `width` and `height` in their default embed code — they overflow on mobile.

```css
/* Responsive video wrapper */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

```html
<!-- Wrap every iframe in this div -->
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/xxxxx" 
    frameborder="0" allowfullscreen></iframe>
</div>
```

---

## Fix 10: Popups Blocking the Entire Screen on Mobile

Google penalises "intrusive interstitials" — popups that cover the main content on mobile. This hurts your ranking AND causes immediate bounces.

**Rules:**
- Popups must have an easy-to-tap close button (minimum 44×44px, clearly visible)
- The close button must not be in a corner where it's easy to miss
- Cookie/GDPR banners should not take up more than 20–25% of the screen
- Full-screen takeover popups on mobile get you penalised by Google

```css
@media (max-width: 768px) {
  .popup {
    width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
    /* Never full-screen on mobile */
  }

  .popup-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 44px;
    height: 44px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

---

## Mobile Fix Priority Order

Work through these first — they cause 90% of mobile issues:

1. **Viewport meta tag** — if missing, nothing else works
2. **Horizontal overflow** — run the JavaScript console check
3. **Font size 16px on inputs** — stops iOS zoom bug
4. **Image max-width: 100%** — global fix that solves most image issues
5. **Navigation z-index and pointer events** — if menu is broken

Then test on a real iPhone and a real Android device — DevTools simulation catches most things but not all.

---

If your mobile layout issues are more complex — a page builder generating bad CSS, a legacy theme with hardcoded widths, or a site that needs to be rebuilt responsively — [request a free audit](/contact). We'll identify every mobile issue and give you a prioritised fix plan within 24 hours.
