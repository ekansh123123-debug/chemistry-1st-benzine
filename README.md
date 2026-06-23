🧪 3D Molecular Visualizer

A web-based interactive 3D viewer for organic molecules, built with Three.js and deployed on Vercel. Explore conjugated polymer structures and classic aromatic compounds right in your browser — no installation required.

Live Demo: benzene-3d-modal.vercel.app


✨ Features


Interactive 3D rendering — rotate, zoom, and pan molecular structures in real time
Multiple molecules — switch between several pre-loaded compounds
Atom color coding — visually distinct colors for carbon and hydrogen atoms
Informational panels — molecular formula and description for each compound
Responsive UI — works in modern desktop and mobile browsers



🔬 Included Molecules

SymbolNameFormulaDescription⌬BenzeneC₆H₆Classic aromatic hydrocarbon; planar hexagonal ring⛓️PPV—Poly(p-phenylene vinylene); conjugated polymer used in OLEDs⚡Trans-Polyacetylene—Simplest conjugated polymer; alternating single/double C–C bonds💠Poly(p-phenylene)—Rigid-rod conjugated polymer with repeating phenylene units


🕹️ Controls

ActionResultLeft Click + DragRotate the moleculeScroll WheelZoom in / outRight Click + DragPan the view


🛠️ Tech Stack


Three.js — WebGL-based 3D rendering
Vanilla JavaScript / HTML / CSS — no framework dependencies
Vercel — hosting and continuous deployment



🚀 Getting Started (Local Development)

bash# Clone the repository
git clone https://github.com/your-username/benzene-3d-modal.git
cd benzene-3d-modal

# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8080

Then open http://localhost:8080 in your browser.


No build step required — this is a static site.




📁 Project Structure

benzene-3d-modal/
├── index.html          # Main entry point
├── style.css           # UI styling
├── main.js             # 3D scene setup and molecule rendering
├── molecules/          # Molecule geometry definitions
│   ├── benzene.js
│   ├── ppv.js
│   ├── polyacetylene.js
│   └── polyphenylene.js
└── README.md


Note: adjust structure above to match your actual file layout.




🤝 Contributing

Pull requests are welcome! To add a new molecule:


Define its atom positions and bond connections in a new file under molecules/
Register it in the molecule selector in main.js
Add an entry (symbol, name, formula, description) to the UI



📄 License

MIT — free to use, modify, and distribute.
