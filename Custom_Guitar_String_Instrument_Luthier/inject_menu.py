import os
import glob
import re

# Read index.html to get the mobile menu HTML
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the mobile menu section
mobile_menu_match = re.search(r'(  <!-- Mobile Menu Overlay -->.*?)\s+<!-- Cart Drawer -->', content, re.DOTALL)
if not mobile_menu_match:
    print('Could not find Mobile Menu Overlay in index.html')
    exit(1)

mobile_menu_html = mobile_menu_match.group(1)

# Find all other HTML files
html_files = [f for f in glob.glob('*.html') if f != 'index.html']

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        file_content = f.read()
    
    # If it already has Mobile Menu Overlay, skip or replace
    if '<!-- Mobile Menu Overlay -->' in file_content:
        # Replace existing to be sure
        file_content = re.sub(r'  <!-- Mobile Menu Overlay -->.*?(?=\s+<!-- Cart Drawer -->)', mobile_menu_html, file_content, flags=re.DOTALL)
    else:
        # Inject before Cart Drawer
        file_content = file_content.replace('  <!-- Cart Drawer -->', mobile_menu_html + '\n  <!-- Cart Drawer -->')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(file_content)

print('Mobile menu injected into all HTML files.')
