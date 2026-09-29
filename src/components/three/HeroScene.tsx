"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Glitter() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 400;

  const { positions, sizes, colors, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const offsets = new Float32Array(count);

    const palette = [
      new THREE.Color("#FFB300"),
      new THREE.Color("#FFA000"),
      new THREE.Color("#FFC107"),
      new THREE.Color("#FFD54F"),
      new THREE.Color("#FF8F00"),
      new THREE.Color("#FFE082"),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      const r = Math.random();
      if (r < 0.7) sizes[i] = 0.10 + Math.random() * 0.10;
else if (r < 0.93) sizes[i] = 0.22 + Math.random() * 0.14;
else sizes[i] = 0.40 + Math.random() * 0.20;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, sizes, colors, offsets };
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: {
          value: typeof window !== "undefined" ? window.devicePixelRatio : 1,
        },
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aOffset;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = aColor;

          float twinkle = 0.5 + 0.5 * sin(uTime * 3.0 + aOffset * 6.28318);
          vOpacity = 0.4 + twinkle * 0.6;

          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + aOffset) * 0.15;
          pos.x += cos(uTime * 0.3 + aOffset) * 0.1;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          gl_PointSize = aSize * uPixelRatio * 300.0 * (0.7 + twinkle * 0.5);
          gl_PointSize *= (1.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);

          if (d > 0.5) discard;

          float core = 1.0 - smoothstep(0.0, 0.15, d);
          float halo = 1.0 - smoothstep(0.0, 0.5, d);
          float alpha = (core * 1.5 + halo * 0.4) * vOpacity;

          vec3 brightColor = mix(vColor, vec3(1.0, 0.98, 0.85), core * 0.7);

          gl_FragColor = vec4(brightColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: true,
    });
  }, []);

  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[offsets, 1]}
        />
      </bufferGeometry>
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={1} />
      <Glitter />
    </Canvas>
  );
}