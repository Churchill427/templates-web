// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Light/Dark)
    const themeToggles = document.querySelectorAll('.theme-toggle');
    
    // Initialize Theme
    const savedTheme = localStorage.getItem('trax-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggles(savedTheme);

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('trax-theme', newTheme);
            updateThemeToggles(newTheme);
        });
    });

    function updateThemeToggles(theme) {
        themeToggles.forEach(btn => {
            // Button displays the target state to switch to (e.g. LIGHT when in Dark mode, DARK when in Light mode)
            btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        });
    }

    // 2. Direction Toggle (LTR/RTL)
    const dirToggles = document.querySelectorAll('.dir-toggle');
    
    // Initialize Direction
    const savedDir = localStorage.getItem('trax-dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirToggles(savedDir);

    dirToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('trax-dir', newDir);
            updateDirToggles(newDir);
        });
    });

    function updateDirToggles(dir) {
        dirToggles.forEach(btn => {
            btn.textContent = dir.toUpperCase();
        });
    }

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            mobileMenu.classList.toggle('open');
            
            // Animate hamburger lines
            const spans = hamburger.querySelectorAll('span');
            if (!isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // 4. Scroll Animations (IntersectionObserver)
    const animElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animElements.forEach(el => el.classList.add('in-view'));
    }

    // 5. Active Link Highlight based on current page
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle):not(.mobile-dropdown-toggle)');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Simple logic for active state - can be refined based on exact URLs
        if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (currentPath === '/' && (linkPath === '/' || linkPath === 'index.html')) {
            link.classList.add('active');
        } else if (currentPath.endsWith('/') && (linkPath === '/' || linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 6. Mobile Dropdown Toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = toggle.closest('.mobile-dropdown');
            if (parent) {
                parent.classList.toggle('open');
            }
        });
    });
});

