# Customization Guide

This document describes how to customize the theme colors, typography, pricing models, charts, and layout modes of the WASH website.

## 🎨 Theme Colors & CSS Variables

The website's look and feel is managed through CSS custom properties (variables) defined in `assets/css/style.css`. 

### Adjusting the Tri-Color Palette

Open [style.css](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/css/style.css) and look for `:root` variable definitions (Lines 12–28):

```css
:root {
  /* --- Tri-Color Palette --- */
  --primary: #1B4D72;          /* Deep Ocean Blue */
  --primary-light: #2563A0;
  --primary-dark: #133A56;
  --primary-rgb: 27, 77, 114;

  --secondary: #4ECDC4;        /* Fresh Mint Green */
  --secondary-light: #6ED9D2;
  --secondary-dark: #3BAFA7;
  --secondary-rgb: 78, 205, 196;

  --accent: #FF8C42;           /* Warm Amber */
  --accent-light: #FFA366;
  --accent-dark: #E07730;
  --accent-rgb: 255, 140, 66;
}
```

Change these values to swap your brand color palette globally across all buttons, cards, hover actions, and custom decorations.

### Dark Mode Tokens

Open [dark-mode.css](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/css/dark-mode.css) and edit colors within the `[data-theme="dark"]` selector block to customize background tones and contrast.

---

## 🧮 Customizing the Pricing Estimator

The pricing calculator is located on the Services page and uses JavaScript calculations in `assets/js/main.js`.

To adjust base rates or coefficients, open [main.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/main.js) and look for the pricing model configurations:

```javascript
const rates = {
  'house-wash': 0.15,      // $0.15 per sqft
  'roof-clean': 0.25,      // $0.25 per sqft
  'driveway': 0.10,        // $0.10 per sqft
  'deck': 0.35             // $0.35 per sqft
};

const complexityFactors = {
  'low': 1.0,              // Standard factor
  'medium': 1.25,          // 25% surcharge
  'high': 1.5              // 50% surcharge
};
```

Update these numbers to match your market pricing requirements.

---

## 📊 Dashboard Data & Charts

The custom Canvas chart library is implemented in [graphs.js](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/assets/js/graphs.js). 

Charts are initialized directly inside scripts at the end of dashboard pages:
- [dashboard-admin.html](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/pages/dashboard-admin.html)
- [dashboard-user.html](file:///d:/batch%201/Mobile_Power_Washing_and_Roof_Cleaning_Service_june_2026/pages/dashboard-user.html)

To change data datasets, update the arrays of data points inside:
```javascript
WashCharts.create('admin-revenue-chart', 'line', {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue', data: [12500, 15200, 18400, 16800, 21500, 24300], color: '#1B4D72' }
  ]
});
```
