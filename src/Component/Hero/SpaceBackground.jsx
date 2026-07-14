import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

// Register THREE.Line so R3F recognises <line_> in JSX
extend({ Line_: THREE.Line });

// ─────────────────────────────────────────────────────────────
// Design-system star colors
// ─────────────────────────────────────────────────────────────
const STAR_COLORS = [
  new THREE.Color('#FFFFFF'), // white
  new THREE.Color('#C084FC'), // purple
  new THREE.Color('#60A5FA'), // blue
  new THREE.Color('#F472B6'), // pink
];

// ─────────────────────────────────────────────────────────────
// Utility — create a radial-gradient canvas texture for nebulae
// ─────────────────────────────────────────────────────────────
function createNebulaTexture(innerColor, outerColor, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.4, innerColor);
  gradient.addColorStop(1, outerColor);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─────────────────────────────────────────────────────────────
// 1. StarField — instanced point cloud with twinkling
// ─────────────────────────────────────────────────────────────
function StarField({ count, prefersReducedMotion, mousePosition }) {
  const pointsRef = useRef();

  // Pre-compute positions, colors, twinkle phases & speeds
  const { positions, colors, phases, speeds, baseOpacities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);
    const bo = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute inside a sphere of radius 50
      const r = 50 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Pick a random star color
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      // Twinkle parameters
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.3 + Math.random() * 1.2; // speed multiplier
      bo[i] = 0.4 + Math.random() * 0.6; // base opacity 0.4 – 1.0
    }

    return { positions: pos, colors: col, phases: ph, speeds: sp, baseOpacities: bo };
  }, [count]);

  // We store per-vertex opacity in a custom attribute "aOpacity"
  const opacities = useMemo(() => {
    const o = new Float32Array(count);
    for (let i = 0; i < count; i++) o[i] = baseOpacities[i];
    return o;
  }, [count, baseOpacities]);

  // Custom shader material for point stars with per-vertex opacity
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {},
      vertexShader: `
        attribute float aOpacity;
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          vOpacity = aOpacity;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = max(1.0, 2.5 * (50.0 / -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          // Soft circle mask
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.15, dist) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
    });
  }, []);

  // Animate twinkle + parallax every frame
  useFrame(({ clock }) => {
    if (document.hidden) return;
    const pts = pointsRef.current;
    if (!pts) return;

    // Twinkling — modulate the aOpacity attribute
    if (!prefersReducedMotion) {
      const elapsed = clock.getElapsedTime();
      const opAttr = pts.geometry.getAttribute('aOpacity');
      for (let i = 0; i < count; i++) {
        const wave = Math.sin(elapsed * speeds[i] + phases[i]);
        opAttr.array[i] = baseOpacities[i] * (0.7 + 0.3 * wave);
      }
      opAttr.needsUpdate = true;
    }

    // Parallax shift (~5 "px" ≈ 0.25 world units at the default camera distance)
    if (mousePosition) {
      pts.position.x = THREE.MathUtils.lerp(pts.position.x, mousePosition.x * 0.25, 0.02);
      pts.position.y = THREE.MathUtils.lerp(pts.position.y, mousePosition.y * 0.25, 0.02);
    }
  });

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          count={count}
          array={opacities}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. ShootingStar — a single bright trail that moves & fades
// ─────────────────────────────────────────────────────────────
function ShootingStar({ onComplete, id }) {
  const meshRef = useRef();
  const dataRef = useRef(null);

  // Randomise start / direction on mount
  useMemo(() => {
    const startX = (Math.random() - 0.5) * 60;
    const startY = 15 + Math.random() * 20;
    const startZ = -10 - Math.random() * 20;

    // Diagonal direction — mostly rightward and downward
    const dirX = 1.5 + Math.random();
    const dirY = -(1.0 + Math.random() * 0.5);
    const dirZ = -0.2 + Math.random() * 0.4;

    dataRef.current = {
      pos: new THREE.Vector3(startX, startY, startZ),
      dir: new THREE.Vector3(dirX, dirY, dirZ).normalize(),
      speed: 30 + Math.random() * 20,
      life: 0,
      maxLife: 0.8 + Math.random() * 0.6, // seconds
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const trailGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([0, 0, 0, -1.2, 0.3, 0]); // short line
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    return geo;
  }, []);

  const trailMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      linewidth: 1,
    });
  }, []);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const d = dataRef.current;
    const mesh = meshRef.current;
    if (!d || !mesh) return;

    d.life += delta;
    const progress = d.life / d.maxLife;

    if (progress >= 1) {
      onComplete(id);
      return;
    }

    // Move
    d.pos.addScaledVector(d.dir, d.speed * delta);
    mesh.position.copy(d.pos);

    // Orient along direction
    mesh.lookAt(d.pos.clone().add(d.dir));

    // Fade out in last 40 %
    const fade = progress > 0.6 ? 1 - (progress - 0.6) / 0.4 : 1;
    trailMat.opacity = fade;

    // Scale trail length based on speed
    const scale = 1 + d.speed * 0.05;
    mesh.scale.set(scale, scale, scale);
  });

  return <line_ ref={meshRef} geometry={trailGeo} material={trailMat} />;
}

// ─────────────────────────────────────────────────────────────
// ShootingStarManager — spawns shooting stars on a timer
// ─────────────────────────────────────────────────────────────
function ShootingStarManager({ prefersReducedMotion }) {
  const [stars, setStars] = useState([]);
  const nextSpawnRef = useRef(0);
  const idCounter = useRef(0);

  const removeShootingStar = useCallback((id) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
  }, []);

  useFrame(({ clock }) => {
    if (document.hidden || prefersReducedMotion) return;

    const now = clock.getElapsedTime();
    if (now >= nextSpawnRef.current && stars.length < 2) {
      const newId = idCounter.current++;
      setStars((prev) => [...prev, { id: newId }]);
      // Next spawn in 3–8 seconds
      nextSpawnRef.current = now + 3 + Math.random() * 5;
    }
  });

  return (
    <>
      {stars.map((s) => (
        <ShootingStar key={s.id} id={s.id} onComplete={removeShootingStar} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. NebulaCloud — a large semi-transparent sprite
// ─────────────────────────────────────────────────────────────
function NebulaCloud({ position, innerColor, outerColor, baseScale, phaseOffset, prefersReducedMotion }) {
  const spriteRef = useRef();

  const texture = useMemo(
    () => createNebulaTexture(innerColor, outerColor),
    [innerColor, outerColor]
  );

  const material = useMemo(() => {
    return new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [texture]);

  useFrame(({ clock }) => {
    if (document.hidden || prefersReducedMotion) return;
    const sprite = spriteRef.current;
    if (!sprite) return;

    const t = clock.getElapsedTime();

    // Slow drift
    sprite.position.x = position[0] + Math.sin(t * 0.03 + phaseOffset) * 0.8;
    sprite.position.y = position[1] + Math.cos(t * 0.02 + phaseOffset) * 0.5;

    // Pulse opacity
    const pulse = 0.08 + 0.06 * Math.sin(t * 0.15 + phaseOffset);
    sprite.material.opacity = pulse;

    // Subtle scale breathe
    const s = baseScale + Math.sin(t * 0.1 + phaseOffset) * 1.5;
    sprite.scale.set(s, s, 1);
  });

  return <sprite ref={spriteRef} material={material} position={position} scale={[baseScale, baseScale, 1]} />;
}

function NebulaClouds({ prefersReducedMotion }) {
  // Define 4 nebula configs: position, colors, scale, phase
  const nebulae = useMemo(() => [
    {
      position: [-18, 8, -40],
      innerColor: 'rgba(124, 58, 237, 0.3)',  // purple primary
      outerColor: 'rgba(124, 58, 237, 0)',
      baseScale: 25,
      phaseOffset: 0,
    },
    {
      position: [22, -5, -35],
      innerColor: 'rgba(217, 70, 239, 0.25)', // accent pink
      outerColor: 'rgba(217, 70, 239, 0)',
      baseScale: 20,
      phaseOffset: 2.1,
    },
    {
      position: [0, 15, -45],
      innerColor: 'rgba(168, 85, 247, 0.2)',  // purple secondary
      outerColor: 'rgba(168, 85, 247, 0)',
      baseScale: 30,
      phaseOffset: 4.2,
    },
    {
      position: [-25, -12, -38],
      innerColor: 'rgba(192, 132, 252, 0.2)', // star purple
      outerColor: 'rgba(192, 132, 252, 0)',
      baseScale: 18,
      phaseOffset: 1.4,
    },
  ], []);

  return (
    <>
      {nebulae.map((n, i) => (
        <NebulaCloud key={i} {...n} prefersReducedMotion={prefersReducedMotion} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. ParticleDust — tiny floating purple particles
// ─────────────────────────────────────────────────────────────
function ParticleDust({ count = 200, prefersReducedMotion }) {
  const pointsRef = useRef();

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;

      // Very slow random drift
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions: pos, velocities: vel };
  }, [count]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color('#A855F7'), // purple secondary
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
  }, []);

  useFrame(() => {
    if (document.hidden || prefersReducedMotion) return;
    const pts = pointsRef.current;
    if (!pts) return;

    const posAttr = pts.geometry.getAttribute('position');
    const arr = posAttr.array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap particles that drift too far
      if (Math.abs(arr[i * 3]) > 35) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 25) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2] + 5) > 25) velocities[i * 3 + 2] *= -1;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
}

// ─────────────────────────────────────────────────────────────
// SceneContents — assembles everything inside the Canvas
// ─────────────────────────────────────────────────────────────
function SceneContents({ prefersReducedMotion, isMobile, mousePosition }) {
  const starCount = isMobile ? 500 : 1500;
  const dustCount = isMobile ? 80 : 200;

  return (
    <>
      {/* Stars — always rendered */}
      <StarField
        count={starCount}
        prefersReducedMotion={prefersReducedMotion}
        mousePosition={mousePosition}
      />

      {/* Animated elements — skipped when reduced motion is on */}
      {!prefersReducedMotion && (
        <>
          <ShootingStarManager prefersReducedMotion={prefersReducedMotion} />
          <NebulaClouds prefersReducedMotion={prefersReducedMotion} />
          <ParticleDust count={dustCount} prefersReducedMotion={prefersReducedMotion} />
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// SpaceBackground — the exported Canvas wrapper
// ─────────────────────────────────────────────────────────────
function SpaceBackground({ prefersReducedMotion = false, isMobile = false, mousePosition = { x: 0, y: 0 } }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 200 }}
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      // Pause rendering when tab is hidden
      frameloop={prefersReducedMotion ? 'demand' : 'always'}
    >
      {/* Background color — matches design-system --bg-primary */}
      <color attach="background" args={['#070312']} />

      <SceneContents
        prefersReducedMotion={prefersReducedMotion}
        isMobile={isMobile}
        mousePosition={mousePosition}
      />
    </Canvas>
  );
}

export { SceneContents as SpaceSceneContents };
export default SpaceBackground;
