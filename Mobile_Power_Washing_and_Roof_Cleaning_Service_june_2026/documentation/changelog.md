# Project Changelog & Updates

## [1.0.0] — 2026-06-11

### Added
- Completed implementation of all **14 HTML pages** including specific public sections, dashboards, authentication flows, error pages, and teaser pages.
- Built a **custom zero-dependency Canvas chart library** (`assets/js/graphs.js`) supporting Line, Bar, Doughnut, and Progress visualizations with dynamic theme adjustments.
- Designed a **Pricing Estimator** supporting surface area multiplier rates and difficulty adjustments.
- Developed an **animations module** (`assets/js/animations.js`) with float effects, count-up numbers, visual sliders, and teaser countdown clocks.
- Created fully responsive and logic-mirrored configurations in **responsive.css** and **rtl.css** supporting small smartphones (360px) up to wide monitors (>1280px).
- Published search engine index components: **robots.txt**, **sitemap.xml**, and structured LocalBusiness microdata scripts.
- Added a "Dashboard" dropdown menu directly to the public navigation bar and mobile menu across all public-facing pages (Home A, Home B, About, Services, Portfolio, Booking, Blog, Contact, 404).
- Replaced the "Book Now" header action button and mobile-menu link with a "Login" button pointing to `login.html` across all 9 public-facing pages.

### Improved
- Unified **brand logo typography, weight, color, and size** into a single cohesive badge pattern across the navbar, footer, login/register headers, dashboard sidebar headers, and favicon.
- Fixed layout structure for dashboards by migrating sidebar toggles and spacing targets in responsive styles to use correct `.dashboard-main` targets (resolving unstyled stacked layout bugs).
- Integrated dark-mode adaptive active colors for dashboard elements.
- Fixed RTL direction layout consistency in `rtl.css` by removing `flex-direction: row-reverse` overrides on `.navbar .container`, `.navbar-nav`, and `.navbar-actions`, permitting natural Right-to-Left header mirroring.
- Fixed RTL mobile menu hamburger positioning by removing the `order: -1` property in `rtl.css`, correctly placing the logo on the right and hamburger on the left.
- Added LTR/RTL toggle buttons (`.rtl-toggle`) to the topbars of `dashboard-user.html` and `dashboard-admin.html` to establish consistent language toggle layout patterns across all site views.
- Centered and stacked copyright information and policy/terms links inside `.footer-bottom` across all viewport sizes, adding a subtle border line separator and removing redundant mobile overrides.
- Standardized and unified the 4-column footer structure across all public-facing pages (index, home-b, booking, services, portfolio, blog, contact, and 404) to render identical brand, quick links, services, contact address details, and subscription form assets.
- Updated footer social links on all 9 public-facing pages to consistently display only Facebook, Instagram, and Twitter (removing Google and Yelp) and added hover styling for the Twitter icon.
- Replaced the static Google Maps placeholder on `contact.html` with a live, responsive, and interactive Google Maps iframe embed for "123 Clean Street, Springfield, IL".
- Reconfigured `.social-login-btn` CSS alignment rules to align the logos and text of Google, Facebook, and Apple options in a straight vertical line across LTR and RTL directions.
- Introduced a `.social-login-btn.icon-only` helper class on `signup.html` to keep side-by-side icon-only social buttons centered.
- Relocated the theme toggle and direction buttons (`.auth-toggles`) to the top-right of the `.auth-card` on authentication pages (`login.html` and `signup.html`), positioned using logical CSS inline properties for RTL compliance, and added mobile layout overrides to ensure zero overlap.
- Aligned the stats overview cards section on the user and admin dashboards in a 2x2 grid, establishing explicit responsiveness at 1024px, 768px, and 360px.
- Fixed display collapse bugs for anchor cards by setting `.card` to `display: block` in `style.css`, and configured the dashboard main section width to expand to `100%` on mobile devices in `responsive.css` to fix layout compression bugs.
- Aligned the Quick Actions section in the admin dashboard in a 2x2 grid format, responsive to 1024px, 768px, and 360px.
- Fixed dashboard header button distortion and spacing issues on mobile screen widths by adding `flex-shrink: 0` to toolbar toggles and hiding the search bar under 640px.
- Fixed user avatar oval distortion bug on mobile dashboard screen widths by adding `flex-shrink: 0` to the inline styles of the avatar element.












