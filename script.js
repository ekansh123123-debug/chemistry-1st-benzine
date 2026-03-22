document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const title = document.getElementById('stage-title');
    const desc = document.getElementById('stage-desc');
    const heatBg = document.getElementById('heat-bg');
    
    // Molecules and Bonds
    const m1 = document.getElementById('m1');
    const m2 = document.getElementById('m2');
    const m3 = document.getElementById('m3');
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
        // Reset to initial state
        m1.className.baseVal = 'molecule far-apart-1';
        m2.className.baseVal = 'molecule far-apart-2';
        m3.className.baseVal = 'molecule far-apart-3';
        
        innerPiBonds.forEach(bond => bond.style.opacity = 1);
        outerPiBonds.forEach(bond => bond.style.opacity = 1);
        
        newBonds.classList.replace('visible', 'hidden');
        resonanceRing.classList.replace('visible', 'hidden');
        heatBg.classList.replace('visible', 'hidden');
        resonanceRing.classList.remove('spin');

        updateText("3C₂H₂ (Ethyne)", "Three isolated ethyne molecules approach.");

        // Step 1: Heat applied, molecules drawn together (1.5s in)
        setTimeout(() => {
            updateText("Red-Hot Iron Tube (873K)", "High heat and pressure force the molecules together.", "#ef4444");
            heatBg.classList.replace('hidden', 'visible');
            
            // Slam molecules into hexagon formation
            m1.className.baseVal = 'molecule together';
            m2.className.baseVal = 'molecule together';
            m3.className.baseVal = 'molecule together';
        }, 1500);

        // Step 2: Reaction - Pi bonds break, new Sigma bonds form (4.5s in)
        setTimeout(() => {
            updateText("Cyclic Polymerization", "One pi bond from each triple bond breaks to connect the ring.", "#f472b6");
            
            // Inner Pi bonds fade out (breaking)
            innerPiBonds.forEach(bond => bond.style.opacity = 0);
            
            // New Sigma bonds fade in (connecting)
            newBonds.classList.replace('hidden', 'visible');
        }, 4500);

        // Step 3: Benzene formed (Kekulé structure) (7s in)
        setTimeout(() => {
            updateText("Benzene Formed", "The Kekulé structure is temporarily established.", "#22d3ee");
            heatBg.classList.replace('visible', 'hidden'); // Cool down
        }, 7000);

        // Step 4: Delocalization into Resonance Hybrid (9.5s in)
        setTimeout(() => {
            updateText("Resonance Stabilization", "Electrons delocalize to form a highly stable pi ring.", "#10b981");
            
            // Remaining Pi bonds fade out as they delocalize
            outerPiBonds.forEach(bond => bond.style.opacity = 0);
            
            // Green resonance ring spins up
            resonanceRing.classList.replace('hidden', 'visible');
            resonanceRing.classList.add('spin');

            // Loop the animation
            setTimeout(runReactionSequence, 8000); 

        }, 9500);
    }

    // Start the reaction immediately
    runReactionSequence();
});
