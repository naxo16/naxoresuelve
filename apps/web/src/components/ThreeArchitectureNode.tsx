"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cpu, Boxes } from "lucide-react";

export function ThreeArchitectureNode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number | null = null;
    let coreGeometry: THREE.IcosahedronGeometry | null = null;
    let coreMaterial: THREE.MeshStandardMaterial | null = null;
    let innerGeometry: THREE.SphereGeometry | null = null;
    let innerMaterial: THREE.MeshBasicMaterial | null = null;
    let particleGeometry: THREE.BufferGeometry | null = null;
    let particleMaterial: THREE.PointsMaterial | null = null;

    let handleMouseMove: ((event: MouseEvent) => void) | null = null;
    let handleResize: (() => void) | null = null;

    try {
      // Escena, cámara y renderizador protegido
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        (container.clientWidth || 300) / (container.clientHeight || 300),
        0.1,
        1000
      );
      camera.position.z = 7;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // Grupo contenedor para rotación suave
      const group = new THREE.Group();
      scene.add(group);

      // 1. Núcleo geométrico Icosaedro (Dorado de alta ingeniería)
      coreGeometry = new THREE.IcosahedronGeometry(1.6, 1);
      coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xcba135,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
        metalness: 0.9,
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(coreMesh);

      // 2. Esfera interior vino tinto translúcida
      innerGeometry = new THREE.SphereGeometry(1.0, 16, 16);
      innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x721828,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
      group.add(innerMesh);

      // 3. Partículas de datos flotantes (Data Nodes)
      const particlesCount = 70;
      const positions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i += 3) {
        const radius = 2.2 + Math.random() * 1.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
      }
      particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleMaterial = new THREE.PointsMaterial({
        color: 0xf2cf6b,
        size: 0.05,
        transparent: true,
        opacity: 0.75,
      });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      group.add(particles);

      // 4. Luces ambientales y puntuales
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const goldLight = new THREE.PointLight(0xcba135, 3, 20);
      goldLight.position.set(4, 4, 4);
      scene.add(goldLight);

      const vinoLight = new THREE.PointLight(0x9e233b, 4, 20);
      vinoLight.position.set(-4, -3, 3);
      scene.add(vinoLight);

      // Interacción suave con el mouse
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      handleMouseMove = (event: MouseEvent) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / (container.clientWidth || 1)) * 2 - 1;
        mouseY = -(((event.clientY - rect.top) / (container.clientHeight || 1)) * 2 - 1);
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Manejo de resize
      handleResize = () => {
        if (!container || !renderer) return;
        camera.aspect = (container.clientWidth || 300) / (container.clientHeight || 300);
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      // Bucle de animación (60 FPS)
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotación autónoma
        coreMesh.rotation.y = elapsedTime * 0.25;
        coreMesh.rotation.x = elapsedTime * 0.15;
        innerMesh.rotation.y = -elapsedTime * 0.35;
        particles.rotation.y = elapsedTime * 0.1;

        // Suavizado hacia el puntero del mouse (Parallax)
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        group.rotation.y = targetX * 0.8;
        group.rotation.x = -targetY * 0.8;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };
      animate();
    } catch (err) {
      console.warn("Three.js WebGL no disponible o bloqueado por el navegador:", err);
      setHasWebGLError(true);
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (container && renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      coreGeometry?.dispose();
      coreMaterial?.dispose();
      innerGeometry?.dispose();
      innerMaterial?.dispose();
      particleGeometry?.dispose();
      particleMaterial?.dispose();
    };
  }, []);

  if (hasWebGLError) {
    return (
      <div className="w-full h-[300px] sm:h-[380px] flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-[#2a242c]/80 border border-[#615362]">
        <div className="w-16 h-16 rounded-2xl bg-[#721828]/50 border border-[#cba135] flex items-center justify-center text-[#f2cf6b] shadow-xl mb-4">
          <Boxes size={32} />
        </div>
        <span className="font-round text-base font-bold text-white mb-1">
          Arquitectura de Datos 3FN & Concurrencia
        </span>
        <span className="text-xs text-[#c29da5] max-w-sm">
          Modelado relacional optimizado, validación estricta y sincronización atómica garantizada en cada transacción.
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="w-full h-[300px] sm:h-[400px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
    />
  );
}
