# TINY — Premium Baby & Kids Clothing Store Web Template
## Project Codename: "TINY"

TINY is a premium, fully responsive retail and wholesale storefront built purely with **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. It features absolute clean styling, zero framework dependencies, system dark/light theme syncing, full RTL layout toggles, GOTS organic cotton product listings, and an interactive local storage cart.

## File Structure

```
tiny-clothing-store/
├── index.html (Home Page A - Retail Storefront)
├── home-wholesale.html (Home Page B - Wholesale & School Uniforms)
├── about.html (About Us)
├── shop.html (Shop catalog filters & Sizing tables)
├── product-detail.html (Single Product details & gallery swaps)
├── contact.html (Contact forms & Accordion FAQs)
├── blog.html (Parenting Tips blog posts & Tag cloud)
├── cart.html (Shopping cart & multi-step checkout flow)
├── 404.html (Custom error landing page)
├── coming-soon.html (Interactive count-down pre-launch)
├── assets/
│   ├── css/
│   │   ├── style.css (Global design system & components)
│   │   ├── dark-mode.css (Theme color overrides)
│   │   ├── rtl.css (Right-to-Left alignment rules)
│   │   └── responsive.css (Mobile grid collapsing rules)
│   └── js/
│       ├── main.js (Theme, RTL, & Hamburger controller)
│       ├── cart.js (Local Storage basket logic)
│       └── animations.js (Timers, validators, & reveals)
├── documentation/
│   ├── installation.md
│   ├── customization.md
│   └── changelog.md
└── README.md
```

## Global Design Tokens
- **Primary Color:** Warm Coral/Salmon (`#FF6B6B`)
- **Secondary Color:** Soft Mint/Sage (`#4ECDC4`)
- **Accent Color:** Warm Cream/Ivory (`#FFF5E1`)
- **Headings Font:** `'Nunito', sans-serif`
- **Body Font:** `'Inter', sans-serif`

## Core Features
1. **Dual Home Switcher:** Fast toggling between Home A (Retail) and Home B (Wholesale / School Uniforms) via the navbar dropdown.
2. **Persistence Theme Toggle:** Automatically synchronizes with system preference on first launch, saving user clicks to local storage.
3. **RTL Toggle:** Seamless layout directions translation for languages like Arabic/Hebrew. Button label displays only the active state ("LTR" or "RTL").
4. **Client-Side Cart:** Dynamic item adding, item removal, quantity updates, sales tax addition, free shipping over $100 rule, and promo code code checks (e.g. `TINY10`).
5. **Form Success States:** Contact and Wholesale forms feature inline client validations with tooltips, transitioning into success animations upon validation checks.
6. **No Image Repetition:** Every visual layout utilizes high quality, curated, fully unique Unsplash image resources matching the kids fashion theme.
7. **Scroll Reveals:** Gentle scrolling fade-up triggers as blocks slide into view.
