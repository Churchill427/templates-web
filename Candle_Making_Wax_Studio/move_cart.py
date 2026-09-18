import os, glob, re

files = glob.glob('*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We want to match `<a href="cart.html" class="nav__cart"...>...</a>` block
    # It might have a span inside for the count.
    # It is right before `</nav>`
    pattern = re.compile(r'(<a href="cart\.html" class="nav__cart[^>]*>.*?</svg>\s*Cart.*?(?:</span>\))?\s*</a>)\s*(</nav>)', re.DOTALL)
    match = pattern.search(content)
    
    if not match:
        print(f'Cart not found in {f}')
        continue
        
    cart_html = match.group(1)
    
    # Remove from nav
    content = content[:match.start(1)] + match.group(2) + content[match.end(2):]
    
    # Find the RTL button to insert after
    insert_pattern = re.compile(r'(<button class="header__rtl-toggle"[^>]*>RTL</button>\s*)', re.DOTALL)
    match_insert = insert_pattern.search(content)
    
    if match_insert:
        content = content[:match_insert.end(1)] + cart_html + '\n' + content[match_insert.end(1):]
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated {f}')
    else:
        print(f'RTL button not found in {f}')
