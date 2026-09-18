const fs = require('fs');
const path = require('path');

const dir = "d:\\batch 1\\september_2026\\Soap-Bath_Product_Boutique";

// Read index.html to get the master footer
const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Regex to extract the footer. Assuming it starts with <footer class="footer" role="contentinfo"> and ends with </footer>
const footerRegex = /<footer class="footer" role="contentinfo">[\s\S]*?<\/footer>/;
const match = indexHtml.match(footerRegex);

if (match) {
    const masterFooter = match[0];
    console.log("Master footer found. Length:", masterFooter.length);
    
    // List of files to update (excluding index.html)
    const filesToUpdate = [
        'home-b.html',
        'about.html',
        'products.html',
        'ingredients.html',
        'gifting.html',
        'contact.html',
        'login.html',
        'signup.html',
        '404.html',
        'coming-soon.html'
    ];
    
    filesToUpdate.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.existsSync(fullPath)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const fileMatch = content.match(footerRegex);
            if (fileMatch) {
                // If it has a footer, replace it
                if (fileMatch[0] !== masterFooter) {
                    content = content.replace(footerRegex, masterFooter);
                    // Special fix for paths in auth or other pages if needed. Since they are all in root, no path adjustments needed.
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated footer in ${file}`);
                } else {
                    console.log(`${file} already up to date.`);
                }
            } else {
                 console.log(`${file} has no footer.`);
            }
        }
    });
} else {
    console.log("Master footer not found in index.html");
}
