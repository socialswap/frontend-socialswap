import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────
// Design-system colours
// ─────────────────────────────────────────────────────────
const COLORS = {
  portalPurple:    0x7C3AED,
  portalEmissive:  0xA855F7,
  channelRed:      0xFF0000,
  trailPurple:     0xA855F7,
  flashWhite:      0xFFFFFF,
};

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────
const CYCLE        = 6;          // total loop duration in seconds
const MAX_TRAIL    = 30;         // max trail particles alive at once
const SELLER_X     = 2.5;       // start position x
const BUYER_X      = -2.5;      // end position x
const PORTAL_Y     = 0;
const PORTAL_Z     = -1;

// ─────────────────────────────────────────────────────────
// Helpers – interpolation along the transfer path
// ─────────────────────────────────────────────────────────

/** Map a normalised `t` (0→1) to x position along seller → portal → buyer */
function pathX(t) {
  // ease-in-out cubic for smoother feel
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return SELLER_X + (BUYER_X - SELLER_X) * ease;
}

// ─────────────────────────────────────────────────────────
// Trail particle pool (object pool, no allocations per frame)
// ─────────────────────────────────────────────────────────
function useTrailPool() {
  // Each particle: { x, y, z, life, maxLife, active }
  const pool = useMemo(() => {
    const arr = [];
    for (let i = 0; i < MAX_TRAIL; i++) {
      arr.push({ x: 0, y: 0, z: 0, life: 0, maxLife: 0.6, active: false });
    }
    return arr;
  }, []);

  const spawn = (x, y, z) => {
    for (let i = 0; i < pool.length; i++) {
      if (!pool[i].active) {
        pool[i].x = x + (Math.random() - 0.5) * 0.2;
        pool[i].y = y + (Math.random() - 0.5) * 0.2;
        pool[i].z = z + (Math.random() - 0.5) * 0.1;
        pool[i].life = pool[i].maxLife;
        pool[i].active = true;
        return;
      }
    }
  };

  const tick = (delta) => {
    for (let i = 0; i < pool.length; i++) {
      if (pool[i].active) {
        pool[i].life -= delta;
        if (pool[i].life <= 0) pool[i].active = false;
      }
    }
  };

  return { pool, spawn, tick };
}

// ─────────────────────────────────────────────────────────
// TrailParticles – renders the pool as instanced points
// ─────────────────────────────────────────────────────────
function TrailParticles({ pool }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const geo     = useMemo(() => new THREE.SphereGeometry(0.04, 6, 6), []);
  const mat     = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.trailPurple,
        emissive: COLORS.trailPurple,
        emissiveIntensity: 1.2,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame(() => {
    if (!meshRef.current) return;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (p.active) {
        const alpha = Math.max(p.life / p.maxLife, 0);
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(alpha * 0.8 + 0.2);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx, dummy.matrix);
        idx++;
      }
    }
    // hide remaining instances
    for (let i = idx; i < MAX_TRAIL; i++) {
      dummy.position.set(0, -999, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, MAX_TRAIL]} frustumCulled={false} />
  );
}

// ─────────────────────────────────────────────────────────
// TransferSphere – the travelling "channel icon"
// ─────────────────────────────────────────────────────────
function TransferSphere({ phase, cycleT }) {
  const ref = useRef();

  const geo = useMemo(() => new THREE.SphereGeometry(0.15, 16, 12), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.channelRed,
        emissive: COLORS.channelRed,
        emissiveIntensity: 0.5,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
      }),
    []
  );

  useFrame(() => {
    if (!ref.current) return;
    const m = ref.current;

    if (phase === 'idle') {
      // Hidden during cooldown
      m.visible = false;
      return;
    }

    m.visible = true;

    // Normalised progress along the path based on phase
    let pathT = 0;
    let scaleVal = 1;
    let emissiveI = 0.5;

    if (phase === 'sellerToPortal') {
      // cycleT 0→1  maps seconds 0–1 → seller side to portal
      pathT = cycleT * 0.5; // 0 → 0.5 of full path (seller → centre)
      scaleVal = 1 + 0.15 * cycleT;
      m.rotation.y += 0.04;
    } else if (phase === 'throughPortal') {
      // cycleT 0→1  maps seconds 1–2.5
      pathT = 0.5; // stays near centre
      scaleVal = 1.15 + 0.1 * Math.sin(cycleT * Math.PI);
      emissiveI = 0.8;
      m.rotation.y += 0.06;
    } else if (phase === 'portalToBuyer') {
      // cycleT 0→1  maps seconds 2.5–4
      pathT = 0.5 + cycleT * 0.5; // 0.5 → 1 of full path
      scaleVal = 1.25 - 0.25 * cycleT;
      emissiveI = 1.0 + 0.5 * (1 - cycleT);
    } else if (phase === 'flash') {
      pathT = 1;
      scaleVal = 1 - cycleT;
      emissiveI = 1.5 * (1 - cycleT);
    }

    const xPos = pathX(pathT);
    m.position.set(xPos, PORTAL_Y, PORTAL_Z + 0.3);
    m.scale.setScalar(Math.max(scaleVal, 0.01));
    mat.emissiveIntensity = emissiveI;
    mat.opacity = phase === 'flash' ? Math.max(1 - cycleT, 0) : 1;
  });

  return <mesh ref={ref} geometry={geo} material={mat} />;
}

// ─────────────────────────────────────────────────────────
// Main Portal component
// ─────────────────────────────────────────────────────────
export default function Portal({
  prefersReducedMotion = false,
  isMobile = false,
}) {
  // ── Refs ───────────────────────────────────────────
  const outerTorusRef = useRef();
  const innerTorusRef = useRef();
  const portalLightRef = useRef();
  const flashLightRef  = useRef();

  // ── Phase state for the transfer animation ─────────
  const phaseRef  = useRef('idle');
  const cycleRef  = useRef(0);    // normalised 0→1 within current phase

  // ── Trail particle pool ────────────────────────────
  const { pool, spawn, tick } = useTrailPool();

  // ── Memoised geometries ────────────────────────────
  const outerTorusGeo = useMemo(() => new THREE.TorusGeometry(0.8, 0.08, 24, 64), []);
  const innerTorusGeo = useMemo(() => new THREE.TorusGeometry(0.55, 0.05, 20, 48), []);

  const torusMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.portalPurple,
        emissive: COLORS.portalEmissive,
        emissiveIntensity: 1.0,
        roughness: 0.3,
        metalness: 0.4,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      }),
    []
  );

  const innerTorusMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.portalPurple,
        emissive: COLORS.portalEmissive,
        emissiveIntensity: 0.8,
        roughness: 0.35,
        metalness: 0.35,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      }),
    []
  );

  // ── Main animation loop ────────────────────────────
  useFrame((_, delta) => {
    const t = performance.now() / 1000;

    // ── Portal ring rotation & emissive pulse ──────
    if (outerTorusRef.current) {
      if (!prefersReducedMotion) {
        outerTorusRef.current.rotation.z += delta * 0.35;
      }
      // Emissive oscillation 0.5 – 1.5
      torusMat.emissiveIntensity = 1.0 + 0.5 * Math.sin(t * 1.8);
    }

    if (innerTorusRef.current && !prefersReducedMotion) {
      innerTorusRef.current.rotation.z -= delta * 0.55; // opposite direction
    }

    // ── Portal point light oscillation ─────────────
    if (portalLightRef.current) {
      portalLightRef.current.intensity = 1.5 + 0.8 * Math.sin(t * 2.2);
    }

    // ── Reduced motion: skip transfer animation ────
    if (prefersReducedMotion) return;

    // ── Transfer cycle phase machine ───────────────
    const cycleTime = t % CYCLE; // 0 → 6

    let phase = 'idle';
    let cycleNorm = 0;

    if (cycleTime < 1) {
      // 0–1 s: seller → portal
      phase = 'sellerToPortal';
      cycleNorm = cycleTime / 1;
    } else if (cycleTime < 2.5) {
      // 1–2.5 s: through portal
      phase = 'throughPortal';
      cycleNorm = (cycleTime - 1) / 1.5;
    } else if (cycleTime < 4) {
      // 2.5–4 s: portal → buyer
      phase = 'portalToBuyer';
      cycleNorm = (cycleTime - 2.5) / 1.5;
    } else if (cycleTime < 4.5) {
      // 4–4.5 s: flash
      phase = 'flash';
      cycleNorm = (cycleTime - 4) / 0.5;
    } else {
      // 4.5–6 s: cooldown / idle
      phase = 'idle';
      cycleNorm = (cycleTime - 4.5) / 1.5;
    }

    phaseRef.current = phase;
    cycleRef.current = cycleNorm;

    // ── Flash light ────────────────────────────────
    if (flashLightRef.current) {
      flashLightRef.current.intensity =
        phase === 'flash' ? 4 * (1 - cycleNorm) : 0;
    }

    // ── Spawn trail particles while sphere is moving ─
    if (phase === 'sellerToPortal' || phase === 'throughPortal' || phase === 'portalToBuyer') {
      const pathT =
        phase === 'sellerToPortal'
          ? cycleNorm * 0.5
          : phase === 'throughPortal'
            ? 0.5
            : 0.5 + cycleNorm * 0.5;

      spawn(pathX(pathT), PORTAL_Y, PORTAL_Z + 0.3);
    }

    tick(delta);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── Outer torus ring ─────────────────────────── */}
      <mesh
        ref={outerTorusRef}
        geometry={outerTorusGeo}
        material={torusMat}
        position={[0, PORTAL_Y, PORTAL_Z]}
      />

      {/* ── Inner torus ring (counter-rotating) ──────── */}
      <mesh
        ref={innerTorusRef}
        geometry={innerTorusGeo}
        material={innerTorusMat}
        position={[0, PORTAL_Y, PORTAL_Z]}
      />

      {/* ── Purple portal glow light ─────────────────── */}
      <pointLight
        ref={portalLightRef}
        color={COLORS.portalEmissive}
        intensity={1.5}
        distance={8}
        decay={2}
        position={[0, PORTAL_Y, PORTAL_Z + 0.5]}
      />

      {/* ── Flash light (at buyer end) ───────────────── */}
      <pointLight
        ref={flashLightRef}
        color={COLORS.flashWhite}
        intensity={0}
        distance={4}
        decay={2}
        position={[BUYER_X, PORTAL_Y, PORTAL_Z + 0.5]}
      />

      {/* ── Transfer sphere (the "channel icon") ─────── */}
      <TransferSphere phase={phaseRef.current} cycleT={cycleRef.current} />

      {/* ── Trail particles ──────────────────────────── */}
      <TrailParticles pool={pool} />
    </group>
  );
}
