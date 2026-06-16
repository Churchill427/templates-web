# Customization Guide

KILN is designed to be easily customized through centralized CSS variables.

## Changing Colors

All main colors are defined as CSS variables in `assets/css/style.css` inside the `:root` pseudo-class.

To change the primary color scheme (e.g., from Terra Cotta to a Blue theme), find the primary color variables in `style.css`:

```css
:root {
  /* Change these values to your desired hex/hsl/rgb codes */
  --primary-50: #F9EAE6;
  --primary-100: #F3D5CD;
  /* ... */
  --primary-500: #C65D3B; /* Main Brand Color */
  /* ... */
}
```

Dark mode colors are controlled in `assets/css/dark-mode.css`. If you change the primary light theme colors, be sure to adjust the dark mode variants to ensure adequate contrast.

## Changing Typography

KILN uses 'Outfit' for headings and 'Inter' for body copy. These are loaded via Google Fonts in `style.css`.

To use different fonts:
1. Update the `@import` URL at the top of `style.css` with your new Google Font URL.
2. Update the font variables:

```css
:root {
  --font-heading: 'Your New Font', sans-serif;
  --font-body: 'Your New Font', sans-serif;
}
```

## Changing Placeholder Images

The template uses static, offline placeholder images located in the `assets/images/` folder to ensure fast loading and support fully offline local development. In the HTML files, you will see `<img>` tags pointing to:

- `../assets/images/hero-placeholder.png` - Used for wide banners and background headers.
- `../assets/images/pottery-placeholder.png` - Used for class thumbnails, project examples, and general illustrations.
- `../assets/images/avatar-placeholder.png` - Used for team member, instructor, and user profile pictures.

To replace these with your own custom images:
1. Save your optimized images (WebP/PNG/JPEG) in the `assets/images/` folder.
2. Update the `src` attribute in the HTML files to point to your new image file:

```html
<img src="../assets/images/my-custom-image.jpg" alt="...">
```

## Dashboard Charts Customization

The charts in the Admin and User dashboards are generated using Chart.js in the `assets/js/dashboard.js` file.

To update the data or colors:
1. Open `dashboard.js`.
2. Locate the specific chart initialization (e.g., `const enrollmentCtx = document.getElementById('enrollmentChart');`).
3. Modify the `data.labels` and `data.datasets[0].data` arrays.
4. The chart colors are mapped to CSS variables via a helper function at the top of the script, ensuring they automatically match your theme.
