import gsap from 'gsap';

export function animateFormation(molecules, resonanceRing, scene, THREE) {
    const tl = gsap.timeline();

    // Phase 1: Heat up (Jittering)
    molecules.forEach((mol, index) => {
        tl.to(mol.group.position, {
            x: `+=${(Math.random() - 0.5) * 1}`,
            y: `+=${(Math.random() - 0.5) * 1}`,
            z: `+=${(Math.random() - 0.5) * 1}`,
            duration: 0.1,
            repeat: 20,
            yoyo: true,
            ease: "none"
        }, 0);
    });

    // Phase 2: Approach (Converging to form hexagon)
    const finalRadius = 2.5; // Benzene C-C radius from center
    molecules.forEach((mol, index) => {
        // Calculate new positions so carbons form a regular hexagon
        const targetX = Math.cos(mol.angle) * finalRadius;
        const targetY = Math.sin(mol.angle) * finalRadius;

        tl.to(mol.group.position, {
            x: targetX,
            y: targetY,
            z: 0,
            duration: 2,
            ease: "power2.inOut"
        }, 2); // Start at 2 seconds
    });

    // Phase 3: Reaction (Morphing/Snapping bonds)
    molecules.forEach((mol, index) => {
        const nextMol = molecules[(index + 1) % 3];

        // We will detach ccBondPi2 from current molecule and snap it to connect
        // current molecule's c2 with next molecule's c1
        const movingBond = mol.group.userData.ccBondPi2;

        // Detach bond from group and add to scene to animate independently in world space
        scene.attach(movingBond);

        // Calculate world positions for the snap
        const currentC2World = new THREE.Vector3();
        mol.group.userData.c2.getWorldPosition(currentC2World);

        const nextC1World = new THREE.Vector3();
        nextMol.group.userData.c1.getWorldPosition(nextC1World);

        // Midpoint
        const midPoint = new THREE.Vector3().addVectors(currentC2World, nextC1World).multiplyScalar(0.5);

        // Animate the detached bond moving to the midpoint and rotating to connect
        tl.to(movingBond.position, {
            x: midPoint.x,
            y: midPoint.y,
            z: midPoint.z,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        }, 4); // Start at 4 seconds

        // Calculate the angle to connect the two carbons
        const direction = new THREE.Vector3().subVectors(nextC1World, currentC2World).normalize();

        // The cylinder is created along Y axis by default.
        // We aim its local Y axis along the direction vector.
        tl.to(movingBond.rotation, {
            x: 0,
            y: 0,
            z: Math.atan2(direction.y, direction.x) - Math.PI/2,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        }, 4);
    });

    // Phase 4: Resonance Delocalization (Glowing Torus)
    // Fade out specific pi bonds
    molecules.forEach((mol) => {
        tl.to([
            mol.group.userData.ccBondPi1.material,
            mol.group.userData.ccBondPi2.material // The one we moved
        ], {
            opacity: 0,
            transparent: true,
            duration: 1.5
        }, 6);
    });

    // Fade in glowing resonance ring
    tl.to(resonanceRing.material, {
        opacity: 0.8,
        emissiveIntensity: 1,
        duration: 2,
        ease: "power2.inOut"
    }, 6);

    // Scale up the ring slightly to encompass the hexagon
    tl.fromTo(resonanceRing.scale,
        {x: 0.8, y: 0.8, z: 0.8},
        {x: 1.0, y: 1.0, z: 1.0, duration: 2, ease: "back.out(1.7)"},
        6
    );

    return tl;
}
