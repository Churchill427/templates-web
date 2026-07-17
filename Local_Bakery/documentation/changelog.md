# Changelog

All notable changes to the **CRUM — Local Bakery & Cake Shop** template project are documented in this file.

## [1.0.0] - 2026-07-15

### Added
- Created **Home Page A: "The Artisan's Oven"** (`index.html`) with warm, traditional layout, featured bakes carousel, and parallax visit section.
- Created **Home Page B: "Modern Confections"** (`home-b.html`) with sleek contemporary branding, vertical step timeline, 3D flavor lab wheel, and Coverflow signature carousel.
- Created **About Us Page** (`about.html`) showing heritage mission, vertically aligned two-column story, compact team grid, process steps, awards showcase, and custom CTA section.
- Created **Services / Products Page** (`services.html`) with interactive occasion catalog filter, daily fresh menu list with sold-out states, custom tier structures, and wholesale quotation form.
- Created **Book Now Page** (`book-now.html`) featuring multi-step reservation wizard with status bar, real-time input checks, interactive calendar grid, and policy accordion.
- Created **Contact Page** (`contact.html`) featuring input form, social count-up counters, Google Map component, newsletter form, and quick-enquiry inline buttons.
- Created **Blog / News Page** (`blog.html`) featuring main highlight article card, flipping recipe cards, tip listings, and video play previews.
- Created **Portfolio / Gallery Page** (`portfolio.html`) showing custom event sections, lightbox overlay support, drag slider comparisons, and client submitted photo gallery.
- Created **404 Error Page** (`404.html`) with humorous crumb falling visual effect, custom search inputs, mini sitemap guide, and help action buttons.
- Created **Coming Soon Page** (`coming-soon.html`) with automatic countdown timer, list signup success notifications, preview hover image unveils, and testimonials sliders.
- Created **Login Page** (`login.html`) featuring standard input, social connection logins (Google, Apple, Facebook), custom pass visibility toggles, and floating page control panels.
- Created global responsive variables, components styling overrides, custom transitions, animations keyframes, RTL support sheets, and dark-theme configurations.
- Added comprehensive project documentation: `README.md` and `customization-guide.md`.

### Fixed
- Replaced all raw emoji-based favicons (`🥐`) across all 11 HTML pages with proper stylized inline vector SVG icons to adhere to the strict "No Emoji" guideline.
- Resolved styling, padding, and alignment layout wrapping issues on Mobile (360px), Tablet (768px), and Desktop (1024px) viewports across the entire website template.
- Replaced the placeholder/broken image references for the daily fresh bakes (Sourdough, Croissant, Cinnamon Roll, Fruit Danish) on the Home Page (`index.html`) with the user's high-fidelity asset images (`sourdough.jpg`, `croissant.jpg`, `cinnamon.jpg`, and `danish.jpg`).
- Redesigned the "Cake Categories by Occasion" section (`#cake-categories` inside `index.html`) to display as a uniform grid layout of equal height and width cards, responsive across mobile, tablet, and desktop viewports.
- Fixed vertical category grid overlapping bugs by migrating `.category-card` styling from static `min-height` sizes to a clean `height: 100%` auto-stretch system.
- Redesigned the "Custom Order Gallery" section (`#custom-gallery` inside `index.html`) from an asymmetric layout to a uniform 3-column grid design, ensuring all cards render with identical heights and widths across mobile, tablet, and desktop viewports.
- Integrated standard responsive vertical padding to `.visit-section` on `index.html` and `.join-cta` on `about.html`, ensuring clean vertical spacing between sections and preventing cards from touching borders.
- Replaced the clothing racks background image on the Home Page (`index.html`)'s Visit Us section (`#visit-us`) with the bakery counter image (`visit-bg.jpg`) while maintaining scrolling/parallax effect compatibility.
- Fixed vertical alignment offsets of the copyright line and navigation links in the bottom copyright bar (`.footer-bottom`) across all pages by using matching inline-flex attributes and normalized line-height settings.
- Centered the footer bottom copyright bar and links horizontally across all pages, enabling natural column wrapping on mobile viewports.
- Replaced the placeholder/broken image grids in the "Meet Our Team" section (`#team`) of `about.html` with local high-fidelity portrait assets, adjusting names (e.g., Stefano Rossi, David Chen) to match the photo content.
- Integrated a fully interactive Google Maps iframe inside the "Find Us" section of `contact.html` with a floating responsive address overlay card.
- Replaced the mismatched clothing rack hero background image on `contact.html` with the cake showcase gallery image (`contact-hero-bg.jpg`).
- Replaced placeholder/broken recipe card images on `blog.html`, `portfolio.html`, and `home-b.html` with high-fidelity local assets for "No-Knead Artisan Bread" (`recipe-artisan-bread.jpg`) and "Blueberry Scones" (`recipe-blueberry-scones.jpg`).
- Replaced the placeholder video thumbnail grids in the "Behind the Scenes" section of `blog.html` and the incorrect sunglasses hero background on `about.html` with your high-fidelity local behind-the-scenes assets (`bts-piping.jpg`, `bts-chocolate-drip.jpg`, `bts-floral-cake.jpg`, and `visit-bg.jpg`).
- Styled the "Book Now" link as a premium Call-To-Action (CTA) navigation button (`.nav-cta`) using brand-specific typography, gradients, hover transformations, and scroll-adapted color schemes.
- Re-ordered desktop and mobile menus across all 10 active pages to place the "Book Now" CTA tab next to "Contact" as requested.
- Redesigned the "Daily Fresh Menu" on `services.html` into a premium split interactive layout featuring filter buttons, hover spotlight card updates with fade-in previews, circular list item thumbnails, and leader-line connectors managed by `menu.js`.
- Restructured the "Bulk Orders & Catering" section on `services.html` into a three-column equal height layout featuring a centered high-fidelity catering image (`visit-bg.jpg`) that dynamically stretches to match the exact height of the text details and quote form columns.
- Centered description text blocks vertically (`justify-content: center`) inside the left column of the Bulk Orders section to keep them grouped nicely with uniform vertical spacing gaps (`gap: var(--space-xl)`).
- Redesigned the "Our Process" timeline on `about.html` using a 3-column equal grid layout (`1fr 44px 1fr`) on desktop to mathematically center the numbered circles, transitioning to a left-aligned 2-column layout (`44px 1fr`) on viewport sizes under `800px` (fully responsive on `360px`, `768px`, and `1024px`).
- Replaced the old masonry column styles with isolated `.portfolio-grid` and `.portfolio-item` classes on `portfolio.html` to prevent layout overlaps caused by legacy classes in `layout.css`. Configured cards to have a uniform `aspect-ratio: 1/1` and images with `object-fit: cover` to guarantee equal height/width and perfect alignment. Responsive queries map 3 columns on desktop, 2 columns on tablets/pads (`1024px` and `768px`), and a single column on extra small viewports (`360px`).
- Synchronized local high-fidelity cake assets (`cake-white-floral.jpg`, `cake-celestial.jpg`, `cake-wine.jpg`, and `cake-rasmalai.jpg`) to replace external Unsplash placeholder images in `portfolio.html`, `services.html`, and `index.html`.


















