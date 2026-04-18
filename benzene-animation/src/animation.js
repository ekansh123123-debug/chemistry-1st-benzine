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
    const hexRadius = ccBondLength;
    const apothem = hexRadius * Math.sqrt(3) / 2;

    // We place the 3 molecules on alternating sides of the hexagon
    // Angles for the sides: 90 (PI/2), 210 (7PI/6), 330 (11PI/6)
    const sideAngles = [Math.PI/2, 7*Math.PI/6, 11*Math.PI/6];

    molecules.forEach((mol, i) => {
        const angle = sideAngles[i];
        const targetX = Math.cos(angle) * apothem;
        const targetY = Math.sin(angle) * apothem;

        tl.to(mol.position, {
            x: targetX,
            y: targetY,
            z: 0,
            duration: 0.8,
            ease: "power2.inOut"
        }, 0.5);

        tl.to(mol.rotation, {
            x: 0,
            y: 0,
            z: angle,
            duration: 0.8,
            ease: "power2.inOut"
        }, 0.5);
    });

    // Phase 3: Snap moving bonds to empty sides
    // The empty sides are at: 30 (PI/6), 150 (5PI/6), 270 (3PI/2)
    const emptySides = [5*Math.PI/6, 3*Math.PI/2, Math.PI/6];

    molecules.forEach((mol, i) => {
        const movingBond = mol.userData.ccBondPi2;

        // At 4.0s, remove from molecule and add to scene to animate
        tl.add(() => {
            // Calculate world position before detaching
            const worldPos = new THREE.Vector3();
            movingBond.getWorldPosition(worldPos);

            const worldQuat = new THREE.Quaternion();
            movingBond.getWorldQuaternion(worldQuat);

            scene.attach(movingBond);

            // Set it to exactly where it was in world space
            movingBond.position.copy(worldPos);
            movingBond.quaternion.copy(worldQuat);

            // Animate to new side
            const angle = emptySides[i];
            const targetX = Math.cos(angle) * apothem;
            const targetY = Math.sin(angle) * apothem;

            gsap.to(movingBond.position, {
                x: targetX,
                y: targetY,
                z: 0,
                duration: 0.6,
                ease: "power2.inOut"
            });

            // The bond needs to be parallel to the side.
            // Side angle + PI/2 because the cylinder is drawn along Y, but we rotate it PI/2 along Z.
            gsap.to(movingBond.rotation, {
                x: 0,
                y: 0,
                z: angle,
                duration: 0.6,
                ease: "power2.inOut"
            });
        }, 1.5);
    });

    // Angle C-H bonds outwards so it looks like a proper hexagon
    // In benzene, C-H bonds point exactly outwards from the center.
    // Molecule 0 is at 90 deg. Its carbons are at 60 and 120.
    // Molecule 1 is at 210 deg. Carbons at 180 and 240.
    // Molecule 2 is at 330 deg. Carbons at 300 and 360.
    const chAngles = [
        [Math.PI/3, 2*Math.PI/3],
        [Math.PI, 4*Math.PI/3],
        [5*Math.PI/3, 2*Math.PI]
    ];

    molecules.forEach((mol, i) => {
        // chPivot1 is the left carbon (higher angle locally)
        // chPivot2 is the right carbon (lower angle locally)

        // We need the pivots to rotate such that the C-H bond points outward from origin.
        // Wait until they snap
        tl.add(() => {
            const pivot1 = mol.userData.chPivot1;
            const pivot2 = mol.userData.chPivot2;

            // In local space, the C-H bond currently points along -X for pivot1 and +X for pivot2.
            // We want it to bend outwards by 30 degrees (PI/6) to form the 120 deg angle of a hexagon.
            gsap.to(pivot1.rotation, {
                z: -Math.PI/3,
                duration: 0.6,
                ease: "power2.inOut"
            });

            gsap.to(pivot2.rotation, {
                z: Math.PI/3,
                duration: 0.6,
                ease: "power2.inOut"
            });

        }, 1.5);
    });

    // Phase 4: Kekulé Resonance
    const resonanceGroup = new THREE.Group();
    scene.add(resonanceGroup);

    tl.add(() => {
        molecules.forEach(mol => {
            const pi1 = mol.userData.ccBondPi1;

            const worldPos = new THREE.Vector3();
            pi1.getWorldPosition(worldPos);
            const worldQuat = new THREE.Quaternion();
            pi1.getWorldQuaternion(worldQuat);

            resonanceGroup.add(pi1);
            pi1.position.copy(worldPos);
            pi1.quaternion.copy(worldQuat);

            // Because they were originally offset locally, we need to ensure their position in the group
            // is exactly the apothem distance from center, but pulled inward slightly so it's a double bond.
            // Actually, keeping the world pos/quat is perfect. We just rotate the group.
        });

        // Rotate exactly 60 degrees (PI/3)
        gsap.to(resonanceGroup.rotation, {
            z: Math.PI / 3,
            duration: 0.2,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            repeatDelay: 0.2
        });

    }, 2.5);

    return tl;
}
