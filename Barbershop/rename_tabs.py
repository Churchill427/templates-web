import os, glob, re

html_files = glob.glob('d:\\batch 1\\july_2026\\Barbershop\\pages\\*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace desktop dropdown
    content = re.sub(r'(class="nav__dropdown-item.*?>)Heritage(<)', r'\g<1>Home 1\g<2>', content)
    content = re.sub(r'(class="nav__dropdown-item.*?>)Modern(<)', r'\g<1>Home 2\g<2>', content)

    # Replace mobile dropdown
    content = re.sub(r'(class="mobile-menu__sublink.*?>)Heritage(<)', r'\g<1>Home 1\g<2>', content)
    content = re.sub(r'(class="mobile-menu__sublink.*?>)Modern(<)', r'\g<1>Home 2\g<2>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Updated {os.path.basename(filepath)}')
