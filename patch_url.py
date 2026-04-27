with open('script.js', 'r') as f:
    content = f.read()

# Replace the DOMContentLoaded block
old_init = """// Initialize when document is ready
document.addEventListener("DOMContentLoaded", () => {
    initViewer();
    setupNavigation();
    loadMolecule('benzene');
});"""

new_init = """// Initialize when document is ready
document.addEventListener("DOMContentLoaded", () => {
    initViewer();
    setupNavigation();

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const moleculeParam = urlParams.get('molecule');

    let defaultMol = 'benzene';
    if (moleculeParam && moleculeData[moleculeParam]) {
        defaultMol = moleculeParam;

        // Update active class on navigation buttons
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(b => b.classList.remove('active'));
        const targetBtn = document.querySelector(`.nav-btn[data-molecule="${defaultMol}"]`);
        if(targetBtn) targetBtn.classList.add('active');
    }

    loadMolecule(defaultMol);
});"""

content = content.replace(old_init, new_init)

with open('script.js', 'w') as f:
    f.write(content)
