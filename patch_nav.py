with open('index.html', 'r') as f:
    content = f.read()

new_nav = """                <button class="nav-btn" data-molecule="polyacetylene">
                    <span class="btn-icon">⚡</span>
                    Trans-Polyacetylene
                </button>
                <button class="nav-btn" data-molecule="ppp">
                    <span class="btn-icon">💠</span>
                    Poly(p-phenylene)
                </button>"""

content = content.replace(
"""                <button class="nav-btn" data-molecule="polyacetylene">
                    <span class="btn-icon">⚡</span>
                    Trans-Polyacetylene
                </button>""",
    new_nav
)

with open('index.html', 'w') as f:
    f.write(content)
