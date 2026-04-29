# 🚀 Quick Start Guide - AromaLux Template

## Getting Started in 3 Steps

### Step 1: Open the Template
Simply open `pages/index.html` in your web browser to see the homepage.

**Recommended**: Use a local development server for best experience:
- VS Code: Install "Live Server" extension, right-click index.html → "Open with Live Server"
- Or use any local server (XAMPP, MAMP, Python http.server, etc.)

### Step 2: Explore All Pages
All pages are interconnected via navigation. Click through to explore:
- **Home Pages**: index.html (Luxury), index2.html (Modern)
- **Shop**: shop.html → product-details.html
- **Blog**: blog.html → blog-details.html
- **Services**: services.html → service-details.html
- **Dashboard**: dashboard.html (Admin panel)
- **Auth**: login.html, register.html
- **Other**: about.html, contact.html, pricing.html
- **Error Pages**: 404.html, coming-soon.html

### Step 3: Customize
1. **Change Colors**: Edit `assets/css/style.css` - modify CSS variables at the top
2. **Replace Logo**: Search for "AromaLux" in HTML files and replace with your brand name
3. **Update Images**: Replace Unsplash URLs with your own product images
4. **Modify Content**: Edit text content directly in HTML files

## Key Features to Try

### 🌙 Dark Mode
Click the moon icon 🌙 in the navbar to toggle dark mode.

### 🌍 RTL Support
Click the globe icon 🌍 to toggle right-to-left layout (for Arabic/Hebrew).

### 🛒 Shopping Features
- Click heart icons ❤️ to add products to wishlist
- Click "Add to Cart" buttons to simulate shopping
- Toast notifications will appear confirming actions

### 📊 Dashboard
Visit `dashboard.html` to see:
- Sales charts (Chart.js)
- Revenue analytics
- Customer statistics
- Activity feed

### 🔍 Search & Filters
On the shop page:
- Use the search bar to filter products
- Apply category filters (Men/Women/Unisex)
- Sort by price or name
- Adjust price range slider

## Common Customizations

### Change Brand Name
Find and replace in all HTML files:
```
AromaLux → Your Brand Name
```

### Change Primary Color
In `assets/css/style.css`, line ~10:
```css
--primary-gold: #D4AF37;  /* Change this hex code */
```

### Replace Images
All images use Unsplash URLs. Replace with your own:
```html
<!-- Before -->
<img src="https://images.unsplash.com/..." />

<!-- After -->
<img src="assets/images/your-product.jpg" />
```

### Update Contact Information
In `contact.html` and footer sections:
- Phone number
- Email address
- Physical address
- Social media links

## Testing Checklist

✅ Open each page and verify navigation works
✅ Test mobile responsiveness (resize browser window)
✅ Try dark mode toggle
✅ Test RTL toggle
✅ Click all buttons and links
✅ Fill out forms (login, register, contact)
✅ View dashboard charts
✅ Test search and filters on shop page

## File Structure Reference

```
perfume/
├── assets/
│   ├── css/
│   │   └── style.css          ← Main stylesheet
│   ├── js/
│   │   ├── main.js            ← Main JavaScript
│   │   └── dashboard.js       ← Dashboard scripts
│   └── images/                ← Add your images here
└── pages/
    ├── index.html             ← Start here!
    ├── index2.html
    ├── about.html
    ├── services.html
    ├── service-details.html
    ├── shop.html
    ├── product-details.html
    ├── blog.html
    ├── blog-details.html
    ├── contact.html
    ├── pricing.html
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── 404.html
    └── coming-soon.html
```

## Tips for Best Results

1. **Use a Code Editor**: VS Code, Sublime Text, or Atom recommended
2. **Test Responsively**: Use browser DevTools (F12) to test different screen sizes
3. **Keep Backups**: Before making major changes, backup original files
4. **Browser Cache**: Hard refresh (Ctrl+Shift+R) if changes don't appear
5. **Image Optimization**: Compress images before adding for faster load times

## Need Help?

- Check the main README.md for detailed documentation
- All code is well-commented for easy understanding
- Inspect elements using browser DevTools (F12)
- Search for specific features in the codebase

## Next Steps

1. ✅ Review all pages
2. ✅ Plan your customizations
3. ✅ Replace placeholder content
4. ✅ Add your products/images
5. ✅ Test thoroughly
6. ✅ Deploy to your hosting!

---

**Happy Customizing! 🌸**
