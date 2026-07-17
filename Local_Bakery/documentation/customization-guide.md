# CRUM — Customization Guide

This guide will help you customize and configure the CRUM Bakery template to match your specific brand details, colors, fonts, content, and imagery.

## 1. Changing Colors (Theme Variables)

CRUM uses CSS Custom Properties (Variables) located at the top of `assets/css/main.css`. To change the color palette, locate the `:root` selector and update the following values:

```css
:root {
  /* --- Primary Color (Saddle Brown) --- */
  --color-primary: #8B4513;
  --color-primary-light: #A0522D;
  --color-primary-dark: #6B3410;

  /* --- Secondary Color (Wheat) --- */
  --color-secondary: #F5DEB3;
  --color-secondary-light: #FFF8DC;
  --color-secondary-dark: #DEB887;

  /* --- Accent Color (Chocolate) --- */
  --color-accent: #D2691E;
  --color-accent-light: #E07A2F;
  --color-accent-dark: #B8581A;
  
  /* --- Light Theme Base Backgrounds & Text --- */
  --bg-base: #FFFAF0;
  --bg-surface: #FFFFFF;
  --text-primary: #2C1810;
  --text-secondary: #5C3D2E;
}
```

For **Dark Mode overrides**, update the properties in `assets/css/dark-mode.css`:

```css
[data-theme="dark"] {
  --bg-base: #1A120B;
  --bg-surface: #241A11;
  --bg-elevated: #2E2118;
  --text-primary: #F5DEB3;
  --text-secondary: #D2B48C;
}
```

---

## 2. Customizing Typography

Typography is loaded via Google Fonts in the `<head>` of all HTML documents and imported at the top of `assets/css/main.css`.

### To change font families:
1. Locate the font stylesheet link in the `<head>` of your HTML files:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap" rel="stylesheet">
   ```
2. Update the custom properties in `assets/css/main.css`:
   ```css
   --font-heading: 'Playfair Display', Georgia, serif;
   --font-body: 'Inter', -apple-system, sans-serif;
   --font-logo: 'Pacifico', cursive; /* Used ONLY for the CRUM logo text */
   ```

---

## 3. Customizing the Brand Name and Logo

The logo uses an SVG croissant icon alongside the stylized brand name text "CRUM".

### Changing the Brand Name
Search for `CRUM` in all HTML files and replace it with your brand name. Ensure you update:
- Nav Logo text: `<span class="logo-text">CRUM</span>`
- Title tags: `<title>CRUM — ...</title>`
- Meta tags and header texts.

### Changing the Logo Icon
The logo is an inline SVG icon inside `<div class="logo-icon">`. You can replace the SVG path inside with your custom vector design.

---

## 4. Managing Images (Zero Duplication Rule)

To maintain a professional look, ensure that images are not repeated. The image layout categories are:
- `assets/images/heroes/`: Main header backgrounds (10 unique)
- `assets/images/products/`: Cakes, pastries, and breads (25+ unique)
- `assets/images/team/`: Team member portraits (8 unique)
- `assets/images/process/`: Baking, mixing, packaging (10 unique)
- `assets/images/ingredients/`: Raw ingredients (8 unique)
- `assets/images/shop/`: Inside/outside the shop (6 unique)
- `assets/images/celebrations/`: Events/occasions (8 unique)
- `assets/images/textures/`: Abstract textures (8 unique)

Use high-quality, lightweight WebP formats wherever possible for optimization.

---

## 5. Form Configurations and Validation

CRUM includes built-in form validation. To validate a form field, add a `data-rules` attribute to the input element:

```html
<input type="email" id="c-email" class="form-input" data-rules="required|email">
```

### Supported Validation Rules:
- `required`: Field must not be empty.
- `email`: Must be a valid email format.
- `phone`: Must match phone patterns.
- `minLength:X`: Value must be at least X characters long.
- `data-min-today="true"`: Date picker inputs can enforce that dates cannot be set in the past.

Form behaviors and AJAX states are processed within `assets/js/forms.js`.
