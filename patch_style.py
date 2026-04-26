import re

with open('style.css', 'r') as f:
    content = f.read()

# Make background-animation fixed
content = content.replace(
    'position: absolute;',
    'position: fixed;'
)

# Replace @media (max-width: 900px) block
media_block = """@media (max-width: 900px) {
    body {
        overflow-y: auto;
        height: auto;
    }

    .app-container {
        flex-direction: column;
        height: auto;
        min-height: 100vh;
    }

    .sidebar {
        width: 100%;
        height: auto;
    }

    nav {
        flex-direction: row;
        overflow-x: auto;
    }

    .nav-btn {
        white-space: nowrap;
    }

    .viewer-area {
        min-height: 500px;
        display: flex;
        flex-direction: column;
    }
}"""

content = re.sub(r'@media \(max-width: 900px\) \{.*\}', media_block, content, flags=re.DOTALL)

with open('style.css', 'w') as f:
    f.write(content)
