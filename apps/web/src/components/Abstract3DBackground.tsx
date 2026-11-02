"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Abstract3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number | null = null;
    let planeGeometry: THREE.PlaneGeometry | null = null;
    let planeMaterial: THREE.MeshStandardMaterial | null = null;
    let knotGeometry: THREE.TorusKnotGeometry | null = null;
    let knotMaterial: THREE.MeshStandardMaterial | null = null;
    let icoGeometry: THREE.IcosahedronGeometry | null = null;
    let icoMaterial: THREE.MeshStandardMaterial | null = null;
    let particlesGeometry: THREE.BufferGeometry | null = null;
    let particlesMaterial: THREE.PointsMaterial | null = null;
    let timer: THREE.Timer | null = null;

    let handlePointerMove: ((e: PointerEvent) => void) | null = null;
    let handleScroll: (() => void) | null = null;
    let handleResize: (() => void) | null = null;

    try {
      const scene = new THREE.Scene();
      // Fondo base cálido perlado #F7F4F0
      scene.background = new THREE.Color(0xf7f4f0);
      scene.fog = new THREE.FogExp2(0xf7f4f0, 0.045);

      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 11);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      container.appendChild(renderer.domElement);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // 1. Malla Ondulante Paramétrica (Lattice Wave en Oro #CBA135)
      const planeWidth = 26;
      const planeHeight = 26;
      const widthSegments = 50;
      const heightSegments = 50;
      planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight,
        widthSegments,
        heightSegments
      );
      planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xcba135,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        roughness: 0.3,
        metalness: 0.8,
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.rotation.x = -Math.PI / 2.5;
      planeMesh.position.set(0, -3.2, 0);
      rootGroup.add(planeMesh);

      // Guardar posiciones originales para deformación por ondas
      const positionAttribute = planeGeometry.attributes.position;
      const originalZ = new Float32Array(positionAttribute.count);
      for (let i = 0; i < positionAttribute.count; i++) {
        originalZ[i] = positionAttribute.getZ(i);
      }

      // 2. Escultura cinética central: Torus Knot en Oro Champagne
      knotGeometry = new THREE.TorusKnotGeometry(2.1, 0.5, 128, 20, 2, 3);
      knotMaterial = new THREE.MeshStandardMaterial({
        color: 0xcba135,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
        roughness: 0.2,
        metalness: 0.9,
      });
      const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
      knotMesh.position.set(3.5, 0.5, 1);
      rootGroup.add(knotMesh);

      // 3. Icosaedro interno flotante en Rojo Vino #5E0B15
      icoGeometry = new THREE.IcosahedronGeometry(2.6, 1);
      icoMaterial = new THREE.MeshStandardMaterial({
        color: 0x5e0b15,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
        roughness: 0.4,
        metalness: 0.5,
      });
      const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
      icoMesh.position.set(-3.5, -1, 0);
      rootGroup.add(icoMesh);

      // 4. Constelación de partículas de datos (Data Nodes)
      const particleCount = 120;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 22;
        particlePositions[i + 1] = (Math.random() - 0.5) * 16;
        particlePositions[i + 2] = (Math.random() - 0.5) * 12;
      }
      particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3)
      );
      particlesMaterial = new THREE.PointsMaterial({
        color: 0x5e0b15,
        size: 0.07,
        transparent: true,
        opacity: 0.65,
      });
      const particlesMesh = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );
      rootGroup.add(particlesMesh);

      // 5. Iluminación escénica reactiva
      const ambientLight = new THREE.AmbientLight(0xf7f4f0, 1.8);
      scene.add(ambientLight);

      // Luz direccional suave superior
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 12, 8);
      scene.add(dirLight);

      // Luz puntual que sigue al cursor en Rojo Vino #5E0B15
      const mouseVinoLight = new THREE.PointLight(0x5e0b15, 6, 25);
      mouseVinoLight.position.set(0, 0, 4);
      scene.add(mouseVinoLight);

      // Luz puntual en Oro #CBA135
      const mouseGoldLight = new THREE.PointLight(0xcba135, 7, 28);
      mouseGoldLight.position.set(0, 0, 4);
      scene.add(mouseGoldLight);

      // Control reactivo del puntero (con amortiguación física suave)
      let mouseX = 0;
      let mouseY = 0;
      let currentX = 0;
      let currentY = 0;
      let scrollY = 0;
      let targetScrollY = 0;

      handlePointerMove = (e: PointerEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener("pointermove", handlePointerMove, { passive: true });

      handleScroll = () => {
        targetScrollY = window.scrollY || window.pageYOffset;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      handleResize = () => {
        if (!renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      const activeTimer = new THREE.Timer();
      timer = activeTimer;

      const animate = (timestamp?: number) => {
        animationFrameId = requestAnimationFrame(animate);
        activeTimer.update(timestamp);
        const elapsed = activeTimer.getElapsed();

        // Interpolación fluida del mouse y scroll
        currentX += (mouseX - currentX) * 0.04;
        currentY += (mouseY - currentY) * 0.04;
        scrollY += (targetScrollY - scrollY) * 0.05;

        // Movimiento de luces siguiendo el mouse en el espacio 3D
        mouseVinoLight.position.x = currentX * 7;
        mouseVinoLight.position.y = currentY * 5;
        mouseGoldLight.position.x = -currentX * 6;
        mouseGoldLight.position.y = -currentY * 4;

        // Rotación cinética de las esculturas
        knotMesh.rotation.x = elapsed * 0.22;
        knotMesh.rotation.y = elapsed * 0.32;
        knotMesh.position.y = 0.5 + Math.sin(elapsed * 0.8) * 0.3;

        icoMesh.rotation.x = -elapsed * 0.15;
        icoMesh.rotation.y = -elapsed * 0.2;
        icoMesh.position.y = -1 + Math.cos(elapsed * 0.6) * 0.25;

        particlesMesh.rotation.y = elapsed * 0.04;

        // Dinámica de ondas de la malla inferior
        if (planeGeometry) {
          const pos = planeGeometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vy = pos.getY(i);
            const distToMouse = Math.hypot(vx - currentX * 10, vy - currentY * 10);
            const wave =
              Math.sin(vx * 0.4 + elapsed * 1.5) *
              Math.cos(vy * 0.4 + elapsed * 1.5) *
              0.65;
            const ripple = Math.sin(distToMouse * 0.8 - elapsed * 3) * 0.2;
            pos.setZ(i, originalZ[i] + wave + ripple);
          }
          pos.needsUpdate = true;
        }

        // Inclinación y parallax general de la escena
        rootGroup.rotation.y = currentX * 0.4;
        rootGroup.rotation.x = -currentY * 0.3;
        rootGroup.position.y = scrollY * 0.0015;

        // Parallax de la cámara con el scroll
        camera.position.y = -scrollY * 0.0012;

        renderer?.render(scene, camera);
      };

      animate();
    } catch (err) {
      console.warn("WebGL no disponible:", err);
      queueMicrotask(() => setHasWebGLError(true));
    }

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (handlePointerMove) window.removeEventListener("pointermove", handlePointerMove);
      if (handleScroll) window.removeEventListener("scroll", handleScroll);
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (container && renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      planeGeometry?.dispose();
      planeMaterial?.dispose();
      knotGeometry?.dispose();
      knotMaterial?.dispose();
      icoGeometry?.dispose();
      icoMaterial?.dispose();
      particlesGeometry?.dispose();
      particlesMaterial?.dispose();
      timer?.dispose();
    };
  }, []);

  if (hasWebGLError) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 h-screen w-screen overflow-hidden"
    />
  );
}
