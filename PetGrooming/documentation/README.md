# Pawly — Pet Grooming & Care Salon Workspace

Premium, responsive client site mockup built strictly using semantic HTML5, CSS3 transitions/grid/flexbox design systems, and vanilla ES6+ JavaScript modules.

---

## Brand Architecture & Color Tokens

- **Title/Logo Brand:** PAWLY (sole brand identifier, strictly 4-letter title)
- **Primary Tone:** Forest Green (`#2D6A4F` & `#1B4332`) — Veterinary-grade professionalism
- **Secondary Tone:** Sand/Cream Accent (`#F4A261` & `#E9C46A`) — Cozy salon warmth
- **Error Tone:** Coral Red (`#E76F51`)
- **Spacing Principle:** 8px base grid systems rules.
- **Languages:** Built-in LTR & RTL support attributes selector.
- **Themes:** Light and Dark mode options.

---

## Directory Overview

```text
PetGrooming/
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design tokens
│   │   ├── base.css           # Typography resets
│   │   ├── components.css     # Buttons, badges, input controls
│   │   ├── layout.css         # Navigation bars and footers
│   │   ├── animations.css     # Fade-ins scroll interactions
│   │   ├── dark-mode.css      # Dark overrides
│   │   ├── rtl.css            # Right-to-Left overlays
│   │   ├── responsive.css     # Breakpoint overrides
│   │   └── dashboard.css      # Admin/User layout tokens
│   ├── js/
│   │   ├── main.js            # Collapsibles and navbar scroll
│   │   ├── theme-toggle.js    # LocalStorage theme override
│   │   ├── rtl-toggle.js      # Language layout toggles
│   │   ├── animations.js      # Scroll reveal / counters
│   │   ├── forms.js           # Form validation routines
│   │   └── dashboard.js       # Admin/User layout triggers
│   └── images/
│       └── hero/              # High-quality generated visuals
├── dashboard/
│   ├── admin/                 # Admin CRUD dashboards mockups
│   │   ├── index.html
│   │   ├── appointments.html
│   │   ├── customers.html
│   │   ├── groomers.html
│   │   ├── services.html
│   │   ├── reports.html
│   │   └── settings.html
│   └── user/                  # User CRUD portal panels
│       ├── index.html
│       ├── appointments.html
│       ├── pets.html
│       ├── history.html
│       ├── invoices.html
│       └── settings.html
├── index.html                 # Main Homepage (6 unique sections)
├── home-alt.html              # Alternative Homepage (6 unique sections)
├── about.html                 # About Story Page (6 unique sections)
├── services.html              # Services Catalog Page (6 unique sections)
├── groomers.html              # Lead groomers & careers form
├── gallery.html               # Masonry showcase & testimonials
├── packages.html              # Subscriptions & calculator
├── blog.html                  # Chronicles list & live search
├── contact.html               # Contact form & directions map
├── login.html                 # Centered portal login card
├── signup.html                # Client registration card
├── forgot-password.html       # Recover credentials card
├── 404.html                   # Playful notfound screen
├── coming-soon.html           # Animated countdown screen
├── sitemap.xml                # SEO Sitemap links
└── documentation/
    └── README.md              # Technical handbook
```

---

## Core Technical Integration

- **Theme Control:** Managed via root attribute selector: `document.documentElement.setAttribute('data-theme', 'dark')`.
- **RTL Toggles:** Handled natively using HTML directional tags: `<html dir="rtl">` or LTR.
- **Charts:** Implemented using Chart.js CDNs on `reports.html` and `index.html` dashboards.
- **Validation:** Forms validate required fields in real-time, matching standard email/phone regex arrays, and throwing friendly inline errors.
- **Calculator:** Interactive pricing calculator uses dataset factors on pet sizes select inputs to instantly calculate totals.
