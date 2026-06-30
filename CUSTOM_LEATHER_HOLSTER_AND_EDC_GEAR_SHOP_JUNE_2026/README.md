# GRAIN Leather Works — Custom Leather Holster & EDC Gear Shop

A 14-page static website built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools. Handcrafted code for a handcrafted leather brand.

---

## Project Structure

```
CUSTOM_LEATHER_HOLSTER_AND_EDC_GEAR_SHOP_JUNE_2026/
|-- index.html              # Home Primary (Classic View)
|-- home-alt.html           # Home Secondary (Modern View)
|-- about.html              # About Us
|-- services.html           # Services & Pricing
|-- products.html           # Product Listing
|-- portfolio.html          # Gallery & Portfolio
|-- blog.html               # The GRAIN Journal
|-- contact.html            # Contact Us
|-- login.html              # Login (no nav/footer)
|-- signup.html             # Sign Up (no nav/footer)
|-- admin-dashboard.html    # Admin Dashboard
|-- user-dashboard.html     # User Dashboard
|-- profile.html            # User Profile
|-- 404.html                # Error Page
|-- coming-soon.html        # Coming Soon
|-- assets/
|   |-- css/
|   |   |-- style.css           # Main design system (2800+ lines)
|   |   |-- dark-mode.css       # Dark theme overrides
|   |   |-- rtl.css             # RTL layout overrides
|   |-- js/
|   |   |-- main.js             # Theme/RTL toggles, nav, animations
|   |   |-- forms.js            # Form validation & file upload
|   |   |-- dashboard.js        # Sidebar, charts, kanban, chat
|   |   |-- plugins/
|   |       |-- countdown.js    # Countdown timer
|   |-- images/                 # Local images (using Unsplash CDN)
|-- documentation/              # Reserved for docs
|-- README.md
```

## Design System

### Colors (Tri-Color Palette)
| Token           | Hex       | Usage                        |
|-----------------|-----------|------------------------------|
| Primary         | `#8B4513` | Deep Saddle Brown            |
| Secondary       | `#4A4A4A` | Gunmetal Gray                |
| Accent          | `#B87333` | Burnished Copper             |

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Base size**: 16px, 8px spacing unit

### Breakpoints
| Name    | Width    | Usage              |
|---------|----------|--------------------|
| Mobile  | 360px    | Small phones       |
| Tablet  | 768px    | Tablets/landscape  |
| Desktop | 1024px   | Standard desktop   |
| Wide    | 1280px   | Large screens      |

## Features

### Global
- Dark / Light mode toggle (persisted in localStorage)
- RTL / LTR layout toggle (persisted in localStorage)
- Responsive hamburger menu for mobile
- Smooth scroll & intersection observer animations
- Back-to-top button
- WCAG 2.1 AA accessibility

### Pages (14 total, 6 sections each)
- **Home Primary**: Hero, craftsmanship, collections, materials, testimonials, CTA
- **Home Secondary**: Hero, process timeline, EDC compatibility, leather deep-dive accordion, production gallery, newsletter
- **About**: Story, team, workshop tour, quality standards
- **Services**: Holster types, EDC accessories, leather care, pricing tiers
- **Products**: Product grid with filters/sort, comparison table, ratings
- **Portfolio**: Masonry gallery with filter pills, featured projects, reviews
- **Blog**: Featured article, article grid, categories, tags
- **Contact**: Contact info, form with validation, FAQ accordion, location
- **Login**: Single-viewport auth page, social login, password toggle
- **Signup**: Single-viewport auth page, password strength indicator
- **Admin Dashboard**: Stats, revenue chart, order table, kanban board, notifications
- **User Dashboard**: Order tracking, gear upload, sketch approval, material picker, chat
- **Profile**: Personal info, gear collection, order history, security
- **404**: Error message, navigation suggestions, search pills
- **Coming Soon**: Countdown timer, teaser cards, email notify

### Interactive Components
- Accordion (leather types, FAQ)
- File upload with drag-and-drop + progress bar
- Form validation (real-time blur + submit)
- Kanban drag-and-drop board
- Sketch zoom/pan viewer
- Material combination preview
- Live chat interface
- Countdown timer
- Password strength indicator
- Product filter pills

### Charts (via Chart.js CDN)
Admin Dashboard:
1. Monthly Revenue (Line)
2. Order Status (Bar)
3. Customer Acquisition (Doughnut)
4. Capacity vs Demand (Area)

User Dashboard:
1. Order History (Line)
2. Gear Types Ordered (Horizontal Bar)
3. Sketch Approval Status (Doughnut)
4. Production Progress (Area)

## Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Structure  | HTML5 (Semantic)         |
| Styling    | Vanilla CSS (Variables)  |
| Logic      | Vanilla JavaScript       |
| Icons      | Phosphor Icons (CDN)     |
| Fonts      | Google Fonts (CDN)       |
| Charts     | Chart.js 4.x (CDN)      |
| Images     | Unsplash (CDN URLs)      |

## Usage

1. Open `index.html` in a browser
2. Or use a local server: `npx serve`
3. No build step required

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

---

*Handcrafted in Bozeman, Montana. &copy; 2026 GRAIN Leather Works.*
