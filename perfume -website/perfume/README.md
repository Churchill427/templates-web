# 🌸 AromaLux - Premium Perfume & Fragrance Store Template

A fully responsive, modern, premium HTML template for online perfume and fragrance stores. This ThemeForest-level multipurpose eCommerce template features luxury UI design, complete admin dashboard, and all essential pages.

## ✨ Features

### 🎨 Design
- **Premium Luxury UI** - ThemeForest-level design quality
- **Fully Responsive** - Mobile-first approach, works on all devices
- **Dark Mode Support** - Toggle between light and dark themes
- **RTL Support** - Right-to-left language support
- **Smooth Animations** - Elegant transitions and hover effects
- **Glassmorphism Effects** - Modern glass-like UI elements
- **Custom Typography** - Playfair Display + Poppins fonts

### 🛠 Technology Stack
- HTML5
- CSS3 (TailwindCSS)
- Vanilla JavaScript
- Chart.js (for dashboard analytics)
- Font Awesome Icons
- Google Fonts

### 📄 Pages Included (17 Total)

#### Main Pages
1. **Home Page 1** - Luxury Fragrance Landing (`index.html`)
2. **Home Page 2** - Modern Showcase (`index2.html`)
3. **About Us** - Brand story and team (`about.html`)
4. **Services** - Service listings (`services.html`)
5. **Service Details** - Detailed service page (`service-details.html`)
6. **Shop** - Product grid with filters (`shop.html`)
7. **Product Details** - Single product page (`product-details.html`)
8. **Blog** - Article listings (`blog.html`)
9. **Blog Details** - Single article page (`blog-details.html`)
10. **Contact** - Contact form and info (`contact.html`)
11. **Pricing** - Subscription plans (`pricing.html`)
12. **Login** - User authentication (`login.html`)
13. **Register** - User registration (`register.html`)

#### Admin Dashboard
14. **Dashboard** - Admin panel with charts (`dashboard.html`)

#### Error Pages
15. **404 Page** - Creative error page (`404.html`)
16. **Coming Soon** - Launch page with countdown (`coming-soon.html`)

### 🧭 Navigation Structure

**Left Side:**
- Logo (AromaLux)

**Center Menu:**
- Home (Dropdown: Home 1, Home 2)
- About
- Services
- Shop
- Blog
- Pricing
- Contact

**Right Side:**
- Dashboard
- RTL Toggle 🌍
- Dark Mode Toggle 🌙
- Login CTA

### 🎯 Core Features

#### E-Commerce Features
- ✅ Product grid with filtering
- ✅ Product quick view modal
- ✅ Wishlist functionality
- ✅ Add to cart (UI only)
- ✅ Price range filters
- ✅ Category filters
- ✅ Fragrance notes tags
- ✅ "Best for" tags (date, office, party)
- ✅ Product image gallery
- ✅ Customer reviews & ratings
- ✅ Related products section

#### Fragrance-Specific Features
- ✅ Fragrance notes breakdown UI (Top, Heart, Base)
- ✅ Scent recommendation UI
- ✅ Custom fragrance creation service
- ✅ Gift bundle builder UI
- ✅ Subscription box plans
- ✅ Brand carousel
- ✅ Influencer/Celebrity picks section

#### Interactive Elements
- ✅ Sticky navbar on scroll
- ✅ Mobile hamburger menu
- ✅ Smooth dropdown animations
- ✅ Active page highlighting
- ✅ Animated counters
- ✅ Toast notifications
- ✅ Form validation
- ✅ Search functionality
- ✅ Sort products
- ✅ Newsletter subscription
- ✅ Countdown timer (Coming Soon page)

#### Admin Dashboard Features
- ✅ Sidebar navigation
- ✅ Overview stat cards (Users, Orders, Revenue, Messages)
- ✅ Sales growth chart (Chart.js)
- ✅ Revenue analytics chart
- ✅ Product category distribution
- ✅ Recent activity feed
- ✅ Dark mode support
- ✅ Responsive layout

### 📁 Project Structure

```
perfume/
├── assets/
│   ├── css/
│   │   └── style.css          # Custom styles & luxury theme
│   ├── js/
│   │   ├── main.js            # Main JavaScript functionality
│   │   └── dashboard.js       # Dashboard-specific scripts
│   └── images/                # Image assets
└── pages/
    ├── index.html             # Home Page 1 - Luxury
    ├── index2.html            # Home Page 2 - Modern
    ├── about.html             # About Us
    ├── services.html          # Services listing
    ├── service-details.html   # Service details
    ├── shop.html              # Product shop
    ├── product-details.html   # Single product
    ├── blog.html              # Blog listing
    ├── blog-details.html      # Single blog post
    ├── contact.html           # Contact page
    ├── pricing.html           # Pricing plans
    ├── login.html             # Login page
    ├── register.html          # Registration page
    ├── dashboard.html         # Admin dashboard
    ├── 404.html               # 404 error page
    └── coming-soon.html       # Coming soon page
```

### 🚀 Getting Started

1. **Download/Clone the repository**
   ```bash
   cd "d:\april special websites\perfume"
   ```

2. **Open in Browser**
   - Simply open `pages/index.html` in your web browser
   - No build process required - it's a static template!

3. **For Development**
   - Use a local server (e.g., Live Server in VS Code)
   - All paths are relative and ready to use

### 🎨 Customization

#### Colors
Main color variables are defined in `assets/css/style.css`:
```css
:root {
  --primary-gold: #D4AF37;
  --dark-gold: #B8941F;
  --light-gold: #F4E8C1;
  --luxury-black: #1A1A1A;
  --rose-gold: #B76E79;
}
```

#### Fonts
Currently using:
- **Headings**: Playfair Display (serif)
- **Body**: Poppins (sans-serif)

Change in `style.css` by updating the Google Fonts import.

#### Logo
Replace the logo icon/text in the navbar across all pages:
```html
<i class="fas fa-spray-can text-3xl text-yellow-600"></i>
<span class="text-2xl font-bold font-serif">AromaLux</span>
```

### 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All pages are fully responsive and tested across devices.

### 🌙 Dark Mode

Toggle dark mode using the moon icon in the navbar. Preference is saved in localStorage.

### 🌍 RTL Support

Toggle RTL (Right-to-Left) mode using the globe icon. Perfect for Arabic, Hebrew, and other RTL languages.

### 🛒 Cart & Wishlist

Features use localStorage for persistence:
- Cart items stored in `localStorage.cart`
- Wishlist items stored in `localStorage.wishlist`

### 📊 Dashboard Charts

Uses Chart.js for data visualization:
- Sales Growth (Line Chart)
- Revenue Analytics (Bar Chart)
- Category Distribution (Doughnut Chart)

### ✨ Bonus Features

- 🎁 Perfume finder quiz UI (ready to implement)
- 🎨 Fragrance recommendation engine UI
- 🎁 Gift bundle builder UI
- 🎠 Animated brand carousel
- ⏱️ Animated stat counters
- 🔔 Toast notification system
- 💬 Comment system UI
- 📧 Newsletter subscription

### 🎯 Use Cases

Perfect for:
- Perfume brands
- Luxury fragrance stores
- Cosmetic & beauty shops
- Boutique scent collections
- Beauty product marketplaces
- Luxury goods retailers
- Spa & wellness centers

### 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

### 📄 License

This is a premium template suitable for ThemeForest submission or commercial use.

### 👨‍💻 Developer Notes

- All pages share consistent navbar and footer
- Reusable components via copy-paste (navbar structure)
- Clean, well-commented code
- SEO-friendly HTML structure
- Optimized images from Unsplash (replace with your own)
- No external dependencies except CDN libraries

### 🔧 Future Enhancements

Potential additions:
- Backend integration (PHP, Node.js, etc.)
- Real payment gateway
- User authentication system
- Database connectivity
- Advanced search with Elasticsearch
- Multi-language support
- Currency converter
- Product comparison tool

### 📞 Support

For questions or customization requests, refer to the code comments or extend the existing JavaScript functions.

---

## 🌟 Credits

- **Icons**: Font Awesome 6.4.0
- **Charts**: Chart.js
- **Fonts**: Google Fonts (Playfair Display, Poppins)
- **Images**: Unsplash (placeholder images)
- **Avatars**: Pravatar.cc (placeholder user images)

---

**Made with ❤️ for luxury fragrance businesses**

*Version 1.0 - April 2026*
