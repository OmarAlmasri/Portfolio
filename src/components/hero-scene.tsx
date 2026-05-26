"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type HeroSceneProps = {
  compact?: boolean;
};

export function HeroScene({ compact = false }: HeroSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const density = compact ? 16 : 24;
    const spacing = compact ? 0.95 : 0.85;
    const pointCount = density * density;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const clock = new THREE.Clock();
    const pointer = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const frameState = {
      current: 0
    };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    camera.position.set(0, compact ? 1.6 : 2.2, compact ? 14 : 16);

    const rootGroup = new THREE.Group();
    const pointsGeometry = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(pointCount * 3);
    const basePositions = new Float32Array(pointCount * 3);
    const linePositions = new Float32Array((density - 1) * density * 12);

    let index = 0;

    for (let x = 0; x < density; x += 1) {
      for (let z = 0; z < density; z += 1) {
        const px = (x - density / 2) * spacing;
        const pz = (z - density / 2) * spacing;
        const py = Math.sin(x * 0.35) * 0.3 + Math.cos(z * 0.25) * 0.2;

        basePositions[index] = px;
        basePositions[index + 1] = py;
        basePositions[index + 2] = pz;
        pointPositions[index] = px;
        pointPositions[index + 1] = py;
        pointPositions[index + 2] = pz;
        index += 3;
      }
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#9eff00"),
      size: compact ? 0.08 : 0.09,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    rootGroup.add(points);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#3cffb2"),
      transparent: true,
      opacity: compact ? 0.16 : 0.2
    });

    const gridLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    rootGroup.add(gridLines);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(compact ? 1.3 : 1.8, 1),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#d7ff92"),
        wireframe: true,
        transparent: true,
        opacity: 0.85
      })
    );
    core.position.y = compact ? 1.25 : 1.55;
    rootGroup.add(core);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(compact ? 2.2 : 3.1, 0.02, 16, 120),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#9eff00"),
        transparent: true,
        opacity: 0.3
      })
    );
    ring.rotation.x = Math.PI / 2.35;
    rootGroup.add(ring);

    scene.add(rootGroup);

    const updateLines = () => {
      let cursor = 0;

      for (let x = 0; x < density; x += 1) {
        for (let z = 0; z < density; z += 1) {
          const current = (x * density + z) * 3;

          if (z < density - 1) {
            const right = current + 3;
            linePositions[cursor] = pointPositions[current];
            linePositions[cursor + 1] = pointPositions[current + 1];
            linePositions[cursor + 2] = pointPositions[current + 2];
            linePositions[cursor + 3] = pointPositions[right];
            linePositions[cursor + 4] = pointPositions[right + 1];
            linePositions[cursor + 5] = pointPositions[right + 2];
            cursor += 6;
          }

          if (x < density - 1) {
            const down = current + density * 3;
            linePositions[cursor] = pointPositions[current];
            linePositions[cursor + 1] = pointPositions[current + 1];
            linePositions[cursor + 2] = pointPositions[current + 2];
            linePositions[cursor + 3] = pointPositions[down];
            linePositions[cursor + 4] = pointPositions[down + 1];
            linePositions[cursor + 5] = pointPositions[down + 2];
            cursor += 6;
          }
        }
      }

      lineGeometry.attributes.position.needsUpdate = true;
    };

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

      pointer.x = relativeX;
      pointer.y = relativeY;
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      for (let x = 0; x < density; x += 1) {
        for (let z = 0; z < density; z += 1) {
          const offset = (x * density + z) * 3;
          const baseX = basePositions[offset];
          const baseY = basePositions[offset + 1];
          const baseZ = basePositions[offset + 2];

          pointPositions[offset] = baseX;
          pointPositions[offset + 1] =
            baseY +
            Math.sin(baseX * 0.55 + elapsed * 1.8) * 0.32 +
            Math.cos(baseZ * 0.4 + elapsed * 1.2) * 0.24;
          pointPositions[offset + 2] = baseZ + Math.sin(elapsed + baseX * 0.2) * 0.08;
        }
      }

      pointsGeometry.attributes.position.needsUpdate = true;
      updateLines();

      targetRotation.x = pointer.y * 0.18;
      targetRotation.y = pointer.x * 0.45;
      rootGroup.rotation.x += (targetRotation.x - rootGroup.rotation.x) * 0.04;
      rootGroup.rotation.y += (targetRotation.y - rootGroup.rotation.y) * 0.04;
      core.rotation.x += 0.003;
      core.rotation.y += 0.005;
      ring.rotation.z += 0.0025;

      renderer.render(scene, camera);
      frameState.current = window.requestAnimationFrame(animate);
    };

    resize();
    updateLines();
    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    mount.addEventListener("pointermove", handlePointerMove);

    return () => {
      observer.disconnect();
      mount.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(frameState.current);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [compact]);

  return <div className={`hero-scene${compact ? " hero-scene-compact" : ""}`} ref={mountRef} />;
}
