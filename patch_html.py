with open('index.html', 'r') as f:
    content = f.read()

legend_html = """                <div class="atom-legend">
                    <div class="legend-item">
                        <div class="atom-color carbon"></div>
                        <span>Carbon</span>
                    </div>
                    <div class="legend-item">
                        <div class="atom-color hydrogen"></div>
                        <span>Hydrogen</span>
                    </div>
                </div>"""

# Insert right after <div id="viewer-container" class="mol-container"></div>
content = content.replace(
    '<div id="viewer-container" class="mol-container"></div>',
    '<div id="viewer-container" class="mol-container"></div>\n' + legend_html
)

with open('index.html', 'w') as f:
    f.write(content)
