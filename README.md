# NexaFlow — SaaS Template

A clean, modern, dark-themed SaaS website template. 13 pages, 3 shared JS files, 1 CSS file.

## 📁 File Structure

```
saas-template/
├── style.css          — Full design system (CSS variables, components, layouts)
├── main.js            — Navigation, FAQ, counters, forms, toasts, countdown
├── rtl-toggle.js      — RTL/LTR switch with localStorage persistence
├── assets/            — Add your images/icons here
│
├── index.html         — Home V1 (hero + features + testimonials)
├── index-v2.html      — Home V2 (split layout + comparison table)
├── about.html         — About page (mission, values, team)
├── contact.html       — Contact page (form + info cards)
├── pricing.html       — Pricing (monthly/annual toggle + FAQ)
├── blog.html          — Blog grid (filter tabs + newsletter)
├── portfolio.html     — Portfolio/case studies
├── login.html         — Login (split auth layout)
├── register.html      — Register (split auth layout)
├── user-dashboard.html  — User dashboard (sidebar + metrics + activity)
├── admin-dashboard.html — Admin dashboard (user table + platform stats)
├── 404.html           — 404 error page
└── coming-soon.html   — Coming soon (countdown timer + email capture)
```

## 🎨 Design System

**Colors** — CSS variables in `:root` in `style.css`. Easily change:
- `--clr-accent` — Primary brand color (#6c63ff purple)
- `--clr-bg` — Page background
- `--clr-surface` — Card/panel background

**Typography** — Google Fonts: Syne (display/headings) + DM Sans (body)

**Key classes:**
- `.container` — Max-width 1200px centered
- `.card` — Standard card with border + hover
- `.btn .btn-primary / .btn-outline / .btn-ghost` — Buttons
- `.badge` — Status/tag chips
- `.grid-2 / .grid-3 / .grid-4` — Responsive CSS grids

## ⚡ JavaScript Features

### main.js
- Mobile nav hamburger toggle with animation
- Navbar scroll effect (border darkens on scroll)
- Active nav link detection by filename
- FAQ accordion (open/close on click)
- Pricing monthly/annual toggle
- Countdown timer (coming-soon page)
- Counter animation on scroll (data-count attribute)
- Contact/auth form submit handlers with toast feedback
- Sidebar toggle for dashboard mobile
- Global `window.showToast(message, type)` — call anywhere

### rtl-toggle.js
- Button `id="rtlToggle"` anywhere on the page
- Toggles `dir="rtl"` on `<html>`
- Persists to `localStorage` across page loads
- CSS has full RTL overrides for sidebar and toast position

## 📱 Responsive

- **Desktop**: Full layout, sidebar visible
- **Tablet** (≤1024px): Sidebar hidden (toggleable), auth panel hidden
- **Mobile** (≤768px): Hamburger nav, single column grids

## 🚀 Usage

1. Open any `.html` file directly in a browser (no build step)
2. Customize colors in `:root` block in `style.css`
3. Replace "NexaFlow" branding globally
4. Add real images to `assets/images/`
5. Connect forms to your backend (replace JS form handlers)

## 📌 Notes

- All footer Privacy Policy / Terms of Service links are `href="#"` — no extra pages needed
- Dashboard pages have no auth gate (add with JS/backend as needed)
- The template uses 0 external CSS frameworks — pure custom CSS
- RTL support included via CSS `[dir="rtl"]` overrides
