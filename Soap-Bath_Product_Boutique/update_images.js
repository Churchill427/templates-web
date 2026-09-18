const fs = require('fs');
const path = require('path');

const dir = "d:\\batch 1\\september_2026\\Soap-Bath_Product_Boutique";

const changes = {
    'index.html': {
        find: `.home-a-hero__bg { position: absolute; inset: 0; z-index: 0; background: linear-gradient(135deg, #5a7d6e 0%, #3E5C50 25%, #2D4439 50%, #C2764A 100%); }`,
        replace: `.home-a-hero__bg { position: absolute; inset: 0; z-index: 0; background: url('assets/images/index_hero.png') center/cover no-repeat; }`
    },
    'home-b.html': {
        find: `.home-b-hero__bg { position: absolute; inset: 0; z-index: 0; background: linear-gradient(to right, #F6F1E7 0%, #E8E2D6 100%); }`,
        replace: `.home-b-hero__bg { position: absolute; inset: 0; z-index: 0; background: url('assets/images/home_b_hero.png') center/cover no-repeat; }`
    },
    'about.html': {
        find: `.about-hero { position: relative; min-height: 75vh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: linear-gradient(145deg, #3E5C50 0%, #2D4439 60%, #5A7D6E 100%); }`,
        replace: `.about-hero { position: relative; min-height: 75vh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: url('assets/images/about_hero.png') center/cover no-repeat; }`
    },
    'products.html': {
        find: `.page-header { background: linear-gradient(145deg, #F6F1E7 0%, #E8E2D6 100%); padding: calc(var(--navbar-height) + var(--sp-6)) var(--container-gutter) var(--sp-5); text-align: center; }`,
        replace: `.page-header { background: linear-gradient(rgba(246, 241, 231, 0.8), rgba(246, 241, 231, 0.9)), url('assets/images/products_hero.png') center/cover no-repeat; padding: calc(var(--navbar-height) + var(--sp-6)) var(--container-gutter) var(--sp-5); text-align: center; }\n    [data-theme="dark"] .page-header { background: linear-gradient(rgba(45, 68, 57, 0.8), rgba(35, 43, 39, 0.9)), url('assets/images/products_hero.png') center/cover no-repeat; }`
    },
    'ingredients.html': {
        find: `.ingredients-hero { background: linear-gradient(145deg, #3E5C50 0%, #5A7D6E 100%); color: #fff; padding: calc(var(--navbar-height) + var(--sp-6)) var(--container-gutter) var(--sp-6); text-align: center; }`,
        replace: `.ingredients-hero { background: linear-gradient(rgba(62, 92, 80, 0.7), rgba(45, 68, 57, 0.9)), url('assets/images/ingredients_hero.png') center/cover no-repeat; color: #fff; padding: calc(var(--navbar-height) + var(--sp-6)) var(--container-gutter) var(--sp-6); text-align: center; }`
    },
    'gifting.html': {
        find: `.gifting-hero { background: linear-gradient(145deg, #C2764A 0%, #A85F35 100%); color: #fff; padding: calc(var(--navbar-height) + var(--sp-6)) var(--container-gutter) var(--sp-6); text-align: center; }`,
        replace: `.gifting-hero { background: linear-gradient(rgba(194, 118, 74, 0.7), rgba(168, 95, 53, 0.9)), url('assets/images/gifting_hero.png') center/cover no-repeat; color: #fff; padding: calc(var(--navbar-height) + var(--sp-6)) var(--container-gutter) var(--sp-6); text-align: center; }`
    },
    'coming-soon.html': {
        find: `background: linear-gradient(135deg, #3E5C50 0%, #2D4439 100%);`,
        replace: `background: url('assets/images/coming_soon.png') center/cover no-repeat;`
    }
};

const authChanges = {
    find: `background: linear-gradient(135deg, #3E5C50 0%, #2D4439 100%);`,
    replace: `background: url('assets/images/auth_image.png') center/cover no-repeat;`
};

for (const [file, info] of Object.entries(changes)) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(info.find)) {
            content = content.replace(info.find, info.replace);
            
            // Remove the dark mode gradient for products if it already existed
            if (file === 'products.html' && content.includes(`[data-theme="dark"] .page-header { background: linear-gradient(145deg, #2D4439 0%, #232B27 100%); }`)) {
                 content = content.replace(`[data-theme="dark"] .page-header { background: linear-gradient(145deg, #2D4439 0%, #232B27 100%); }`, ``);
            }
            
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log('Updated', file);
        }
    }
}

// Auth pages
['login.html', 'signup.html'].forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(authChanges.find)) {
            content = content.replace(authChanges.find, authChanges.replace);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log('Updated', file);
        }
    }
});
