const moleculeData = {
    benzene: {
        title: "Benzene",
        formula: "C₆H₆",
        desc: "Benzene is an organic chemical compound with the molecular formula C6H6. The benzene molecule is composed of six carbon atoms joined in a planar ring with one hydrogen atom attached to each. It is a fundamental aromatic hydrocarbon.",
        cid: "cid:241"
    },
    ppv: {
        title: "PPV Oligomer",
        formula: "(C₈H₆)n",
        desc: "Poly(p-phenylene vinylene) or PPV is a highly fluorescent conducting polymer. Shown here is an oligomeric representation (trans,trans-1,4-Distyrylbenzene) demonstrating the conjugated backbone that is crucial for its application in OLEDs and solar cells.",
        cid: "cid:640299"
    },
    polyacetylene: {
        title: "Trans-Polyacetylene",
        formula: "(C₂H₂)n",
        desc: "Polyacetylene is an organic polymer. The highly conductive form is the all-trans-isomer. Shown here is an all-trans oligomer (octatetraene) illustrating the alternating single and double bonds that allow for electrical conductivity when doped.",
        cid: "cid:5463164"
    }
};

let viewer = null;

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", () => {
    initViewer();
    setupNavigation();
    loadMolecule('benzene');
});

function initViewer() {
    let element = document.querySelector('#viewer-container');
    let config = { backgroundColor: 'rgba(0,0,0,0)' };
    viewer = $3Dmol.createViewer(element, config);
}

function loadMolecule(molKey) {
    const data = moleculeData[molKey];
    if (!data || !viewer) return;

    // Show loading
    document.getElementById('loading').classList.remove('hidden');

    // Update UI info
    document.getElementById('info-title').innerText = data.title;
    document.getElementById('info-formula').innerText = data.formula;
    
    // Add simple fade animation for description
    const descEl = document.getElementById('info-desc');
    descEl.style.opacity = 0;
    setTimeout(() => {
        descEl.innerText = data.desc;
        descEl.style.transition = 'opacity 0.4s ease';
        descEl.style.opacity = 1;
    }, 200);

    // Clear current viewer
    viewer.clear();

    // Download and render the new molecule
    $3Dmol.download(data.cid, viewer, {}, function() {
        // Apply beautiful styling
        viewer.setStyle({}, {
            stick: { radius: 0.15, colorscheme: 'Jmol' },
            sphere: { scale: 0.3, colorscheme: 'Jmol' }
        });
        
        // Optimize view
        viewer.zoomTo();
        viewer.render();
        
        // Hide loading
        document.getElementById('loading').classList.add('hidden');
        
        // Optional: Spin the molecule slowly for dynamic effect
        viewer.spin(true);
        setTimeout(() => {
            viewer.spin(false);
        }, 3000); // Spin for 3 seconds on load
    });
}

function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            const target = e.currentTarget;
            target.classList.add('active');
            
            // Load molecule
            const molKey = target.getAttribute('data-molecule');
            loadMolecule(molKey);
        });
    });
}
