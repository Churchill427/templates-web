import os, glob, re
html_files = glob.glob('d:\\batch 1\\july_2026\\Barbershop\\pages\\*.html')
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
    def repl(m):
        cls = m.group(1)
        active_class = ' active' if 'active' in cls else ''
        fname = os.path.basename(filepath)
        h_active = ' active' if fname == 'index.html' else ''
        m_active = ' active' if fname == 'home-b.html' else ''
        return f'''<div class="mobile-menu__dropdown">
      <div class="mobile-menu__link{active_class}" style="cursor: pointer;" onclick="this.parentElement.classList.toggle('open')">Home <span style="font-size: 0.8em; margin-left: 4px;">▼</span></div>
      <div class="mobile-menu__dropdown-content">
        <a href="index.html" class="mobile-menu__sublink{h_active}">Heritage</a>
        <a href="home-b.html" class="mobile-menu__sublink{m_active}">Modern</a>
      </div>
    </div>'''
    new_content = re.sub(r'<a href="index\.html" class="(mobile-menu__link.*?)">Home</a>', repl, content)
    with open(filepath, 'w', encoding='utf-8') as f: f.write(new_content)
    print(f'Updated {os.path.basename(filepath)}')
