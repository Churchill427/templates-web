# SUDZ — Handmade Soap & Bath Product Boutique

This project contains the complete HTML, CSS, and Vanilla JavaScript front-end for SUDZ, a premium, production-quality website showcasing handmade cold-process soaps, bath bombs, and body scrubs.

## Technical Stack
- **HTML5**: Semantic, accessible markup.
- **CSS3**: Hand-written, responsive, vanilla CSS using CSS Variables for theming (light/dark mode) and RTL layout support.
- **Vanilla JavaScript**: Pure JS without libraries/frameworks. Implements Intersection Observer for scroll animations, Cart Management using LocalStorage, Theme toggling, RTL toggling, and native Canvas API for Dashboard charts.

## Features
- **Two Homepages**: Botanical Atelier (index.html) and Modern Apothecary (home-b.html).
- **Responsive Design**: Mobile-first grid layouts, responsive typography.
- **Dark Mode**: Fully styled dark mode toggled via `data-theme="dark"` on the `html` element.
- **RTL Support**: Full layout mirroring via `dir="rtl"` attribute.
- **Animations**: High-performance CSS keyframe and intersection observer fade/scale reveals. Interactive Canvas particle bubbles on the homepage.
- **E-commerce Foundation**: Cart state managed via JS class (`CartManager`) and `localStorage`.
- **Dashboards**: Hand-drawn dashboard charts using pure Canvas 2D API (`assets/js/dashboard.js`).

## File Structure
- `index.html` - Homepage A (Botanical Atelier)
- `home-b.html` - Homepage B (Modern Apothecary)
- `about.html` - Our Story & Makers
- `products.html` - Shop Collection
- `ingredients.html` - Sourcing & Ingredients directory
- `gifting.html` - Gift sets & Corporate concierge
- `contact.html` - Contact forms & FAQ
- `cart.html` - Shopping Cart
- `login.html` & `signup.html` - Authentication flows
- `404.html` - Page not found
- `coming-soon.html` - Coming soon landing page
- `dashboard/`
  - `admin.html` - Store Owner dashboard with charts
  - `user.html` - Customer account & loyalty dashboard
- `assets/`
  - `css/`
    - `style.css` - Core design system and base styles
    - `dark-mode.css` - Dark theme variable overrides and styling tweaks
    - `rtl.css` - RTL specific margin/padding overrides
  - `js/`
    - `main.js` - Global interactivity (cart, theme, animations, nav)
    - `dashboard.js` - Canvas chart rendering

## Running Locally
Since there are no build steps, simply serve the directory via any static HTTP server.

Example using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

## Assets
All icons are inline SVGs. Due to rate limits during generation, placeholders (gradients/CSS shapes) are used for product/hero images.

## Design System
- Primary: #3E5C50 (Sage Green)
- Secondary: #C2764A (Clay Amber)
- Surface/Background: #F6F1E7 (Cream)
- Typography: Fraunces (Headings) & Outfit (Body)
