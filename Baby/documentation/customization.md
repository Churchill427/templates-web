# TINY - Customization Guide

TINY utilizes a CSS Custom Properties (variables) design system, making the changing of global primary settings simple and fast.

## Changing the Global Palette

To adjust primary colors or fonts, navigate to `assets/css/style.css` and edit the `:root` variables:

```css
:root {
  /* Change the brand color */
  --primary-color: #FF6B6B;      /* Warm Coral / Salmon */
  --secondary-color: #4ECDC4;    /* Soft Mint / Sage */
  --accent-color: #FFF5E1;       /* Warm Cream / Ivory */
  
  /* Change the button colors */
  --cta-color: #FF6B6B;
  --cta-hover-color: #e55b5b;
}
```

Dark mode overrides are defined in `assets/css/dark-mode.css` inside the `body.dark-theme` selector block.

## Updating Product Data & Mock Images

Product display cards and descriptions are declared directly inside HTML sections. 
1. Open the target page (e.g. `shop.html` or `index.html`).
2. Search for the `.card` classes under the grid container blocks.
3. Update the `img src` to your desired image path.
4. Modify the `data-product-id`, `data-product-name`, and `data-product-price` attributes on the "Add to Cart" button so that the cart script reads the correct product details.

## Sizing Tables Adjustments

Interactive size guide charts render data based on the tabs clicked. To add or modify age groups and sizes:
1. Open `shop.html` and search for `.size-pane`.
2. Edit table rows (`<tr>`) and cells (`<td>`) with updated height and weight metrics.
