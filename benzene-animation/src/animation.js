import gsap from 'gsap';
import * as THREE from 'three';

export function animateFormation(data) {
    const { molecules, scene, ccBondLength } = data;
    const tl = gsap.timeline();

    // Phase 1: Heat up
    molecules.forEach((mol) => {
        tl.to(mol.position, {
            x: `+=${(Math.random() - 0.5) * 2}`,
            y: `+=${(Math.random() - 0.5) * 2}`,
            duration: 0.1,
            repeat: 15,
            yoyo: true,
            ease: "none"
        }, 0);
    });

    // Phase 2: Approach (Exact Regular Hexagon)
    // Hexagon side length = ccBondLength
    const hexRadius = ccBondLength;
    const apothem = hexRadius * Math.sqrt(3) / 2;

    // We place the 3 molecules on alternating sides of the hexagon
    // Let's use sides at 30 deg, 150 deg, 270 deg (Bottom)
    // Actually, sides at 90, 210, 330 looks better (Top is flat, bottom is pointy)
    // Let's use angles: 90 (PI/2), 210 (7PI/6), 330 (11PI/6)
    const sideAngles = [Math.PI/2, 7*Math.PI/6, 11*Math.PI/6];

    molecules.forEach((mol, i) => {
        const angle = sideAngles[i];
        const targetX = Math.cos(angle) * apothem;
        const targetY = Math.sin(angle) * apothem;

        tl.to(mol.position, {
            x: targetX,
            y: targetY,
            z: 0,
            duration: 2.5,
            ease: "power2.inOut"
        }, 1.5);

        // The cylinder is along local X axis.
        // The side of the hexagon is perpendicular to the apothem angle.
        // We want the molecule to lie flat on the side.
        tl.to(mol.rotation, {
            x: 0,
            y: 0,
            z: angle + Math.PI / 2,
            duration: 2.5,
            ease: "power2.inOut"
        }, 1.5);
    });

    // Phase 3: Snap moving bonds to empty sides
    // The empty sides are at: 30 (PI/6), 150 (5PI/6), 270 (3PI/2)
    const emptySides = [5*Math.PI/6, 3*Math.PI/2, Math.PI/6];
    const shiftingBonds = [];

    molecules.forEach((mol, i) => {
        const movingBond = mol.userData.ccBondPi2;
        shiftingBonds.push(movingBond);

        // Remove from molecule, add to scene to animate in world space
        scene.attach(movingBond);
    });

    shiftingBonds.forEach((bond, i) => {
        const angle = emptySides[i];
        const targetX = Math.cos(angle) * apothem;
        const targetY = Math.sin(angle) * apothem;

        // Animate bond translating and rotating to the new empty side
        tl.to(bond.position, {
            x: targetX,
            y: targetY,
            z: 0,
            duration: 1.5,
            ease: "power2.inOut"
        }, 4.0);

        // Since bond was added to scene, its rotation is currently relative to world.
        // It should match the angle of the new side
        tl.to(bond.rotation, {
            x: 0,
            y: 0,
            z: angle + Math.PI / 2,
            duration: 1.5,
            ease: "power2.inOut"
        }, 4.0);
    });

    // Phase 4: Kekulé Resonance
    // The static ring consists of the main sigma bonds and the pi2 bonds we just moved.
    // The remaining pi1 bonds on the original molecules need to shift to the empty sides
    // to simulate the alternating double bonds.
    // Since the original sides and empty sides alternate exactly 60 degrees apart,
    // we can create a central group containing just the pi1 bonds, and rotate the group by 60 deg.

    const resonanceGroup = new THREE.Group();
    scene.add(resonanceGroup);

    // Once everything is in place, attach the pi1 bonds to the resonance group
    tl.add(() => {
        molecules.forEach(mol => {
            const pi1 = mol.userData.ccBondPi1;
            resonanceGroup.attach(pi1);
        });
    }, 5.5);

    // Rotate exactly 60 degrees (PI/3)
    tl.to(resonanceGroup.rotation, {
        z: Math.PI / 3,
        duration: 0.2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.8
    }, 6.0);

    return tl;
}
