export function setupAudio() {
    const btn = document.getElementById('toggle-audio-btn');
    let audioCtx;
    let isPlaying = false;
    let droneOsc1, droneOsc2, gainNode;

    btn.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            // Create cinematic drone
            droneOsc1 = audioCtx.createOscillator();
            droneOsc2 = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();

            droneOsc1.type = 'sawtooth';
            droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

            droneOsc2.type = 'sine';
            droneOsc2.frequency.setValueAtTime(55.5, audioCtx.currentTime); // Slight detune for beating

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, audioCtx.currentTime);

            droneOsc1.connect(filter);
            droneOsc2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            droneOsc1.start();
            droneOsc2.start();
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        }

        if (isPlaying) {
            // Fade out
            gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
            btn.textContent = "Play Cinematic Audio";
            btn.style.color = "var(--accent)";
            btn.style.background = "transparent";
            isPlaying = false;
        } else {
            // Fade in
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            gainNode.gain.setTargetAtTime(0.3, audioCtx.currentTime, 1);
            btn.textContent = "Mute Audio";
            btn.style.color = "#fff";
            btn.style.background = "var(--accent)";
            isPlaying = true;
        }
    });
}
