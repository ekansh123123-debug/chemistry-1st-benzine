import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { renderReactions } from './reactions.js';
import { setupAudio } from './audio.js';
import { animateFormation } from './animation.js';

// Setup DOM elements
renderReactions();

// Setup Audio
setupAudio();

// Scene setup
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a192f);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 0, 35);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = false;

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1.0, 100);
pointLight1.position.set(10, 10, 20);
scene.add(pointLight1);

// Molecular Modeling - Scaled Up
const atomMaterialCarbon = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.2 });
const atomMaterialHydrogen = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
const bondMaterialCarbon = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.2 });
const bondMaterialHydrogen = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });

// Increase Sizes
const carbonRadius = 0.8;
const hydrogenRadius = 0.5;
const bondRadius = 0.15;
const ccBondLength = 3.0; // Hexagon side length
const piBondLength = 2.2; // Inner double bonds are shorter to not overlap at corners
const chBondLength = 1.5;
const piBondSpacing = 0.5;

function createAcetylene() {
    const molecule = new THREE.Group();

    // Atoms
    const c1 = new THREE.Mesh(new THREE.SphereGeometry(carbonRadius, 32, 32), atomMaterialCarbon);
    c1.position.x = -ccBondLength / 2;
    molecule.add(c1);

    const c2 = new THREE.Mesh(new THREE.SphereGeometry(carbonRadius, 32, 32), atomMaterialCarbon);
    c2.position.x = ccBondLength / 2;
    molecule.add(c2);

    // C-H Pivot 1
    const chPivot1 = new THREE.Group();
    chPivot1.position.x = -ccBondLength / 2;
    molecule.add(chPivot1);

    const h1 = new THREE.Mesh(new THREE.SphereGeometry(hydrogenRadius, 32, 32), atomMaterialHydrogen);
    h1.position.x = -chBondLength;
    chPivot1.add(h1);

    const chHalfGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, chBondLength / 2, 16);

    const chBond1Black = new THREE.Mesh(chHalfGeom, bondMaterialCarbon);
    chBond1Black.rotation.z = Math.PI / 2;
    chBond1Black.position.x = -chBondLength * 0.25;
    chPivot1.add(chBond1Black);

    const chBond1White = new THREE.Mesh(chHalfGeom, bondMaterialHydrogen);
    chBond1White.rotation.z = Math.PI / 2;
    chBond1White.position.x = -chBondLength * 0.75;
    chPivot1.add(chBond1White);

    // C-H Pivot 2
    const chPivot2 = new THREE.Group();
    chPivot2.position.x = ccBondLength / 2;
    molecule.add(chPivot2);

    const h2 = new THREE.Mesh(new THREE.SphereGeometry(hydrogenRadius, 32, 32), atomMaterialHydrogen);
    h2.position.x = chBondLength;
    chPivot2.add(h2);

    const chBond2Black = new THREE.Mesh(chHalfGeom, bondMaterialCarbon);
    chBond2Black.rotation.z = Math.PI / 2;
    chBond2Black.position.x = chBondLength * 0.25;
    chPivot2.add(chBond2Black);

    const chBond2White = new THREE.Mesh(chHalfGeom, bondMaterialHydrogen);
    chBond2White.rotation.z = Math.PI / 2;
    chBond2White.position.x = chBondLength * 0.75;
    chPivot2.add(chBond2White);

    // C-C Triple Bonds
    const ccBondGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, ccBondLength, 16);
    const piBondGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, piBondLength, 16);

    // Central sigma bond
    const ccBondMain = new THREE.Mesh(ccBondGeom, bondMaterialCarbon);
    ccBondMain.rotation.z = Math.PI / 2;
    molecule.add(ccBondMain);

    // Top pi bond (Inner double bond, so slightly shorter)
    const ccBondPi1 = new THREE.Mesh(piBondGeom, bondMaterialCarbon);
    ccBondPi1.rotation.z = Math.PI / 2;
    ccBondPi1.position.y = piBondSpacing;
    molecule.add(ccBondPi1);

    // Bottom pi bond (Moves to become sigma bond, so full length)
    const ccBondPi2 = new THREE.Mesh(ccBondGeom, bondMaterialCarbon);
    ccBondPi2.rotation.z = Math.PI / 2;
    ccBondPi2.position.y = -piBondSpacing;
    molecule.add(ccBondPi2);

    molecule.userData = {
        c1, c2, chPivot1, chPivot2,
        ccBondMain, ccBondPi1, ccBondPi2
    };

    return molecule;
}

const molecules = [];
// Initial positions (random scattered circle)
const initialR = 12;
const anglesSet = [0, Math.PI * 2 / 3, Math.PI * 4 / 3];

for (let i = 0; i < 3; i++) {
    const mol = createAcetylene();
    mol.position.set(Math.cos(anglesSet[i]) * initialR, Math.sin(anglesSet[i]) * initialR, 0);
    // Point roughly inward
    mol.rotation.z = anglesSet[i] + Math.PI / 2 + (Math.random() * 0.5 - 0.25);

    scene.add(mol);
    molecules.push(mol);
}

window.benzeneData = {
    molecules: molecules,
    scene: scene,
    ccBondLength: ccBondLength
};

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

setTimeout(() => {
    animateFormation(window.benzeneData);
}, 2000);
