document.addEventListener('DOMContentLoaded', () => {
    // Grab all necessary DOM elements
    const title = document.getElementById('stage-title');
    const desc = document.getElementById('stage-desc');
    const kekuleA = document.getElementById('kekule-a');
    const kekuleB = document.getElementById('kekule-b');
    const resonanceRing = document.getElementById('resonance-ring');
    const sigmaBonds = document.getElementById('sigma-bonds');

    // Helper function to update text
    function updateText(heading, description, color = "#e2e8f0") {
        title.innerText = heading;
        title.style.color = color;
        desc.innerText = description;
    }

    // The main cinematic sequence
    function runAnimationSequence() {
        // Reset state
        kekuleA.className = 'pi-bonds hidden';
        kekuleB.className = 'pi-bonds hidden';
        resonanceRing.className = 'hidden';
        sigmaBonds.style.stroke = "#475569";

        // Step 1: Show Kekule A (1.5 seconds in)
        setTimeout(() => {
            updateText("Kekulé Structure 1", "Pi electrons form localized double bonds.", "#38bdf8");
            kekuleA.className = 'pi-bonds visible';
        }, 1500);

        // Step 2: Shift to Kekule B (4 seconds in)
        setTimeout(() => {
            updateText("Kekulé Structure 2", "The double bonds shift to adjacent positions.", "#f472b6");
            kekuleA.className = 'pi-bonds hidden';
            kekuleB.className = 'pi-bonds visible';
        }, 4000);

        // Step 3: Rapid shifting / Delocalization (6.5 seconds in)
        setTimeout(() => {
            updateText("Electron Delocalization", "Electrons move rapidly, unable to be pinned down.", "#cbd5e1");
            
            // Apply fast transition classes
            kekuleA.className = 'pi-bonds fast-transition';
            kekuleB.className = 'pi-bonds fast-transition';

            // Rapid toggle interval
            let toggle = true;
            let flashInterval = setInterval(() => {
                kekuleA.style.opacity = toggle ? "1" : "0";
                kekuleB.style.opacity = toggle ? "0" : "1";
                toggle = !toggle;
            }, 150); // Flash every 150ms

            // Stop flashing and move to hybrid (9 seconds in)
            setTimeout(() => {
                clearInterval(flashInterval);
                kekuleA.style.opacity = "0";
                kekuleB.style.opacity = "0";
                
                // Final Step: Resonance Hybrid
                updateText("Resonance Hybrid", "The true structure: a perfectly stable, delocalized pi ring.", "#34d399");
                resonanceRing.className = 'visible spin';
                sigmaBonds.style.stroke = "#334155"; // Dim the background skeleton
                
                // Loop the whole animation after viewing the hybrid for a few seconds
                setTimeout(runAnimationSequence, 6000); 
                
            }, 2500);

        }, 6500);
    }

    // Start the animation immediately upon load
    runAnimationSequence();
});
