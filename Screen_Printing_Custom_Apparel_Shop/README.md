# PRNT — Industrial Screen Printing & Custom Apparel Web Application

**PRNT** is a high-performance, industrial-creative web application built for screen printing shops, apparel manufacturers, and corporate merchandise suppliers.

---

## 🎨 Technology Stack
- **HTML5** (Semantic structure, complete accessibility, unique element IDs)
- **CSS3** (Pure vanilla CSS with custom variables, glassmorphism, responsive grid, flexbox layout)
- **Vanilla JavaScript** (Zero frameworks, zero external JS dependencies)
- **Icons**: FontAwesome 6.5 loaded via CDN (NO emojis used in UI)
- **Typography**: Google Fonts (`Barlow Condensed`, `Inter`, `JetBrains Mono`)

---

## 📄 Site Architecture & Pages (15 Total)

### Core Pages
1. **`index.html`** — Home 1 (Production Powerhouse)
   - Hero video simulation, live statistics counter strip, 6 core print services cards, interactive quote calculator widget, 8-step process timeline, client logo ticker, testimonial carousel, CTA band.
2. **`home-alt.html`** — Home 2 (Creative Studio)
   - Dark aesthetic, interactive canvas print mockup, technique showcase tabber, apparel catalog spotlight, case studies split layout, Instagram grid.
3. **`about.html`** — About PRNT & Factory Tour
   - Industrial history timeline, 4-stat counters, interactive virtual factory tour floorplan, press line specs, 4 team cards, quality guarantee card.
4. **`products.html`** — Blank Apparel Catalog
   - Filterable sidebar, 8 apparel cards with color swatch selectors, live price calculation by quantity tier, grid/list view toggle, search bar.
5. **`bulk.html`** — Bulk & Corporate Orders
   - 3 corporate service cards, 3-step multi-step quote request form, 2 case study split cards, turnaround logistics grid with interactive map placeholder.
6. **`design-guide.html`** — Artwork Upload & Preparation Guide
   - File requirements specs, 4-step upload process, interactive design contrast checker widget, vector vs raster comparison table, do's & don'ts list.
7. **`contact.html`** — Contact & Custom Quote Request
   - Full quote request form with file dropzone, contact info cards, location map placeholder, social links, mini FAQ accordion.
8. **`blog.html`** — Screen Printing Industry Journal
   - Featured article header, 6 article cards grid with tag filtering, video spotlight card, newsletter subscription.
9. **`cart.html`** — Cart & Order Checkout Summary
   - Interactive quantity steppers, artwork notes input, delivery method toggles, dynamic price summary with tax & shipping calculations.

### Dashboards & Auth
10. **`dashboard-admin.html`** — Master Printer Control Center
    - Sidebar, topbar with search & notifications, 4 KPI stat cards with sparklines, **8 hand-rolled HTML5 Canvas Charts**, machinery telemetry grid with speed & pause controls, live print queue table.
11. **`dashboard-user.html`** — Client Portal & Proof Studio
    - Client portal sidebar, order status visual stepper (Order Received -> Shipped), **interactive proof approval studio canvas mockup**, Pantone swatches, 1-click reorder table.
12. **`login.html`** — Sign In Portal
    - Industrial split-screen layout, client/admin tab switcher, show/hide password toggle, social SSO buttons.
13. **`signup.html`** — Account Registration
    - Account type selector (Corporate / Brand / Personal), password strength meter bar, terms checkbox.

### System Pages
14. **`404.html`** — Error Page
    - Creative "Screen Mesh Misaligned" theme, **interactive squeegee ink-cleaning canvas Easter Egg widget**, site search.
15. **`coming-soon.html`** — Teaser Page
    - PRNT v2.0 3D Studio teaser, **live real-time countdown timer script**, VIP early access email form, feature cards.

---

## ⚡ Features & Interactivity
- **Dark Mode & Light Mode**: Global toggle stored in `localStorage` with `data-theme` attribute.
- **RTL / LTR Support**: Full Right-to-Left language layout switching.
- **Hand-Rolled HTML5 Canvas Charts**: 8 distinct chart types (Line, Area, Bar, Horizontal Bar, Doughnut, Radar, Polar, Progress Ring).
- **Interactive Widgets**:
  - Live Instant Price Calculator
  - Design Contrast Checker Widget (WCAG Compliance)
  - Proof Approval Mockup Viewer
  - Squeegee Ink Cleaner Easter Egg Canvas
  - Live Countdown Timer
- **Micro-Animations**: Scroll reveal observers, hover lift effects, squeegee motion keyframes.

---

## 🚀 How to Run Locally
1. Clone or download the repository.
2. Open `index.html` in any web browser (no local server or build tools required).
3. Optionally use a local server like Live Server for instant preview.
