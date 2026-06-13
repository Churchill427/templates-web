# BRAKE — Mobile Brake Lathe & Rotor Resurfacing Service Website

Welcome to the **BRAKE** website! This is a complete, fully responsive 13-page static website built using vanilla HTML5, CSS3, and JavaScript (no frameworks). It features rich design aesthetics, dark/light theme switching, RTL/LTR support, interactive dashboards with canvas-based charts, and a multi-step booking system.

---

## 🚀 How to Run the Website

To view the website locally, you should serve the project from the **root directory** (the folder containing this `README.md` file, the `assets` folder, and the `pages` folder). 

Here are the recommended ways to run it:

### Option 1: VS Code Live Server (Recommended)
1. Open the project root folder (`Mobile_Brake_Lathe_Rotor_Resurfacing_Service_june_2026`) in VS Code.
2. Make sure you have the **Live Server** extension installed.
3. Click the **Go Live** button in the bottom right corner of VS Code, or right-click `index.html` in the root folder and select **Open with Live Server**.
4. The website will open in your default browser at `http://127.0.0.1:5500/` and automatically redirect you to the main homepage (`pages/index.html`).

> [!IMPORTANT]
> Always open the **entire project folder** (not just the `pages` subfolder) in VS Code. Serving directly from the `pages` subfolder will break asset paths because the browser will not be able to access the `assets/` directory located in the parent folder.

### Option 2: Python HTTP Server
If you have Python installed, you can start a local server by running the following command in your terminal from the project root directory:
```bash
python -m http.server 8000
```
Then open your browser and navigate to `http://localhost:8000`.

### Option 3: Node.js http-server
If you have Node.js installed, you can run:
```bash
npx http-server -p 8000
```
Then open your browser and navigate to `http://localhost:8000`.

---

## 📁 Project Structure

```text
├── assets/
│   ├── css/
│   │   ├── style.css         # Main design system & responsive layout styles
│   │   ├── dark-mode.css     # Dark mode override variables
│   │   └── rtl.css           # RTL layout overrides
│   ├── js/
│   │   ├── main.js           # Core theme toggling, RTL direction, nav, scroll reveal
│   │   ├── booking.js        # Multi-step booking form logic & pricing calculator
│   │   ├── dashboard.js      # Sidebar toggling, calendar & dashboard UI controls
│   │   └── plugins/
│   │       └── charts.js     # Custom vanilla Canvas-based chart library
│   └── images/               # Image assets (hero images, service photos, testimonials, etc.)
├── pages/
│   ├── index.html            # Home Page A (Standard Service Focus)
│   ├── home-b.html           # Home Page B (Equipment & FAQs)
│   ├── about.html            # Our Story & Team
│   ├── services.html         # Services & Guarantee
│   ├── contact.html          # Dynamic Contact Form & Office Location
│   ├── booking.html          # Multi-step Booking Form
│   ├── blog.html             # Customer Reviews & Articles
│   ├── admin-dashboard.html  # Interactive Admin Dashboard
│   ├── user-dashboard.html   # Interactive User Dashboard
│   ├── login.html            # Clean login screen
│   ├── signup.html           # Clean signup screen
│   ├── coming-soon.html      # Promotional coming soon with countdown timer
│   └── 404.html              # Custom page not found page
├── index.html                # Root entry point (Auto-redirects to pages/index.html)
└── README.md                 # Project instructions & documentation
```

---

## ✨ Features Implemented

*   **Responsive Design**: Mobile-first grid layouts supporting four major breakpoints (Mobile `<640px`, Tablet `640px-1024px`, Desktop `1024px-1280px`, Wide Screen `>1280px`).
*   **Dual Mode Support**: Fully functional Dark and Light modes with seamless visual transitions.
*   **Bidirectional Layouts**: Complete LTR and RTL support with structural layout flips.
*   **Automated Redirect**: The root `index.html` provides automatic server redirection to keep paths clean and robust.
*   **Canvas Charting Plugin**: Lightweight custom chart plugin (`charts.js`) built on HTML5 Canvas.
*   **Interactive Calendars & Forms**: Custom-built calendar grid and multi-step booking calculator with real-time estimation.
