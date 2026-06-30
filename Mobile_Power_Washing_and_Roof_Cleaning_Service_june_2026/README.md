# SHINE — Mobile Power Washing & Roof Cleaning Service Website

SHINE is a premium, fully-responsive, tri-color website built for the exterior cleaning industry. It features a complete design system with custom CSS variables, dark/light mode toggle, RTL/LTR support, local SEO optimizations, Canvas-based animated data visualizations, and interactive widgets.

## 🌟 Key Features

- **10 Complete HTML Pages**: Handcrafted semantic layouts with unique designs.
- **Tri-Color Design System**: Curated brand colors (Deep Ocean Blue, Fresh Mint Green, Warm Amber) defined via CSS Custom Properties.
- **Light & Dark Mode**: Persistent theme settings synced with system preferences.
- **RTL & LTR Support**: Complete layout mirroring via CSS logical properties and script management.
- **Interactive Tools**: Built-in pricing estimator (real-time surface area calculations) and multi-step booking form.
- **Fully Accessible & Responsive**: Complies with keyboard navigation, aria-labels, touch targets (min 44px), and fluid breakpoints.
- **SEO Ready**: Structured LocalBusiness JSON-LD, description tags, sitemap, and robots.txt.

## 📁 Directory Structure

```text
├── assets/
│   ├── css/
│   │   ├── style.css           # Core styling and component library
│   │   ├── dark-mode.css       # Theme overrides
│   │   ├── rtl.css             # Logical logical properties for RTL support
│   │   └── responsive.css      # Fluid media queries & mobile layouts
│   ├── js/
│   │   ├── main.js             # General page functionality & validations
│   │   ├── theme.js            # Light/dark theme toggle
│   │   ├── rtl.js              # LTR/RTL layout toggle
│   │   └── animations.js       # Scroll reveal, counters, sliders
│   └── images/
│       ├── hero/               # Page hero backgrounds and CTA images
│       ├── services/           # Service-specific card photography
│       ├── portfolio/          # Before/after case study pairs
│       └── icons/              # Favicon SVG and branding assets
├── pages/
│   ├── index.html              # Home A Layout
│   ├── home-b.html             # Home B (Seasonal and Estimator layout)
│   ├── services.html           # Services page with pricing estimator
│   ├── about.html              # Story, mission, team, and stats
│   ├── portfolio.html          # Dynamic portfolio gallery & lightbox
│   ├── booking.html            # Multi-step booking flow
│   ├── blog.html               # Professional tips and articles
│   ├── contact.html            # Interactive form, map, and FAQ
│   ├── 404.html                # Custom animated error page
│   └── coming-soon.html        # Launch countdown landing page
├── documentation/              # Technical integration sheets
├── robots.txt                  # Search engine directives
└── sitemap.xml                 # XML sitemap index
```

## 🛠️ Quick Start

To run the site locally without any installation:

1. **Option A (Python)**:
   ```bash
   python -m http.server 8080
   ```
2. **Option B (Node.js)**:
   ```bash
   npx http-server -p 8080
   ```
3. Open your browser and navigate to: [http://localhost:8080/pages/index.html](http://localhost:8080/pages/index.html).

## 📖 Technical Documentation

For in-depth guides, check the files inside the `documentation/` folder:
- [Installation Guide](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/documentation/installation.md)
- [Customization Guide](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/documentation/customization.md)
- [Project Architecture](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/documentation/structure.md)
- [Release Changelog](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/documentation/changelog.md)
