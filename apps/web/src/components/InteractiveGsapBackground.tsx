"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

/**
 * Escultura Generativa Viva: "Halo Drift & Morphogenesis"
 * --------------------------------------------------------
 * Simula formas abstractas vivas en constante evolución y adaptación orgánica:
 * - Listones biomórficos entrelazados (blanco perlado, ribete dorado #CBA135 y núcleo vino #5E0B15).
 * - Halos cinéticos giroscópicos con precesión continua.
 * - Enjambre de esporas de datos en deriva reactiva al cursor.
 * - Control de inercia y respiración armónica impulsado por GSAP.
 */
export function InteractiveGsapBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number | null = null;
    let timer: THREE.Timer | null = null;

    // Geometrías y Materiales para limpieza
    let ribbonGeometry: THREE.TubeGeometry | null = null;
    let ribbonMaterial: THREE.MeshPhysicalMaterial | null = null;
    let veinGeometry: THREE.TubeGeometry | null = null;
    let veinMaterial: THREE.MeshPhysicalMaterial | null = null;
    let haloGeometry: THREE.TorusGeometry | null = null;
    let haloMaterial: THREE.MeshStandardMaterial | null = null;
    let haloOuterGeometry: THREE.TorusGeometry | null = null;
    let haloOuterMaterial: THREE.MeshStandardMaterial | null = null;
    let particlesGeometry: THREE.BufferGeometry | null = null;
    let particlesMaterial: THREE.PointsMaterial | null = null;

    let handlePointerMove: ((e: PointerEvent) => void) | null = null;
    let handleScroll: (() => void) | null = null;
    let handleResize: (() => void) | null = null;

    // Estado reactivo de GSAP
    const motionState = {
      mouseX: 0,
      mouseY: 0,
      targetX: 0,
      targetY: 0,
      scrollY: 0,
      targetScrollY: 0,
      evolutionProgress: 0,
      breathScale: 1,
    };

    const ctx = gsap.context(() => {
      // 1. Ciclo de respiración orgánica vital con GSAP
      gsap.to(motionState, {
        breathScale: 1.06,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Evolución continua de las curvas matemáticas
      gsap.to(motionState, {
        evolutionProgress: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }, container);

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf7f4f0);
      scene.fog = new THREE.FogExp2(0xf7f4f0, 0.04);

      const camera = new THREE.PerspectiveCamera(
        42,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0.2, 12);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);

      const livingGroup = new THREE.Group();
      scene.add(livingGroup);

      // --- Curvas generativas de los listones biomórficos ---
      const createLivingSpline = (phaseOffset: number, radiusX: number, radiusY: number, heightZ: number) => {
        const points: THREE.Vector3[] = [];
        const segments = 20;
        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          const x = Math.sin(t) * radiusX + Math.sin(t * 2 + phaseOffset) * 0.9;
          const y = Math.cos(t) * radiusY + Math.cos(t * 3 + phaseOffset) * 0.7;
          const z = Math.sin(t * 3 + phaseOffset) * heightZ;
          points.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.CatmullRomCurve3(points, true, "centripetal");
      };

      // 1. Listón Blanco Perlado con ribete oro (Forma viva principal)
      const primaryCurve = createLivingSpline(0, 3.2, 2.2, 1.8);
      ribbonGeometry = new THREE.TubeGeometry(primaryCurve, 140, 0.38, 16, true);
      ribbonMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xfdfbf7,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        transmission: 0.15,
        ior: 1.45,
      });
      const ribbonMesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
      livingGroup.add(ribbonMesh);

      // 2. Vena / Hélice Roja Vino translúcida entrelazada (#5E0B15)
      const veinCurve = createLivingSpline(Math.PI * 0.45, 2.8, 1.9, 2.2);
      veinGeometry = new THREE.TubeGeometry(veinCurve, 140, 0.22, 14, true);
      veinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x5e0b15,
        roughness: 0.12,
        metalness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0.55,
        opacity: 0.9,
        transparent: true,
        ior: 1.52,
      });
      const veinMesh = new THREE.Mesh(veinGeometry, veinMaterial);
      livingGroup.add(veinMesh);

      // 3. Halos de Oro Champán Cinéticos (#CBA135)
      haloGeometry = new THREE.TorusGeometry(3.6, 0.05, 16, 120);
      haloMaterial = new THREE.MeshStandardMaterial({
        color: 0xcba135,
        metalness: 0.92,
        roughness: 0.18,
      });
      const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
      haloMesh.rotation.x = Math.PI / 3;
      livingGroup.add(haloMesh);

      haloOuterGeometry = new THREE.TorusGeometry(4.4, 0.035, 16, 120);
      haloOuterMaterial = new THREE.MeshStandardMaterial({
        color: 0xcba135,
        metalness: 0.95,
        roughness: 0.15,
        transparent: true,
        opacity: 0.65,
      });
      const haloOuterMesh = new THREE.Mesh(haloOuterGeometry, haloOuterMaterial);
      haloOuterMesh.rotation.y = Math.PI / 4;
      livingGroup.add(haloOuterMesh);

      // 4. Esporas de Deriva / Micropartículas biológicas
      const sporeCount = 90;
      const sporePositions = new Float32Array(sporeCount * 3);
      for (let i = 0; i < sporeCount * 3; i += 3) {
        sporePositions[i] = (Math.random() - 0.5) * 16;
        sporePositions[i + 1] = (Math.random() - 0.5) * 12;
        sporePositions[i + 2] = (Math.random() - 0.5) * 8;
      }
      particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(sporePositions, 3));
      particlesMaterial = new THREE.PointsMaterial({
        color: 0xcba135,
        size: 0.065,
        transparent: true,
        opacity: 0.75,
      });
      const sporesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      livingGroup.add(sporesMesh);

      // 5. Iluminación escénica orgánica
      const ambientLight = new THREE.AmbientLight(0xf7f4f0, 1.9);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfffdfa, 1.4);
      keyLight.position.set(6, 10, 8);
      scene.add(keyLight);

      // Luces reactivas de Halo Drift guiadas por el mouse
      const vinoLight = new THREE.PointLight(0x5e0b15, 8, 30);
      vinoLight.position.set(0, 0, 5);
      scene.add(vinoLight);

      const goldLight = new THREE.PointLight(0xcba135, 9, 32);
      goldLight.position.set(0, 0, 5);
      scene.add(goldLight);

      // Controladores con GSAP quickTo para respuesta instantánea al mouse (60-120 FPS)
      const xQuick = gsap.quickTo(motionState, "targetX", { duration: 0.9, ease: "power2.out" });
      const yQuick = gsap.quickTo(motionState, "targetY", { duration: 0.9, ease: "power2.out" });

      handlePointerMove = (e: PointerEvent) => {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        xQuick(normX);
        yQuick(normY);
      };
      window.addEventListener("pointermove", handlePointerMove, { passive: true });

      handleScroll = () => {
        motionState.targetScrollY = window.scrollY || window.pageYOffset;
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

      // Bucle de renderizado continuo y adaptable
      const animate = (timestamp?: number) => {
        animationFrameId = requestAnimationFrame(animate);
        activeTimer.update(timestamp);
        const elapsed = activeTimer.getElapsed();

        // Amortiguación hacia las coordenadas del cursor
        motionState.mouseX += (motionState.targetX - motionState.mouseX) * 0.05;
        motionState.mouseY += (motionState.targetY - motionState.mouseY) * 0.05;
        motionState.scrollY += (motionState.targetScrollY - motionState.scrollY) * 0.05;

        // Movimiento de las luces Halo siguiendo al cursor
        vinoLight.position.x = motionState.mouseX * 7;
        vinoLight.position.y = motionState.mouseY * 5;
        goldLight.position.x = -motionState.mouseX * 6;
        goldLight.position.y = -motionState.mouseY * 4;

        // Dinámica viva del grupo escultórico
        const scale = motionState.breathScale;
        livingGroup.scale.set(scale, scale, scale);

        // Deriva continua (Halo Drift): rotaciones asíncronas no repetitivas
        livingGroup.rotation.y = motionState.mouseX * 0.45 + elapsed * 0.08;
        livingGroup.rotation.x = -motionState.mouseY * 0.35 + Math.sin(elapsed * 0.3) * 0.08;
        livingGroup.rotation.z = Math.cos(elapsed * 0.25) * 0.05;

        // Precesión giroscópica de los halos circundantes
        haloMesh.rotation.x = elapsed * 0.35;
        haloMesh.rotation.y = elapsed * 0.2;
        haloOuterMesh.rotation.y = -elapsed * 0.25;
        haloOuterMesh.rotation.z = elapsed * 0.15;

        // Ondulación interna del listón de vino
        veinMesh.rotation.y = -elapsed * 0.12;
        veinMesh.rotation.z = elapsed * 0.08;

        // Deriva de esporas en ingravidez
        sporesMesh.rotation.y = elapsed * 0.03;

        // Parallax con el desplazamiento vertical de la página
        camera.position.y = 0.2 - motionState.scrollY * 0.0014;

        renderer?.render(scene, camera);
      };

      animate();
    } catch (err) {
      console.warn("WebGL no disponible:", err);
      queueMicrotask(() => setHasWebGLError(true));
    }

    return () => {
      ctx.revert();
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (handlePointerMove) window.removeEventListener("pointermove", handlePointerMove);
      if (handleScroll) window.removeEventListener("scroll", handleScroll);
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (container && renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      ribbonGeometry?.dispose();
      ribbonMaterial?.dispose();
      veinGeometry?.dispose();
      veinMaterial?.dispose();
      haloGeometry?.dispose();
      haloMaterial?.dispose();
      haloOuterGeometry?.dispose();
      haloOuterMaterial?.dispose();
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
      className="fixed inset-0 pointer-events-none -z-10 h-screen w-screen overflow-hidden bg-[#F7F4F0]"
    />
  );
}
