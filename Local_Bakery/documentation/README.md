# CRUM — Local Bakery & Cake Shop

A premium, fully responsive bakery website template built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no dependencies — just hand-crafted, pixel-perfect code.

## Brand Identity

- **Name**: CRUM
- **Industry**: Artisan Bakery & Cake Shop
- **Style**: Warm, premium, craft-focused

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic structure |
| CSS3 (Custom Properties) | Design system, theming |
| Vanilla JavaScript (ES6+) | Interactivity, state management |
| Google Fonts | Playfair Display, Inter, Pacifico |
| Phosphor Icons | Professional iconography |

## Pages (11 Total)

| Page | File | Description |
|---|---|---|
| Home A | `index.html` | "The Artisan's Oven" — warm, traditional bakery feel |
| Home B | `home-b.html` | "Modern Confections" — contemporary, sleek pastry showcase |
| About Us | `about.html` | Heritage, team, process, awards |
| Services | `services.html` | Full menu, cake catalog, pricing tiers |
| Book Now | `book-now.html` | Multi-step booking form with calendar |
| Contact | `contact.html` | Contact form, map, social connect |
| Blog | `blog.html` | Articles, recipes, baking tips |
| Portfolio | `portfolio.html` | Gallery with lightbox, masonry grids |
| 404 Error | `404.html` | Themed error page with navigation help |
| Coming Soon | `coming-soon.html` | Countdown timer, notify signup |
| Login | `login.html` | Authentication (no navbar/footer) |

## Features

### Global Features
- **Dark/Light Theme Toggle** — persisted in localStorage
- **RTL/LTR Toggle** — full bidirectional layout support
- **Responsive Design** — 4 breakpoints (360px, 640px, 1024px, 1280px+)
- **Scroll Reveal Animations** — Intersection Observer-based
- **Parallax Effects** — GPU-accelerated transforms
- **Back to Top Button** — appears after 500px scroll
- **Scroll Progress Bar** — tracks reading position
- **Ripple Effect** — material-design style button clicks
- **Lightbox** — image zoom gallery
- **Toast Notifications** — success/error/info messages
- **Form Validation** — real-time client-side with custom rules
- **Accessible** — keyboard navigation, focus indicators, ARIA labels, screen reader support

### Page-Specific Features
- **Home A**: Seasonal slider, masonry category grid, asymmetric gallery, parallax visit section
- **Home B**: Character reveal animation, 3D carousel, flavor wheel, testimonial cards
- **Services**: Filterable catalog, pricing comparison, bulk order form
- **Book Now**: Multi-step booking wizard, interactive calendar
- **Contact**: Social counters, sticky quick-action bar, map placeholder
- **Blog**: Featured article, recipe cards, video thumbnails
- **Portfolio**: Masonry gallery, lightbox, before/after sliders
- **404**: Crumb scatter animation, search with popular terms
- **Coming Soon**: Live countdown timer, notify form, blurred sneak peeks
- **Login**: Split-screen layout, social login (Google, Apple, Facebook), password toggle

## Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary | Saddle Brown | `#8B4513` |
| Secondary | Wheat | `#F5DEB3` |
| Accent | Chocolate | `#D2691E` |
| Dark Mode Base | Dark Chocolate | `#1A120B` |
| Light Mode Base | Floral White | `#FFFAF0` |
| Text Dark | Coffee Bean | `#2C1810` |
| Text Light | Wheat | `#F5DEB3` |

## File Structure

```
crum-bakery/
├── index.html          (Home A — default)
├── home-b.html         (Home B)
├── about.html
├── services.html
├── book-now.html
├── contact.html
├── blog.html
├── portfolio.html
├── 404.html
├── coming-soon.html
├── login.html
├── assets/
│   ├── css/
│   │   ├── main.css         (variables, reset, utilities)
│   │   ├── components.css   (buttons, cards, forms)
│   │   ├── layout.css       (header, footer, grid)
│   │   ├── animations.css   (keyframes, transitions)
│   │   ├── dark-mode.css    (dark theme overrides)
│   │   ├── rtl.css          (RTL layout adjustments)
│   │   └── responsive.css   (breakpoint queries)
│   └── js/
│       ├── main.js          (theme, RTL, utilities)
│       ├── navigation.js    (navbar, hamburger, dropdowns)
│       ├── animations.js    (scroll reveal, parallax)
│       ├── forms.js         (validation, handling)
│       └── data.js          (mock data for demo)
└── documentation/
    ├── README.md
    ├── customization-guide.md
    └── changelog.md
```

## Quick Start

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. No build tools, no npm, no compilation needed

### With Local Server (recommended)
```bash
npx serve .
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- GPU-accelerated animations (transform/opacity only)
- Lazy-loaded images with blur-up placeholders
- `prefers-reduced-motion` respected
- Target: < 2MB total page weight, < 1.5s FCP, < 3.5s TTI

## Accessibility

- WCAG 2.1 AA contrast ratios
- Semantic HTML5 elements
- Keyboard-navigable interactive elements
- ARIA labels on all icons and controls
- Focus-visible indicators
- Screen reader compatible

## License

All rights reserved. This template is for demonstration purposes.
