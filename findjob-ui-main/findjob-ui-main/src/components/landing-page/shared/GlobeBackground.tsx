'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Simplified Continent Outlines (lon, lat pairs) ───
// Each sub-array is a closed or open polyline traced along coastlines.
// Coordinates are [longitude, latitude] in degrees.

const NORTH_AMERICA: [number, number][][] = [
  // Main outline
  [
    [-130, 55], [-125, 50], [-124, 42], [-117, 33], [-110, 30], [-105, 25],
    [-100, 20], [-97, 18], [-96, 16], [-92, 15], [-87, 15], [-83, 10],
    [-80, 8], [-77, 9], [-75, 11], [-80, 15], [-82, 20], [-81, 25],
    [-80, 27], [-82, 30], [-85, 30], [-89, 29], [-94, 29], [-97, 28],
    [-97, 32], [-95, 36], [-90, 35], [-85, 35], [-82, 33], [-80, 33],
    [-77, 35], [-76, 37], [-75, 39], [-74, 41], [-72, 42], [-70, 42],
    [-67, 45], [-66, 44], [-64, 47], [-60, 47], [-58, 50], [-56, 50],
    [-55, 52], [-59, 48], [-65, 44], [-67, 44], [-70, 43], [-72, 41],
    [-81, 42], [-83, 42], [-84, 46], [-85, 47], [-88, 48], [-89, 48],
    [-94, 49], [-100, 49], [-105, 49], [-110, 49], [-115, 49],
    [-120, 49], [-122, 49], [-124, 49], [-125, 50], [-130, 55],
  ],
  // Alaska simplified
  [
    [-170, 63], [-168, 66], [-165, 64], [-162, 64], [-160, 63],
    [-155, 60], [-150, 61], [-148, 60], [-140, 60], [-135, 57],
    [-132, 55], [-130, 55],
  ],
  // Greenland simplified
  [
    [-45, 60], [-50, 65], [-55, 68], [-52, 72], [-45, 75], [-35, 76],
    [-22, 75], [-18, 72], [-20, 68], [-25, 65], [-35, 62], [-45, 60],
  ],
];

const SOUTH_AMERICA: [number, number][][] = [
  [
    [-80, 8], [-77, 6], [-75, 5], [-73, 3], [-70, 2], [-68, -2],
    [-70, -5], [-72, -10], [-75, -15], [-70, -18], [-65, -20],
    [-60, -25], [-57, -30], [-55, -33], [-53, -34], [-50, -28],
    [-48, -25], [-45, -23], [-43, -22], [-41, -20], [-40, -15],
    [-38, -12], [-35, -8], [-35, -5], [-40, -3], [-48, -2],
    [-50, 0], [-52, 2], [-55, 5], [-60, 8], [-62, 10], [-65, 10],
    [-70, 12], [-73, 11], [-75, 10], [-77, 9], [-80, 8],
  ],
];

const EUROPE: [number, number][][] = [
  [
    [-10, 36], [-5, 36], [0, 38], [2, 42], [3, 43], [5, 44],
    [8, 44], [10, 45], [13, 45], [15, 46], [17, 48], [14, 48],
    [12, 50], [10, 54], [8, 54], [8, 56], [10, 58], [12, 56],
    [12, 58], [15, 58], [18, 60], [20, 62], [22, 60], [25, 60],
    [28, 60], [30, 60], [30, 62], [28, 64], [25, 66], [20, 66],
    [18, 68], [15, 70], [12, 68], [8, 63], [5, 62], [5, 60],
    [0, 58], [-3, 58], [-5, 56], [-5, 52], [-8, 52], [-10, 52],
    [-10, 50], [-8, 48], [-5, 48], [-2, 48], [-2, 46], [-5, 44],
    [-8, 43], [-9, 40], [-10, 36],
  ],
  // UK simplified
  [
    [-5, 50], [-4, 52], [-3, 54], [-5, 56], [-6, 58], [-5, 58],
    [-3, 56], [-1, 55], [0, 52], [-1, 51], [-3, 50], [-5, 50],
  ],
];

const AFRICA: [number, number][][] = [
  [
    [-15, 30], [-17, 20], [-17, 15], [-16, 12], [-14, 10],
    [-10, 7], [-8, 5], [-5, 5], [0, 5], [5, 4], [8, 4],
    [10, 3], [10, 0], [12, -3], [15, -5], [20, -10],
    [25, -15], [30, -20], [35, -25], [33, -30], [30, -32],
    [28, -33], [25, -34], [20, -34], [18, -32], [16, -28],
    [14, -24], [12, -18], [10, -12], [12, -5], [15, 0],
    [18, 5], [20, 8], [22, 10], [25, 12], [30, 12],
    [33, 10], [35, 12], [40, 12], [42, 14], [44, 12],
    [50, 12], [52, 12], [43, 10], [42, 8], [40, 2],
    [42, -2], [44, -5], [40, -10], [35, -7], [33, -3],
    [32, 0], [30, 5], [32, 8], [33, 10], [35, 12],
    [35, 15], [32, 20], [32, 25], [30, 28], [25, 30],
    [20, 32], [15, 35], [10, 37], [5, 37], [0, 35],
    [-5, 35], [-10, 32], [-15, 30],
  ],
];

const ASIA: [number, number][][] = [
  [
    [30, 35], [35, 37], [40, 40], [42, 42], [45, 40],
    [50, 38], [52, 36], [55, 25], [58, 22], [62, 25],
    [65, 25], [68, 23], [72, 20], [75, 15], [77, 10],
    [80, 8], [82, 10], [85, 15], [88, 22], [90, 22],
    [92, 20], [95, 16], [98, 10], [100, 5], [103, 2],
    [104, 1], [106, -5], [108, -7], [110, -8],
    [115, -8], [120, -5], [120, 0], [118, 5], [118, 10],
    [120, 15], [121, 18], [122, 20], [125, 25],
    [128, 35], [130, 38], [132, 40], [135, 35],
    [140, 38], [142, 43], [145, 45], [143, 47],
    [140, 50], [135, 52], [130, 50], [125, 45],
    [120, 42], [115, 40], [110, 42], [105, 45],
    [100, 50], [95, 50], [90, 48], [85, 48],
    [80, 50], [75, 52], [70, 55], [65, 55],
    [60, 58], [55, 55], [50, 52], [45, 48],
    [40, 45], [35, 42], [30, 40], [30, 35],
  ],
];

const AUSTRALIA: [number, number][][] = [
  [
    [115, -20], [118, -18], [122, -15], [125, -14],
    [130, -12], [133, -12], [135, -14], [137, -15],
    [140, -18], [143, -15], [145, -16], [148, -18],
    [150, -22], [152, -25], [153, -28], [150, -32],
    [148, -35], [145, -38], [140, -37], [138, -35],
    [136, -34], [134, -33], [130, -32], [128, -30],
    [125, -28], [120, -28], [115, -30], [114, -25],
    [113, -22], [115, -20],
  ],
];

const ALL_CONTINENTS = [
  ...NORTH_AMERICA,
  ...SOUTH_AMERICA,
  ...EUROPE,
  ...AFRICA,
  ...ASIA,
  ...AUSTRALIA,
];

export interface GlobeBackgroundProps {
  /** Primary wireframe color (CSS color string) */
  color?: string;
  /** Rotation speed (radians per frame) */
  rotationSpeed?: number;
  /** Enable mouse parallax */
  enableParallax?: boolean;
  /** Globe scale multiplier */
  scale?: number;
  /** Number of latitude lines */
  latLines?: number;
  /** Number of longitude lines */
  lonLines?: number;
  /** Enable dot grid on surface */
  enableDots?: boolean;
  /** Additional CSS classes */
  className?: string;
  children?: React.ReactNode;
}

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function GlobeBackground({
  color = '#b3d4f5',
  rotationSpeed = 0.001,
  enableParallax = true,
  scale = 3.2,
  latLines = 18,
  lonLines = 24,
  enableDots = true,
  className = '',
  children,
}: GlobeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // ── Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Group to hold all globe elements ──
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = scale;
    const lineColor = new THREE.Color(color);
    const faintColor = new THREE.Color(color).multiplyScalar(0.4);

    // ── 1. Grid Lines (Latitude) ──
    for (let i = 1; i < latLines; i++) {
      const lat = -90 + (180 / latLines) * i;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 128; j++) {
        const lon = -180 + (360 / 128) * j;
        points.push(latLonToVec3(lat, lon, radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: faintColor,
        transparent: true,
        opacity: 0.35,
      });
      globeGroup.add(new THREE.Line(geo, mat));
    }

    // ── 2. Grid Lines (Longitude) ──
    for (let i = 0; i < lonLines; i++) {
      const lon = -180 + (360 / lonLines) * i;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 128; j++) {
        const lat = -90 + (180 / 128) * j;
        points.push(latLonToVec3(lat, lon, radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: faintColor,
        transparent: true,
        opacity: 0.25,
      });
      globeGroup.add(new THREE.Line(geo, mat));
    }

    // ── 3. Outer Rim Circle (equator emphasis) ──
    const eqPoints: THREE.Vector3[] = [];
    for (let j = 0; j <= 256; j++) {
      const lon = -180 + (360 / 256) * j;
      eqPoints.push(latLonToVec3(0, lon, radius * 1.001));
    }
    const eqGeo = new THREE.BufferGeometry().setFromPoints(eqPoints);
    const eqMat = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.5,
    });
    globeGroup.add(new THREE.Line(eqGeo, eqMat));

    // ── 4. Outer Edge Ring ──
    const edgeGeo = new THREE.RingGeometry(radius - 0.01, radius + 0.02, 256);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    globeGroup.add(edge);

    // ── 5. Dot Grid on Surface ──
    if (enableDots) {
      const dotPositions: number[] = [];
      const dotStep = 4; // degrees between dots
      for (let lat = -85; lat <= 85; lat += dotStep) {
        // Adjust longitude step based on latitude to keep dots evenly spaced
        const lonStep = dotStep / Math.max(Math.cos((lat * Math.PI) / 180), 0.1);
        for (let lon = -180; lon < 180; lon += lonStep) {
          const v = latLonToVec3(lat, lon, radius * 1.002);
          dotPositions.push(v.x, v.y, v.z);
        }
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
      const dotMat = new THREE.PointsMaterial({
        color: lineColor,
        size: 0.018,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      });
      globeGroup.add(new THREE.Points(dotGeo, dotMat));
    }

    // ── 6. Continent Outlines ──
    ALL_CONTINENTS.forEach((coastline) => {
      if (coastline.length < 2) return;
      const points = coastline.map(([lon, lat]) => latLonToVec3(lat, lon, radius * 1.003));
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.85,
        linewidth: 1,
      });
      globeGroup.add(new THREE.Line(geo, mat));
    });

    // ── 7. Atmosphere / Soft Glow Ring ──
    const glowGeo = new THREE.RingGeometry(radius, radius + 0.2, 128);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 glowColor;
        void main() {
          float alpha = smoothstep(0.0, 1.0, 1.0 - vUv.y) * 0.2;
          gl_FragColor = vec4(glowColor, alpha);
        }
      `,
      uniforms: {
        glowColor: { value: lineColor },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glow);

    // ── Position Globe (centered) ──
    globeGroup.position.set(0, 0, 0);

    // ── 8. Animation ──
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      globeGroup.rotation.y += rotationSpeed;

      if (enableParallax) {
        mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.03;
        mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.03;
        globeGroup.rotation.x = 0.15 + mousePos.current.y * 0.08;
        globeGroup.rotation.z = mousePos.current.x * 0.05;
      } else {
        globeGroup.rotation.x = 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ──
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [color, rotationSpeed, enableParallax, scale, latLines, lonLines, enableDots]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mousePos.current.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-full overflow-hidden bg-transparent ${className}`}
    >
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
