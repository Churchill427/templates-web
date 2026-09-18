const fs = require('fs');
const path = require('path');

const dir = "d:\\batch 1\\september_2026\\Soap-Bath_Product_Boutique";

const newNavbarLogo = `<svg class="navbar__logo" viewBox="0 0 100 36"><path d="M 18 32 C 18 32, 8 22, 8 16 C 8 8, 18 4, 18 4 C 18 4, 28 8, 28 16 C 28 22, 18 32, 18 32 Z" fill="none" stroke="var(--clr-primary)" stroke-width="2"/><circle cx="22" cy="12" r="2.5" fill="var(--clr-secondary)"/><circle cx="14" cy="20" r="1.5" fill="var(--clr-secondary)"/><text x="36" y="25" text-anchor="start" fill="var(--clr-primary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="24">SUDZ</text></svg>`;

const newFooterLogo = `<svg viewBox="0 0 100 36" style="height:36px"><path d="M 18 32 C 18 32, 8 22, 8 16 C 8 8, 18 4, 18 4 C 18 4, 28 8, 28 16 C 28 22, 18 32, 18 32 Z" fill="none" stroke="var(--clr-primary)" stroke-width="2"/><circle cx="22" cy="12" r="2.5" fill="var(--clr-secondary)"/><circle cx="14" cy="20" r="1.5" fill="var(--clr-secondary)"/><text x="36" y="25" text-anchor="start" fill="var(--clr-primary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="24">SUDZ</text></svg>`;

const newLoginLogo = `<svg viewBox="0 0 100 36" style="height: 44px;"><path d="M 18 32 C 18 32, 8 22, 8 16 C 8 8, 18 4, 18 4 C 18 4, 28 8, 28 16 C 28 22, 18 32, 18 32 Z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="22" cy="12" r="2.5" fill="var(--clr-secondary)"/><circle cx="14" cy="20" r="1.5" fill="var(--clr-secondary)"/><text x="36" y="25" text-anchor="start" fill="#fff" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="24">SUDZ</text></svg>`;

const newComingLogo = `<svg viewBox="0 0 100 36" style="height: 40px;"><path d="M 18 32 C 18 32, 8 22, 8 16 C 8 8, 18 4, 18 4 C 18 4, 28 8, 28 16 C 28 22, 18 32, 18 32 Z" fill="none" stroke="var(--clr-primary)" stroke-width="2"/><circle cx="22" cy="12" r="2.5" fill="var(--clr-secondary)"/><circle cx="14" cy="20" r="1.5" fill="var(--clr-secondary)"/><text x="36" y="25" text-anchor="start" fill="var(--clr-primary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="24">SUDZ</text></svg>`;

const newFavicon = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Cpath d='M 18 32 C 18 32, 8 22, 8 16 C 8 8, 18 4, 18 4 C 18 4, 28 8, 28 16 C 28 22, 18 32, 18 32 Z' fill='none' stroke='%233E5C50' stroke-width='2'/%3E%3Ccircle cx='22' cy='12' r='2.5' fill='%23C2764A'/%3E%3Ccircle cx='14' cy='20' r='1.5' fill='%23C2764A'/%3E%3C/svg%3E">`;

function walkDir(currentDir) {
    fs.readdirSync(currentDir).forEach(file => {
        const fullPath = path.join(currentDir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Favicon
            const faviconMatch = content.match(/<link rel="icon"[^>]+>/);
            if (faviconMatch && faviconMatch[0] !== newFavicon) {
                content = content.replace(faviconMatch[0], newFavicon);
                modified = true;
            }

            // Navbar
            if (content.includes(`<svg class="navbar__logo" viewBox="0 0 120 36"><rect width="120" height="36" rx="8" fill="var(--clr-primary)"/><text x="60" y="25" text-anchor="middle" fill="var(--clr-secondary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ</text></svg>`)) {
                content = content.replace(/<svg class="navbar__logo" viewBox="0 0 120 36"><rect width="120" height="36" rx="8" fill="var(--clr-primary)"\/><text x="60" y="25" text-anchor="middle" fill="var(--clr-secondary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ<\/text><\/svg>/g, newNavbarLogo);
                modified = true;
            }

            // Footer
            if (content.includes(`<svg viewBox="0 0 120 36" style="height:36px"><rect width="120" height="36" rx="8" fill="var(--clr-primary)"/><text x="60" y="25" text-anchor="middle" fill="#F6F1E7" font-family="'Fraunces',Georgia,serif" font-weight="700" font-size="20">SUDZ</text></svg>`)) {
                content = content.replace(/<svg viewBox="0 0 120 36" style="height:36px"><rect width="120" height="36" rx="8" fill="var(--clr-primary)"\/><text x="60" y="25" text-anchor="middle" fill="#F6F1E7" font-family="'Fraunces',Georgia,serif" font-weight="700" font-size="20">SUDZ<\/text><\/svg>/g, newFooterLogo);
                modified = true;
            }

            // Login / Signup
            if (content.includes(`<svg viewBox="0 0 120 36" style="height: 44px;"><rect width="120" height="36" rx="8" fill="rgba(255,255,255,0.15)"/><text x="60" y="25" text-anchor="middle" fill="#fff" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ</text></svg>`)) {
                content = content.replace(/<svg viewBox="0 0 120 36" style="height: 44px;"><rect width="120" height="36" rx="8" fill="rgba\(255,255,255,0.15\)"\/><text x="60" y="25" text-anchor="middle" fill="#fff" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ<\/text><\/svg>/g, newLoginLogo);
                modified = true;
            }
            if (content.includes(`<svg viewBox="0 0 120 36" style="height: 36px;"><rect width="120" height="36" rx="8" fill="var(--clr-primary)"/><text x="60" y="25" text-anchor="middle" fill="#F6F1E7" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ</text></svg>`)) {
                content = content.replace(/<svg viewBox="0 0 120 36" style="height: 36px;"><rect width="120" height="36" rx="8" fill="var\(--clr-primary\)"\/><text x="60" y="25" text-anchor="middle" fill="#F6F1E7" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ<\/text><\/svg>/g, newFooterLogo);
                modified = true;
            }

            // Coming Soon / 404
            if (content.includes(`<svg viewBox="0 0 120 36" style="height: 40px;"><rect width="120" height="36" rx="8" fill="var(--clr-primary)"/><text x="60" y="25" text-anchor="middle" fill="var(--clr-secondary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ</text></svg>`)) {
                content = content.replace(/<svg viewBox="0 0 120 36" style="height: 40px;"><rect width="120" height="36" rx="8" fill="var\(--clr-primary\)"\/><text x="60" y="25" text-anchor="middle" fill="var\(--clr-secondary\)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ<\/text><\/svg>/g, newComingLogo);
                modified = true;
            }
            
            // Catch-all just in case
            if (content.includes(`<svg viewBox="0 0 120 36" style="height: 40px;"><rect width="120" height="36" rx="8" fill="var(--clr-primary)"/><text x="60" y="25" text-anchor="middle" fill="var(--clr-secondary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ</text></svg>`)) {
                 // handled above
            }
            

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    });
}

walkDir(dir);
console.log("Done");
