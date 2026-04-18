import gsap from 'gsap';

export function animateFormation(molecules, scene, THREE) {
    const tl = gsap.timeline();

    // Phase 1: Heat up (Jittering)
    molecules.forEach((mol) => {
        tl.to(mol.group.position, {
            x: `+=${(Math.random() - 0.5) * 1.5}`,
            y: `+=${(Math.random() - 0.5) * 1.5}`,
            duration: 0.1,
            repeat: 20,
            yoyo: true,
            ease: "none"
        }, 0);

        tl.to(mol.group.rotation, {
            x: `+=${Math.PI}`,
            duration: 2,
            ease: "power1.inOut"
        }, 0);
    });

    // Phase 2: Approach
    // Benzene C-C bond length is ~1.4, so regular hexagon radius is ~1.4
    // We need to position the molecules so their carbons align on a hexagon.
    // Molecule length is 1.6 (between carbons).
    // Hexagon side length = 1.6 => Radius = 1.6.
    const hexRadius = 1.6;

    // Calculate precise target positions and rotations for the 3 acetylene molecules
    // to form 3 alternating sides of a hexagon.
    // Hexagon vertices at angles: 30, 90, 150, 210, 270, 330

    // Side 1 (Top right): angle 60
    // Side 2 (Bottom): angle 180
    // Side 3 (Top left): angle 300
    const finalAngles = [Math.PI/3, Math.PI, 5*Math.PI/3];

    molecules.forEach((mol, index) => {
        // Apothem distance (center to middle of hexagon side)
        const apothem = hexRadius * Math.sqrt(3) / 2;

        const targetX = Math.cos(finalAngles[index]) * apothem;
        const targetY = Math.sin(finalAngles[index]) * apothem;

        tl.to(mol.group.position, {
            x: targetX,
            y: targetY,
            z: 0,
            duration: 2,
            ease: "back.inOut(1.2)"
        }, 2);

        // Orient parallel to the side
        tl.to(mol.group.rotation, {
            x: 0,
            y: 0,
            z: finalAngles[index] + Math.PI / 2,
            duration: 2,
            ease: "back.inOut(1.2)"
        }, 2);
    });

    // Phase 3: Reaction (Morphing/Snapping bonds)
    // We will take ONE pi bond from each triple bond and snap it to connect the corners.
    const shiftingBonds = [];

    molecules.forEach((mol, index) => {
        const nextMol = molecules[(index + 1) % 3];

        const movingBond = mol.group.userData.ccBondPi2;
        shiftingBonds.push(movingBond);

        // Detach bond from group and add to scene
        scene.attach(movingBond);

        // Get world positions of the carbons we need to connect
        // current c2 to next c1
        // Need to wait until Phase 2 is mostly done to calculate this,
        // so we calculate dynamically or rely on exact geometry.
    });

    // We can pre-calculate the snap positions based on the ideal hexagon
    // The moving bond needs to form the other 3 sides of the hexagon.
    // Side angles: 0, 120, 240 (or 0, 2PI/3, 4PI/3)
    const newBondAngles = [0, 2*Math.PI/3, 4*Math.PI/3];

    shiftingBonds.forEach((bond, index) => {
        const apothem = hexRadius * Math.sqrt(3) / 2;
        const targetX = Math.cos(newBondAngles[index]) * apothem;
        const targetY = Math.sin(newBondAngles[index]) * apothem;

        tl.to(bond.position, {
            x: targetX,
            y: targetY,
            z: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        }, 4);

        tl.to(bond.rotation, {
            x: 0,
            y: 0,
            z: newBondAngles[index] + Math.PI / 2,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        }, 4);
    });

    // Phase 4: Resonance
    // Benzene has delocalized pi electrons. Kekulé structures alternate.
    // We represent this by continuously shifting the 3 pi bonds back and forth
    // between the two adjacent positions.
    // Currently, we have 3 static double bonds (main + pi1) and 3 static single bonds (the ones we moved).
    // Wait, we moved ccBondPi2. So now the original sides have (main + pi1).
    // The new sides have ONLY ccBondPi2.
    // To show resonance, we need to move the 'pi1' bonds from the original sides to the new sides.

    const originalPiBonds = molecules.map(m => m.group.userData.ccBondPi1);

    originalPiBonds.forEach((piBond, index) => {
        scene.attach(piBond);

        // Target is next to the movingBond of the SAME index (or next index depending on rotation).
        // A simple way to visualize resonance is to rotate the entire set of pi bonds by 60 degrees
        // back and forth around the origin.
    });

    // Create a group for the resonance pi bonds to rotate them easily
    const resonanceGroup = new THREE.Group();
    scene.add(resonanceGroup);

    // Wait for snap to finish, then attach the 3 remaining pi bonds to this group
    tl.add(() => {
        originalPiBonds.forEach(bond => {
            resonanceGroup.attach(bond);
        });
    }, 6);

    // Animate the shifting of bonds (60 degrees = PI/3)
    tl.to(resonanceGroup.rotation, {
        z: Math.PI / 3,
        duration: 0.5,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.5
    }, 6.1);

    return tl;
}
