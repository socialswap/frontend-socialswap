import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────
// Cutout Shader definition to key out solid background color (#070312)
// ─────────────────────────────────────────────────────────
const CutoutShader = {
  uniforms: {
    map: { value: null },
    keyColor: { value: new THREE.Color('#070312') },
    threshold: { value: 0.12 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform vec3 keyColor;
    uniform float threshold;
    varying vec2 vUv;
    void main() {
      vec4 texColor = texture2D(map, vUv);
      
      // Calculate distance to background color key to discard it
      float dist = distance(texColor.rgb, keyColor);
      if (dist < threshold) {
        discard;
      }
      
      gl_FragColor = texColor;
    }
  `
};

/**
 * CharacterImage — Renders a high-quality textured plane of a character
 * with gentle floating, breathing, and idle animations.
 */
function CharacterImage({ texturePath, isBuyer, prefersReducedMotion }) {
  const meshRef = useRef();
  const texture = useTexture(texturePath);

  // Configure texture filters for crispness
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  // Custom ShaderMaterial to make the character's solid background transparent
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        keyColor: { value: new THREE.Color('#070312') },
        threshold: { value: 0.15 }, // key out color within 15% threshold
      },
      vertexShader: CutoutShader.vertexShader,
      fragmentShader: CutoutShader.fragmentShader,
      transparent: true,
      depthWrite: false, // prevent transparency depth clipping issues
      side: THREE.DoubleSide,
    });
  }, [texture]);

  // Gentle float, breathe, and rotate animations
  useFrame((state) => {
    if (prefersReducedMotion || !meshRef.current) return;

    const t = state.clock.getElapsedTime();
    
    // Slow bobbing up and down
    meshRef.current.position.y = Math.sin(t * 1.5 + (isBuyer ? 0 : Math.PI)) * 0.12;
    
    // Subtle breathing scale pulse
    const scalePulse = 1.0 + Math.sin(t * 2.0) * 0.015;
    meshRef.current.scale.set(scalePulse, scalePulse, 1.0);

    // Subtle idle rotation/sway (Z and Y axes)
    meshRef.current.rotation.z = Math.sin(t * 1.2) * 0.02;
    meshRef.current.rotation.y = (isBuyer ? 0.2 : -0.2) + Math.cos(t * 0.8) * 0.03;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2.8, 2.8]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/**
 * Characters component — positions buyer and seller in the scene.
 */
export default function Characters({
  prefersReducedMotion = false,
  isMobile = false,
}) {
  const xOffset = isMobile ? 2.0 : 2.5;
  const scale = isMobile ? 0.8 : 1.1;

  return (
    <group>
      {/* ── Buyer (left) ── */}
      <group position={[-xOffset, 0, -0.5]} scale={scale}>
        <CharacterImage
          texturePath="images/hero_buyer.png"
          isBuyer={true}
          prefersReducedMotion={prefersReducedMotion}
        />
        {/* Soft neon blue screen light from buyer's phone direction */}
        <pointLight
          color="#3B82F6"
          intensity={1.2}
          distance={3}
          position={[0.3, -0.3, 0.4]}
        />
      </group>

      {/* ── Seller (right) ── */}
      <group position={[xOffset, 0, -0.5]} scale={scale}>
        <CharacterImage
          texturePath="images/hero_seller.png"
          isBuyer={false}
          prefersReducedMotion={prefersReducedMotion}
        />
        {/* Soft neon pink screen light from seller's phone direction */}
        <pointLight
          color="#D946EF"
          intensity={1.2}
          distance={3}
          position={[-0.3, -0.3, 0.4]}
        />
      </group>
    </group>
  );
}
