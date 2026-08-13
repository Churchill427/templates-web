# SOLE — Premium Footwear E-Commerce

SOLE is a premium, responsive e-commerce web platform for high-end shoe fashion and active footwear. Built using **pure HTML5, CSS3, and Vanilla JavaScript** with zero third-party frameworks.

## Features
- **Curated Multi-Page Architecture**: 13 custom pages designed for maximum aesthetic impact.
- **Dark/Light Mode**: Persisted text-based mode toggle available across all pages.
- **RTL/LTR Translation Layout**: Mirrors layout directions (including icons, inputs, menus, and sidebars) seamlessly when activated.
- **Form validation**: Client-side validation with real-time error tracking and password strength meter.
- **Product Filter & Sort**: Category selector filters, alphanumeric sorting, and real-time search match capabilities.
- **Client-Side Cart & Wishlist**: Cart badge counters and heart state toggles saved locally via `localStorage`.

## File Structure
```
sole/
├── index.html (Home 1 - Default)
├── home-b.html (Home 2 - Alternative)
├── about.html
├── products.html
├── product-detail.html
├── categories.html
├── brands.html
├── collections.html
├── size-guide.html
├── contact.html
├── signup.html
├── 404.html
├── coming-soon.html
├── assets/
│   ├── css/
│   │   ├── main.css (Core design system & reset)
│   │   ├── dark-mode.css (Dark theme theme overrides)
│   │   ├── rtl.css (RTL translation styles)
│   │   ├── animations.css (Keyframe transitions)
│   │   └── responsive.css (Breakpoints layout)
│   └── js/
│       ├── main.js (Theme, translation, toggles)
│       ├── animations.js (Reveal animations)
│       ├── forms.js (Form validation & password strength)
│       └── products.js (Filtering, search, local storage cart)
└── README.md
```

## Setup & Execution
Simply open `index.html` in any modern web browser to view the application. No compile/build commands are required.
