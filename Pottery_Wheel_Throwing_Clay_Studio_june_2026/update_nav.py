import os
import glob
import re

files = glob.glob('pages/*.html')
files.append('index.html') # if it exists at root
for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'href="blog.html"' not in content:
        # Match "About" link and the next link which should be "Contact"
        # We account for the 'active' class on either
        pattern = r'(<a href="about\.html" class="nav-link(?: active)?">About</a>\s*)(<a href="contact\.html" class="nav-link(?: active)?">Contact</a>)'
        
        new_content = re.sub(
            pattern,
            r'\1<a href="blog.html" class="nav-link">Blog</a>\n        \2',
            content
        )
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated {f}")
