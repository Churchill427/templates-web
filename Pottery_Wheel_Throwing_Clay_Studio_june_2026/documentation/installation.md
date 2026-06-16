# Installation & Setup

KILN is a static HTML/CSS/JS template. It does not require a complex build process, server, or database to view and edit.

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge).
- A code editor (like Visual Studio Code, Sublime Text, or Cursor).

## Getting Started

1. **Unzip the Package:**
   Extract the downloaded KILN template folder to your desired location on your computer.

2. **Open in Browser:**
   Navigate to the `pages` directory and double-click `index.html`. It will open in your default web browser.

3. **Open in Code Editor:**
   Open the entire KILN folder in your code editor to view the project structure.

## Using a Local Server (Recommended)

While you can view the HTML files by opening them directly from your file system (via `file://` protocol), it is highly recommended to use a local development server. Some browser security policies (CORS) might restrict certain features (like fetching external SVG sprites if used) when viewing files directly.

**Using VS Code Live Server:**
1. Install the "Live Server" extension by Ritwick Dey in VS Code.
2. Open the KILN project folder in VS Code.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The site will automatically open in your browser (usually at `http://127.0.0.1:5500`) and will auto-reload when you make changes.

**Using Node.js (http-server):**
1. Open your terminal/command prompt.
2. Run `npm install -g http-server`.
3. Navigate to the project directory: `cd path/to/KILN`.
4. Run `http-server`.
5. Open your browser and navigate to the address provided (usually `http://127.0.0.1:8080`).

## Deployment

Since KILN is a static template, it can be hosted anywhere that supports static files, such as:
- GitHub Pages
- Vercel
- Netlify
- Any standard cPanel/FTP web host

Simply upload the contents of the folder (ensuring the relationship between `pages/` and `assets/` remains intact) to your server's public root directory.
