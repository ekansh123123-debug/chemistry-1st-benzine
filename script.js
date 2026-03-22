document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('stage-title');
    const desc = document.getElementById('stage-desc');
    const heatBg = document.getElementById('heat-bg');
    
    const molecules = document.querySelectorAll('.molecule-slider');
    const innerPiBonds = document.querySelectorAll('.inner-pi');
    const outerPiBonds = document.querySelectorAll('.outer-pi');
    const newBonds = document.getElementById('new-bonds');
    const resonanceRing = document.getElementById('resonance-ring');

    function updateText(heading, description, color = "#e2e8f0") {
        title.innerText = heading;
        title.style.color = color;
        desc.innerText = description;
    }

    function runReactionSequence() {
        // Reset everything to starting Phase
        molecules.forEach(m => m.className = 'molecule-slider far-apart');
        innerPiBonds.forEach(bond => bond.classList.remove('hidden'));
        outerPiBonds.forEach(bond => bond.classList.remove('hidden'));
        
        newBonds.className = 'hidden';
        resonanceRing.className = 'hidden';
        heatBg.className = 'hidden';
        resonanceRing.classList.remove('spin');

        updateText("3C₂H₂ (Ethyne)", "Three isolated ethyne molecules approach.");

        // Phase 1: Heat and Compression
        setTimeout(() => {
            updateText("Red-Hot Iron Tube (873K)", "High heat and pressure force the molecules together.", "#ef4444");
            heatBg.className = 'visible';
            molecules.forEach(m => m.className = 'molecule-slider together');
        }, 1500);

        // Phase 2: Reaction - Pi bonds break, new Sigma bonds form
        setTimeout(() => {
            updateText("Cyclic Polymerization", "One pi bond from each triple bond breaks to connect the ring.", "#f472b6");
            innerPiBonds.forEach(bond => bond.classList.add('hidden'));
            newBonds.className = 'visible';
        }, 4500);

        // Phase 3: Kekulé Benzene is temporarily established
        setTimeout(() => {
            updateText("Benzene Formed", "A complete hexagon with alternating double bonds is established.", "#22d3ee");
            heatBg.className = 'hidden'; // Cool down
        }, 7000);

        // Phase 4: Delocalization to true Resonance Hybrid
        setTimeout(() => {
            updateText("Resonance Stabilization", "Electrons delocalize to form a highly stable aromatic ring.", "#10b981");
            outerPiBonds.forEach(bond => bond.classList.add('hidden'));
            resonanceRing.className = 'visible spin';

            // Loop animation automatically
            setTimeout(runReactionSequence, 8000); 
        }, 9500);
    }

    // Start immediately
    runReactionSequence();
});
