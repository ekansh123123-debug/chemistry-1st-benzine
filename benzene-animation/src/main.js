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
scene.background = new THREE.Color(0x050508);
scene.fog = new THREE.FogExp2(0x050508, 0.02);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 10, 25);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Add post processing bloom effect visually by increasing exposure/lighting for realism
renderer.toneMapping = THREE.ReinhardToneMapping;

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff4500, 2, 50);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffa500, 1.5, 50);
pointLight2.position.set(-5, -5, -5);
scene.add(pointLight2);

// Molecular Modeling - Acetylene (C2H2)
const atomMaterialCarbon = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.1 });
const atomMaterialHydrogen = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4, metalness: 0.1 });
const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2, metalness: 0.6 });

const carbonRadius = 0.6;
const hydrogenRadius = 0.4;
const bondRadius = 0.15;
const ccBondLength = 1.2; // Triple bond length
const chBondLength = 1.0; // Single bond length

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

    // C-H Bonds
    const chBondGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, chBondLength, 16);

    const chBond1 = new THREE.Mesh(chBondGeom, bondMaterial);
    chBond1.rotation.z = Math.PI / 2;
    chBond1.position.x = -ccBondLength / 2 - chBondLength / 2;
    molecule.add(chBond1);

    const chBond2 = new THREE.Mesh(chBondGeom, bondMaterial);
    chBond2.rotation.z = Math.PI / 2;
    chBond2.position.x = ccBondLength / 2 + chBondLength / 2;
    molecule.add(chBond2);

    // C-C Triple Bonds (3 separate cylinders so we can detach one later)
    const ccBondGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, ccBondLength, 16);

    // Central bond
    const ccBondMain = new THREE.Mesh(ccBondGeom, bondMaterial);
    ccBondMain.rotation.z = Math.PI / 2;
    molecule.add(ccBondMain);

    // Top pi bond
    const ccBondPi1 = new THREE.Mesh(ccBondGeom, bondMaterial);
    ccBondPi1.rotation.z = Math.PI / 2;
    ccBondPi1.position.y = carbonRadius * 0.7; // Offset slightly
    molecule.add(ccBondPi1);

    // Bottom pi bond (This is the one we will detach and move)
    const ccBondPi2 = new THREE.Mesh(ccBondGeom, bondMaterial.clone()); // Clone material so we can fade it later independently
    ccBondPi2.rotation.z = Math.PI / 2;
    ccBondPi2.position.y = -carbonRadius * 0.7; // Offset slightly
    molecule.add(ccBondPi2);

    // Store references to parts we need to animate
    molecule.userData = {
        c1, c2, h1, h2, chBond1, chBond2, ccBondMain, ccBondPi1, ccBondPi2
    };

    return molecule;
}

const molecules = [];
const R = 8; // Initial distance from center
const angles = [Math.PI/2, Math.PI/2 + Math.PI*2/3, Math.PI/2 + Math.PI*4/3];

for (let i = 0; i < 3; i++) {
    const mol = createAcetylene();
    // Position them in a circle
    mol.position.set(Math.cos(angles[i]) * R, Math.sin(angles[i]) * R, 0);
    // Orient them tangentially
    mol.rotation.z = angles[i] + Math.PI / 2;

    scene.add(mol);
    molecules.push({ group: mol, angle: angles[i] });
}

// Resonance Ring (Torus) - Initially hidden
const ringGeometry = new THREE.TorusGeometry(2.5, 0.2, 16, 100);
const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff4500,
    emissiveIntensity: 0,
    transparent: true,
    opacity: 0,
    roughness: 0.1,
    metalness: 0.8
});
const resonanceRing = new THREE.Mesh(ringGeometry, ringMaterial);
scene.add(resonanceRing);

// Handle Window Resize
window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Render Loop
const clock = new THREE.Clock();

function tick() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

// Start Animation sequence
setTimeout(() => {
    animateFormation(molecules, resonanceRing, scene, THREE);
}, 2000);
