import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SpaceSceneContents } from './SpaceBackground';
import Characters from './Characters';
import Portal from './Portal';
import FloatingIcons from './FloatingIcons';

/**
 * HeroScene — single unified Three.js Canvas that renders:
 *   1. Space background (stars, nebula, shooting stars, dust)
 *   2. Buyer & Seller characters
 *   3. Glowing transfer portal
 *   4. Floating social media icons
 *
 * All elements share one Canvas for optimal draw-call batching.
 */
const HeroScene = ({
  prefersReducedMotion = false,
  isMobile = false,
  mousePosition = { x: 0, y: 0 },
}) => {
  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ width: '100%', height: '100%' }}
        frameloop={prefersReducedMotion ? 'demand' : 'always'}
      >
        {/* Deep space background is always dark for portal visualization */}
        <color attach="background" args={['#070312']} />

        {/* Ambient + directional light for the 3D characters */}
        <ambientLight intensity={0.25} color="#A855F7" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.4}
          color="#C084FC"
        />

        <Suspense fallback={null}>
          {/* Layer 1 — Space background (stars, nebula, dust, shooting stars) */}
          <SpaceSceneContents
            prefersReducedMotion={prefersReducedMotion}
            isMobile={isMobile}
            mousePosition={mousePosition}
          />

          {/* Layer 2 & 3 — Characters and Portal grouped together and positioned to the right on desktop, down on mobile */}
          <group position={[isMobile ? 0 : 1.8, isMobile ? -1.2 : 0, 0]}>
            {/* Characters behind portal */}
            <Characters
              prefersReducedMotion={prefersReducedMotion}
              isMobile={isMobile}
            />

            {/* Glowing portal + channel transfer */}
            <Portal
              prefersReducedMotion={prefersReducedMotion}
              isMobile={isMobile}
            />
          </group>

          {/* Layer 4 — Floating social icons */}
          <FloatingIcons
            prefersReducedMotion={prefersReducedMotion}
            isMobile={isMobile}
            mousePosition={mousePosition}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
