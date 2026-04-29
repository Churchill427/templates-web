# SpaceCraft Organizers — Professional Organizing Website

A premium, modern, fully-responsive HTML/CSS/JS website for a professional organizer & decluttering service business.

## 🚀 Quick Start

1. Clone or download the project
2. Open `index.html` in your browser
3. No build tools, frameworks, or package managers required

## 📁 File Structure

```
├── index.html              # Home Page 1 — General Services Landing
├── home-2.html             # Home Page 2 — Niche/SaaS Style
├── about.html              # About Us — Story, Team, Mission
├── services.html           # Services Overview with Filters
├── service-details.html    # Individual Service Details
├── blog.html               # Blog Grid with Categories
├── blog-details.html       # Single Blog Article
├── contact.html            # Contact Form + Map + Info
├── pricing.html            # Pricing Plans with FAQ
├── login.html              # Login Page (no navbar/footer)
├── register.html           # Registration Page (no navbar/footer)
├── dashboard.html          # Admin + User Dashboard (role switcher)
├── 404.html                # Not Found Page (no navbar/footer)
├── coming-soon.html        # Coming Soon with Countdown
├── site.webmanifest        # PWA Web App Manifest
├── .htaccess               # Apache server configuration
├── assets/
│   ├── css/
│   │   └── main.css        # Complete stylesheet with dark mode & RTL
│   ├── js/
│   │   ├── main.js         # Core interactions & utilities
│   │   └── dashboard.js    # Dashboard-specific functionality
│   └── images/
│       ├── hero/           # Hero section photographs
│       ├── services/       # Service category images
│       ├── blog/           # Blog post images
│       ├── team/           # Team member photos
│       └── icons/          # Favicons & app icons
└── documentation/
    └── README.md           # This file
```

## 🎨 Design System

### Color Palette
| Token             | Light Mode | Dark Mode  |
|-------------------|------------|------------|
| `--primary`       | #2D5A4C    | #4A7C6F    |
| `--primary-light` | #4A7C6F    | #6B9B8E    |
| `--secondary`     | #F5F1EB    | #2A2A2A    |
| `--accent`        | #E07A5F    | #E07A5F    |
| `--background`    | #FFFFFF    | #121212    |
| `--surface`       | #FAFAFA    | #1E1E1E    |

### Typography
- **Primary:** Inter (Google Fonts)
- **Accent:** Cormorant Garamond (Google Fonts)
- **Base Size:** 16px, Line Height 1.6

### Breakpoints
| Name    | Width       |
|---------|-------------|
| Mobile  | < 640px     |
| Tablet  | 640–1024px  |
| Desktop | 1024–1280px |
| Large   | > 1280px    |

## ⚡ Features

- **Two Homepage Layouts** — General and Niche/SaaS style with dropdown switcher
- **Dark/Light Mode** — System preference detection + manual toggle with localStorage persistence
- **RTL Support** — Full right-to-left layout via globe icon toggle
- **Responsive Design** — Mobile-first with 4 breakpoints
- **Dual Dashboard** — Admin and User roles with role switcher
- **Scroll Animations** — Intersection Observer-based reveal animations
- **Before/After Slider** — Draggable comparison gallery
- **Counter Animations** — Animated stat counters on scroll
- **FAQ Accordion** — Smooth expand/collapse
- **Form Validation** — Client-side validation with error states
- **Service Filters** — Category-based filtering with animations
- **Countdown Timer** — Animated countdown for Coming Soon page
- **Mini Charts** — SVG sparkline charts in dashboard (no dependencies)

## 🛠 Customization

### Changing Brand Colors
Edit the CSS variables in `assets/css/main.css`:
```css
:root {
  --primary: #YOUR_COLOR;
  --accent: #YOUR_ACCENT;
}
```

### Replacing Images
All images are in `assets/images/`. Replace with your own while maintaining the same filenames, or update the `src` attributes in the HTML files.

### Adding New Pages
1. Copy any existing page as a template
2. Update the `<title>`, `<meta>`, and content
3. Add navigation links if needed

## 📋 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 📄 License

This template is provided as-is for commercial and personal use.

---

Built with ❤️ by SpaceCraft Organizers
