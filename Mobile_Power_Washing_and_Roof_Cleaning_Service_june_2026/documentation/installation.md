# Installation & Deployment Guide

This document explains how to set up, preview, and host the WASH website on development environments and production servers.

## 💻 Local Development Setup

WASH is built entirely with vanilla web technologies (HTML5, CSS3, ES6 JavaScript). It does not require a complex build process, compilation, or compilation dependencies.

### Running a Dev Server

Because the site uses ES modules and local paths, opening files directly via the `file://` protocol in the browser might block features due to CORS policies. Running a local HTTP server is recommended.

#### 1. Node.js (Recommended)
If you have Node.js installed, use `npx` to start a server instantly without permanent installations:
```bash
npx http-server -p 8080
```
Alternatively, with `serve`:
```bash
npx serve -p 8080
```

#### 2. Python
If you have Python installed, use the built-in HTTP server:
- For Python 3:
  ```bash
  python -m http.server 8080
  ```
- For Python 2:
  ```bash
  python -m SimpleHTTPServer 8080
  ```

#### 3. VS Code Live Server
If you use Visual Studio Code, you can install the **Live Server** extension by Ritwick Dey. Open the root workspace and click **"Go Live"** in the status bar.

---

## 🚀 Deployment

Since WASH is a static site (HTML, CSS, JS, and images), it can be deployed to any static web hosting provider.

### Providers

1. **Vercel**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the project root.
2. **Netlify**:
   - Run `netlify deploy` or drag and drop the root folder into the Netlify Web UI.
3. **GitHub Pages**:
   - Create a repository, push the codebase, and activate GitHub Pages in the repository **Settings → Pages**. Set the source to the `main` branch.
4. **Apache / Nginx / IIS**:
   - Copy all code, directories, and assets to the public HTML directory (e.g. `var/www/html` or `inetpub/wwwroot`).

---

## 🧪 Verification & Testing

### Code Quality Check

You can run simple console grep checks to verify the project's standards:

- **Check for missing alt text**:
  ```bash
  grep -rn "<img" pages/ | grep -v "alt="
  ```
- **Check for development console logs**:
  ```bash
  grep -rn "console.log" assets/js/
  ```
- **Check for broken internal references**:
  ```bash
  grep -rn "href=" pages/ | grep -v "http" | grep -v "#"
  ```
