# Project Architecture & Code Structure

This document outlines the architecture, code reuse patterns, global modules, and script responsibilities of the WASH website.

## 📄 HTML Layout Guidelines

Every page contains a structured set of at least 6 sections to ensure content density, premium flow, and proper SEO.

### Section Order (Common Public Pages)
1. **Header/Navbar**: Sticky layout with a drop-down menu, direction toggles, and light/dark switches.
2. **Hero Section**: High-resolution generated background image with scroll reveals.
3. **Core Interactive Content**: (Calculators, masonry grids, portfolio sliders, timelines, accordion decks).
4. **Secondary Features or Team Showcase**: Standardized grid cards.
5. **Social Proof / Reviews**: Star ratings, blockquotes, avatars.
6. **CTA Banner & Footer**: Lead collection newsletter form, quick links, contacts, and copyright block.

---

## 🎨 Stylesheets Hierarchy

CSS styles are split into modular stylesheets inside the `assets/css` directory:

1. **[style.css](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/css/style.css)**:
   - Contains all Design Tokens (spacing, typography, shadow systems, custom transitions).
   - Core component styles (buttons, card variants, accordion panels, timeline flows, calculators, slider frames).
   - Primary responsive components (navbars, responsive headers, desktop layouts, dashboard elements).
2. **[dark-mode.css](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/css/dark-mode.css)**:
   - Local properties representing values for background surfaces, border hues, and typographic contrasts when `[data-theme="dark"]` is active.
3. **[responsive.css](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/css/responsive.css)**:
   - Holds break-points media queries for mobile (<640px), tablet (640-1024px), desktop (1024px-1280px).
   - Adjusts mobile typography scaling, grid restructuring, and handles hamburger slide-out behavior.
4. **[rtl.css](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/css/rtl.css)**:
   - Mirrored direction styling adjustments using CSS logical properties (`margin-inline-start`, etc.) when `dir="rtl"` is set on `<html>`.

---

## ⚙️ JavaScript Architecture

The client-side behavior is separated into modular, clean, and zero-dependency scripts:

- **[theme.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/theme.js)**:
  - Detects operating system dark/light preferences.
  - Manages localStorage caching of light/dark toggle selections and manages active attributes on `<html>`.
- **[rtl.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/rtl.js)**:
  - Manages persistent writing of LTR/RTL selections, updates the `dir` attribute on the `<html>` node, and updates buttons.
- **[animations.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/animations.js)**:
  - Features high-performance scroll triggers (via `IntersectionObserver`) for staggered entries, numeric counting tickers, and before/after comparison sliders.
- **[graphs.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/graphs.js)**:
  - Custom Canvas charts logic. Automatically updates chart line and background grid colors based on active system theme events.
- **[dashboard.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/dashboard.js)**:
  - Handles sidebar toggling (expanded / collapsed / off-canvas overlay states) and real-time dashboard data filters.
- **[main.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/main.js)**:
  - Main page controls (navbar menus, validation alerts, toast alerts, lightbox controls).
