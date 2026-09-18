const fs = require('fs');
const path = require('path');

const dir = "d:\\batch 1\\september_2026\\Soap-Bath_Product_Boutique";
const files = ['cart.html', 'dashboard/admin.html', 'dashboard/user.html'];

const newLogo = `<svg class="navbar__logo" viewBox="0 0 100 36"><path d="M 18 32 C 18 32, 8 22, 8 16 C 8 8, 18 4, 18 4 C 18 4, 28 8, 28 16 C 28 22, 18 32, 18 32 Z" fill="none" stroke="var(--clr-primary)" stroke-width="2"/><circle cx="22" cy="12" r="2.5" fill="var(--clr-secondary)"/><circle cx="14" cy="20" r="1.5" fill="var(--clr-secondary)"/><text x="36" y="25" text-anchor="start" fill="var(--clr-primary)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="24">SUDZ</text></svg>`;

files.forEach(f => {
    let p = path.join(dir, f);
    if(fs.existsSync(p)){
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/<svg class="navbar__logo" viewBox="0 0 120 36"><rect width="120" height="36" rx="8" fill="var\(--clr-primary\)"\/><text x="60" y="25" text-anchor="middle" fill="var\(--clr-secondary\)" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="20">SUDZ<\/text><\/svg>/g, newLogo);
        fs.writeFileSync(p, content, 'utf8');
        console.log("Updated " + f);
    }
});
