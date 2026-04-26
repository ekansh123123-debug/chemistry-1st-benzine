import re

with open('style.css', 'r') as f:
    content = f.read()

# Replace body { height: 100vh; overflow: hidden; position: relative; }
body_block = """body {
    background-color: var(--bg-color);
    color: var(--text-primary);
    font-family: var(--font-body);
    height: 100vh;
    overflow: hidden;
    position: relative;
}"""

new_body_block = """body {
    background-color: var(--bg-color);
    color: var(--text-primary);
    font-family: var(--font-body);
    height: 100vh;
    position: relative;
}
@media (min-width: 901px) {
    body {
        overflow: hidden;
    }
}"""

content = content.replace(body_block, new_body_block)

# Fix background-animation which had two position: fixed; if not careful
content = re.sub(r'\.background-animation \{[^}]+\}',
""".background-animation {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
    overflow: hidden;
    background: radial-gradient(circle at center, #111827 0%, #030712 100%);
}""", content)


with open('style.css', 'w') as f:
    f.write(content)
