# TINY - Installation Guide

The **TINY** Baby & Kids Clothing Store storefront is built purely with standard HTML5, CSS3, and Vanilla JavaScript (ES6+). It has zero dependencies on packages, builders, or framework layers.

## Steps to Run Locally

### Method 1: Double-Click File
Since all resources are relative, you can open any of the HTML templates directly in your favorite modern browser:
1. Navigate to the root directory `tiny-clothing-store/`.
2. Double-click [index.html](file:///d:/batch%201/july_2026/Baby/index.html) to open the home storefront.
3. Use the navigation bar links to click through pages.

### Method 2: Local Static Server (Recommended)
For full features (such as proper history, directory mapping, or standard hosting layouts), run a lightweight HTTP static server:

Using Node.js:
```bash
# Install global live-server or serve
npm install -g serve

# Run the server in workspace root
serve .
```

Using Python:
```bash
# Python 3
python -m http.server 8000
```

## CDN Integrations Loaded
1. **Google Fonts:** Loads `'Nunito'` (headings) and `'Inter'` (body text) dynamically.
2. **Font Awesome CSS:** Serves vector icons (solid & brand packs) for cart, socials, and support info.
