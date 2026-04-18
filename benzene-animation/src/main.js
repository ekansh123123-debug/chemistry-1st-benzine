import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { renderReactions } from './reactions.js';
import { animateFormation } from './animation.js';
import { setupAudio } from './audio.js';

// Setup DOM elements
renderReactions();

// Setup Audio
setupAudio();

// Scene setup
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a192f);
scene.fog = new THREE.FogExp2(0x0a192f, 0.02);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 10, 25);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ReinhardToneMapping;

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 50);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1.0, 50);
pointLight2.position.set(-10, -10, -10);
scene.add(pointLight2);

// Molecular Modeling - Acetylene (C2H2)
const atomMaterialCarbon = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.2 });
const atomMaterialHydrogen = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
const bondMaterialCarbon = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.2 });
const bondMaterialHydrogen = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });

const carbonRadius = 0.6;
const hydrogenRadius = 0.4;
const bondRadius = 0.15;
const ccBondLength = 1.6; // Slightly longer to fit 3 distinct parallel bonds
const chBondLength = 1.2;

function createAcetylene() {
    const molecule = new THREE.Group();

    // Atoms
    const c1 = new THREE.Mesh(new THREE.SphereGeometry(carbonRadius, 32, 32), atomMaterialCarbon);
    c1.position.x = -ccBondLength / 2;
    molecule.add(c1);

    const c2 = new THREE.Mesh(new THREE.SphereGeometry(carbonRadius, 32, 32), atomMaterialCarbon);
    c2.position.x = ccBondLength / 2;
    molecule.add(c2);

    const h1 = new THREE.Mesh(new THREE.SphereGeometry(hydrogenRadius, 32, 32), atomMaterialHydrogen);
    h1.position.x = -ccBondLength / 2 - chBondLength;
    molecule.add(h1);

    const h2 = new THREE.Mesh(new THREE.SphereGeometry(hydrogenRadius, 32, 32), atomMaterialHydrogen);
    h2.position.x = ccBondLength / 2 + chBondLength;
    molecule.add(h2);

    // C-H Bonds (Left side: H1 to C1)
    const chHalfGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, chBondLength / 2, 16);

    // White half connected to H1
    const chBond1White = new THREE.Mesh(chHalfGeom, bondMaterialHydrogen);
    chBond1White.rotation.z = Math.PI / 2;
    chBond1White.position.x = -ccBondLength / 2 - chBondLength * 0.75;
    molecule.add(chBond1White);

    // Black half connected to C1
    const chBond1Black = new THREE.Mesh(chHalfGeom, bondMaterialCarbon);
    chBond1Black.rotation.z = Math.PI / 2;
    chBond1Black.position.x = -ccBondLength / 2 - chBondLength * 0.25;
    molecule.add(chBond1Black);

    // C-H Bonds (Right side: C2 to H2)
    // Black half connected to C2
    const chBond2Black = new THREE.Mesh(chHalfGeom, bondMaterialCarbon);
    chBond2Black.rotation.z = Math.PI / 2;
    chBond2Black.position.x = ccBondLength / 2 + chBondLength * 0.25;
    molecule.add(chBond2Black);

    // White half connected to H2
    const chBond2White = new THREE.Mesh(chHalfGeom, bondMaterialHydrogen);
    chBond2White.rotation.z = Math.PI / 2;
    chBond2White.position.x = ccBondLength / 2 + chBondLength * 0.75;
    molecule.add(chBond2White);

    // C-C Triple Bonds (All black, 3 separate cylinders)
    const ccBondGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, ccBondLength, 16);

    // Central bond
    const ccBondMain = new THREE.Mesh(ccBondGeom, bondMaterialCarbon.clone());
    ccBondMain.rotation.z = Math.PI / 2;
    molecule.add(ccBondMain);

    // Top pi bond
    const ccBondPi1 = new THREE.Mesh(ccBondGeom, bondMaterialCarbon.clone());
    ccBondPi1.rotation.z = Math.PI / 2;
    ccBondPi1.position.y = 0.4; // Explicit spacing
    molecule.add(ccBondPi1);

    // Bottom pi bond
    const ccBondPi2 = new THREE.Mesh(ccBondGeom, bondMaterialCarbon.clone());
    ccBondPi2.rotation.z = Math.PI / 2;
    ccBondPi2.position.y = -0.4;
    molecule.add(ccBondPi2);

    molecule.userData = {
        c1, c2, h1, h2,
        chBond1White, chBond1Black, chBond2Black, chBond2White,
        ccBondMain, ccBondPi1, ccBondPi2
    };

    return molecule;
}

const molecules = [];
const R = 8; // Initial distance from center
// To form a perfect hexagon, the 3 acetylene molecules must align perfectly
// The hexagon has 6 sides. Each C2H2 covers 2 sides (or 1 side with 2 carbons)
// They will be positioned at 60, 180, 300 degrees.
const angles = [Math.PI/6, Math.PI/2 + Math.PI/3, 5*Math.PI/6 + Math.PI/3]; // these don't form a triangle, let's use:
const hexAngles = [Math.PI/6, 5*Math.PI/6, 9*Math.PI/6];
// Actually, let's align them on 3 sides of a hexagon:
// Angle 0, 120, 240
const anglesSet = [0, Math.PI * 2 / 3, Math.PI * 4 / 3];

for (let i = 0; i < 3; i++) {
    const mol = createAcetylene();
    mol.position.set(Math.cos(anglesSet[i]) * R, Math.sin(anglesSet[i]) * R, 0);
    // Acetylene molecules are tangent to the circle
    mol.rotation.z = anglesSet[i] + Math.PI / 2;

    scene.add(mol);
    molecules.push({ group: mol, angle: anglesSet[i] });
}

// Handle Window Resize
window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Render Loop
function tick() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();

// Expose variables for animation
window.appScene = scene;
window.appTHREE = THREE;
window.appMolecules = molecules;

setTimeout(() => {
    animateFormation(molecules, scene, THREE);
}, 2000);
