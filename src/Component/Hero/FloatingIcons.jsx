import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ─── Platform Definitions ───────────────────────────────────────────────────
const PLATFORMS = [
  {
    name: 'YouTube',
    color: '#FF0000',
    emissive: '#FF0000',
    // Orbital params: angle offset, radius, speed, direction, bob freq, bob phase
    orbitAngle: 0,
    orbitRadius: 4.2,
    orbitSpeed: 0.08,
    direction: 1,        // 1 = counter-clockwise, -1 = clockwise
    bobFreq: 0.7,
    bobPhase: 0,
    zBase: -3.0,
  },
  {
    name: 'Instagram',
    color: '#E4405F',
    emissive: '#E4405F',
    orbitAngle: Math.PI * 0.285,
    orbitRadius: 5.0,
    orbitSpeed: 0.06,
    direction: -1,
    bobFreq: 0.9,
    bobPhase: 1.2,
    zBase: -4.0,
  },
  {
    name: 'TikTok',
    color: '#000000',
    emissive: '#69C9D0',
    orbitAngle: Math.PI * 0.571,
    orbitRadius: 3.8,
    orbitSpeed: 0.1,
    direction: 1,
    bobFreq: 0.6,
    bobPhase: 2.5,
    zBase: -2.5,
  },
  {
    name: 'Facebook',
    color: '#1877F2',
    emissive: '#1877F2',
    orbitAngle: Math.PI * 0.857,
    orbitRadius: 4.6,
    orbitSpeed: 0.07,
    direction: -1,
    bobFreq: 0.8,
    bobPhase: 0.8,
    zBase: -3.5,
  },
  {
    name: 'Telegram',
    color: '#26A5E4',
    emissive: '#26A5E4',
    orbitAngle: Math.PI * 1.142,
    orbitRadius: 4.0,
    orbitSpeed: 0.09,
    direction: 1,
    bobFreq: 1.0,
    bobPhase: 3.1,
    zBase: -4.5,
  },
  {
    name: 'Discord',
    color: '#5865F2',
    emissive: '#5865F2',
    orbitAngle: Math.PI * 1.428,
    orbitRadius: 5.2,
    orbitSpeed: 0.055,
    direction: -1,
    bobFreq: 0.75,
    bobPhase: 1.8,
    zBase: -2.8,
  },
  {
    name: 'X',
    color: '#FFFFFF',
    emissive: '#222222',
    orbitAngle: Math.PI * 1.714,
    orbitRadius: 3.6,
    orbitSpeed: 0.085,
    direction: 1,
    bobFreq: 0.65,
    bobPhase: 4.0,
    zBase: -3.2,
  },
];

// Y-axis rotation oscillation amplitude in radians (~15 degrees)
const Y_ROT_AMPLITUDE = THREE.MathUtils.degToRad(15);

// ─── Single Floating Icon ───────────────────────────────────────────────────
function FloatingIcon({ platform, index, prefersReducedMotion, mousePosition }) {
  const groupRef = useRef();

  // Memoize the material so it isn't recreated every render
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(platform.color),
        emissive: new THREE.Color(platform.emissive),
        emissiveIntensity: 0.6,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      }),
    [platform.color, platform.emissive]
  );

  // Track elapsed time internally so we can freeze when reduced-motion is on
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Clamp delta to avoid huge jumps when tab re-focuses
    const dt = Math.min(delta, 0.1);

    if (prefersReducedMotion) {
      // Static position — place at initial orbit position, no animation
      const x = Math.cos(platform.orbitAngle) * platform.orbitRadius;
      const y = Math.sin(platform.orbitAngle) * 0.6; // slight vertical spread
      groupRef.current.position.set(x, y, platform.zBase);
      groupRef.current.rotation.set(0, 0, 0);
      return;
    }

    elapsed.current += dt;
    const t = elapsed.current;

    // ── Orbital motion ────────────────────────────────────────────────
    const angle =
      platform.orbitAngle + t * platform.orbitSpeed * platform.direction;
    const x = Math.cos(angle) * platform.orbitRadius;
    const baseY = Math.sin(angle) * 0.6; // elliptical vertical component

    // ── Bobbing (sine wave) ───────────────────────────────────────────
    const bob = Math.sin(t * platform.bobFreq + platform.bobPhase) * 0.3;

    // ── Z oscillation ─────────────────────────────────────────────────
    const zOscillation =
      Math.sin(t * 0.4 + platform.bobPhase * 1.3) * 0.5;

    // ── Y-axis rotation oscillation (±15°) ────────────────────────────
    const yRot =
      Math.sin(t * 0.5 + index * 1.1) * Y_ROT_AMPLITUDE;

    // ── Mouse parallax (shift opposite to mouse, max ±0.3) ───────────
    const parallaxX = mousePosition ? -mousePosition.x * 0.3 : 0;
    const parallaxY = mousePosition ? -mousePosition.y * 0.3 : 0;

    groupRef.current.position.set(
      x + parallaxX,
      baseY + bob + parallaxY,
      platform.zBase + zOscillation
    );
    groupRef.current.rotation.set(0, yRot, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Icon "card" — rounded rectangle */}
      <RoundedBox
        args={[0.7, 0.7, 0.08]}   // width, height, depth
        radius={0.1}                // corner radius
        smoothness={4}              // subdivisions per corner
        material={material}
      />

      {/* Platform name label below the icon card */}
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.15}
        color="#FFFFFF"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.008}
        outlineColor="#000000"
        font={undefined} // uses drei default (Roboto/Inter)
      >
        {platform.name}
      </Text>
    </group>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
function FloatingIcons({
  prefersReducedMotion = false,
  isMobile = false,
  mousePosition = { x: 0, y: 0 },
}) {
  // On mobile show only 4 icons (the most recognisable platforms)
  const visiblePlatforms = useMemo(() => {
    if (isMobile) {
      // Pick YouTube, Instagram, TikTok, Telegram — varied colours & well-known
      const mobileNames = ['YouTube', 'Instagram', 'TikTok', 'Telegram'];
      return PLATFORMS.filter((p) => mobileNames.includes(p.name)).map(
        (p) => ({
          ...p,
          // Bring closer on mobile so they're visible in a smaller viewport
          orbitRadius: p.orbitRadius * 0.75,
          zBase: p.zBase * 0.7,
        })
      );
    }
    return PLATFORMS;
  }, [isMobile]);

  return (
    <group>
      {visiblePlatforms.map((platform, i) => (
        <FloatingIcon
          key={platform.name}
          platform={platform}
          index={i}
          prefersReducedMotion={prefersReducedMotion}
          mousePosition={mousePosition}
        />
      ))}
    </group>
  );
}

export default FloatingIcons;
