// Data for the different stages of the animation
const stagesData = {
    'a': {
        title: "Kekulé Structure A",
        text: "Benzene consists of six carbon atoms joined in a planar hexagonal ring. In this classical Kekulé structure, alternating single and double bonds are shown.",
        layers: { a: 1, b: 0, hybrid: 0 }
    },
    'b': {
        title: "Kekulé Structure B",
        text: "Because electrons are constantly moving, the double bonds can shift. This represents the second resonance structure. However, the bonds don't actually flip back and forth in reality.",
        layers: { a: 0, b: 1, hybrid: 0 }
    },
    'hybrid': {
        title: "Resonance Hybrid",
        text: "In reality, the pi electrons are delocalized across all six carbon atoms. This forms a continuous electron cloud (often drawn as a circle), giving Benzene its unique chemical stability (aromaticity).",
        layers: { a: 0, b: 0, hybrid: 1 }
    }
};

let autoPlayInterval = null;
let currentAutoStep = 0;
const sequence = ['a', 'b', 'a', 'b', 'hybrid']; // The order of the auto-play animation

// Function to set the visual and textual stage
function setStage(stageKey) {
    const data = stagesData[stageKey];
    
    // Update SVG opacities
    document.getElementById('kekule-a').style.opacity = data.layers.a;
    document.getElementById('kekule-b').style.opacity = data.layers.b;
    document.getElementById('resonance-ring').style.opacity = data.layers.hybrid;

    // Update Text content
    document.getElementById('info-title').innerText = data.title;
    document.getElementById('info-text').innerText = data.text;

    // Update Button Styles
    document.querySelectorAll('.button-group button').forEach(btn => btn.classList.remove('active'));
    if (document.getElementById(`btn-${stageKey}`)) {
        document.getElementById(`btn-${stageKey}`).classList.add('active');
    }
}

// Function to handle the auto-play animation
function playAutoAnimation() {
    const playBtn = document.getElementById('btn-play');
    
    // If already playing, stop it
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        playBtn.innerText = "Play Animation";
        playBtn.style.background = "var(--primary)";
        return;
    }

    // Start playing
    playBtn.innerText = "Stop Animation";
    playBtn.style.background = "#ef4444"; // Red stop color
    currentAutoStep = 0;
    
    // Immediately show first step
    setStage(sequence[currentAutoStep]);

    // Loop through the sequence
    autoPlayInterval = setInterval(() => {
        currentAutoStep++;
        if (currentAutoStep >= sequence.length) {
            // Stop at the hybrid stage
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            playBtn.innerText = "Play Animation";
            playBtn.style.background = "var(--primary)";
            return;
        }
        setStage(sequence[currentAutoStep]);
    }, 1200); // 1.2 seconds per transition
}
