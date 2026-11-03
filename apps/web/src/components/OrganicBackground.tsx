"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Shaders GLSL para deformación líquida 3D real y desplazamiento de ondas
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollProgress;
  uniform float uScrollVelocity;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;

  varying vec2 vUv;
  varying vec2 vCoverUv;
  varying float vElevation;

  vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 imgRes) {
    float screenAspect = screenRes.x / screenRes.y;
    float imgAspect = imgRes.x / imgRes.y;
    vec2 scale = vec2(1.0);
    vec2 offset = vec2(0.0);

    if (screenAspect > imgAspect) {
      scale.y = imgAspect / screenAspect;
      offset.y = (1.0 - scale.y) * 0.5;
    } else {
      scale.x = screenAspect / imgAspect;
      offset.x = (1.0 - scale.x) * 0.5;
    }
    return uv * scale + offset;
  }

  void main() {
    vUv = uv;
    vCoverUv = getCoverUv(uv, uResolution, uImageResolution);
    vec3 pos = position;

    // 1. Ondas orgánicas armónicas continuas (respiración 3D)
    float wave1 = sin(pos.x * 1.8 + uTime * 0.7) * 0.08;
    float wave2 = cos(pos.y * 1.6 + uTime * 0.55) * 0.07;
    float wave3 = sin((pos.x + pos.y) * 1.2 + uTime * 0.9) * 0.05;

    // 2. Interacción fluida con el cursor (desplazamiento de onda radial)
    vec2 mouseUv = uMouse;
    float mouseDist = distance(uv, mouseUv);
    float mouseImpact = sin(mouseDist * 14.0 - uTime * 2.8) * exp(-mouseDist * 3.8) * 0.14;

    // 3. Deformación dinámica inducida por la velocidad del scroll GSAP
    float scrollDeform = sin(pos.y * 2.5 + uScrollProgress * 6.28) * uScrollVelocity * 0.28;

    pos.z += wave1 + wave2 + wave3 + mouseImpact + scrollDeform;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollVelocity;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec2 vCoverUv;
  varying float vElevation;

  void main() {
    vec2 displacedUv = vCoverUv;

    // Refracción líquida suave cerca del cursor del mouse
    float mouseDist = distance(vUv, uMouse);
    vec2 mouseDir = vUv - uMouse;
    displacedUv += normalize(mouseDir + vec2(0.0001)) * exp(-mouseDist * 4.2) * 0.032;

    // Micro-deformación de textura según la velocidad del scroll
    displacedUv.y += sin(vUv.x * 8.0 + uTime * 1.2) * uScrollVelocity * 0.015;

    vec4 texColor = texture2D(uTexture, displacedUv);

    // Relieve luminoso sutil en las crestas y valles de la escultura 3D
    float elevationHighlight = vElevation * 0.35;
    texColor.rgb += vec3(elevationHighlight * 0.08);

    gl_FragColor = vec4(texColor.rgb, uOpacity);
  }
`;

export function OrganicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Escena, Cámara y Renderer WebGL de Three.js
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Fallback silencioso en entornos sin soporte WebGL
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
    camera.position.z = 2.2;

    // 2. Cálculo del Frustum para cobertura completa de la pantalla
    const calculatePlaneSize = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const planeH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const planeW = planeH * camera.aspect;
      return { width: planeW * 1.15, height: planeH * 1.15 };
    };

    let planeSize = calculatePlaneSize();
    const geometry = new THREE.PlaneGeometry(
      planeSize.width,
      planeSize.height,
      32,
      32
    );

    // 3. Cargar textura de la escultura 3D
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "/images/abstract-3d-bg.jpg",
      (loadedTexture) => {
        if (material.uniforms.uImageResolution) {
          material.uniforms.uImageResolution.value.set(
            loadedTexture.image.width || 1920,
            loadedTexture.image.height || 1080
          );
        }
      }
    );

    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // 4. ShaderMaterial con uniforms reactivos a GSAP
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScrollProgress: { value: 0 },
        uScrollVelocity: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uImageResolution: { value: new THREE.Vector2(1920, 1080) },
        uTexture: { value: texture },
        uOpacity: { value: 0.92 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 5. Estado reactivo del cursor (GSAP quickTo para inercia fluida)
    const mouseTarget = { x: 0.5, y: 0.5, normX: 0, normY: 0 };
    const mouseQuickX = gsap.quickTo(mouseTarget, "x", {
      duration: 1.0,
      ease: "power2.out",
    });
    const mouseQuickY = gsap.quickTo(mouseTarget, "y", {
      duration: 1.0,
      ease: "power2.out",
    });

    const handlePointerMove = (e: PointerEvent) => {
      const uvX = e.clientX / width;
      const uvY = 1.0 - e.clientY / height;
      mouseQuickX(uvX);
      mouseQuickY(uvY);

      // Inclinación 3D sutil de la geometría con el movimiento del ratón
      mouseTarget.normX = (e.clientX / width) * 2 - 1;
      mouseTarget.normY = -(e.clientY / height) * 2 + 1;

      gsap.to(mesh.rotation, {
        y: mouseTarget.normX * 0.12,
        x: -mouseTarget.normY * 0.08,
        duration: 1.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // 6. Integración con GSAP ScrollTrigger
    const scrollDynamics = {
      velocity: 0,
      progress: 0,
    };

    const gsapContext = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollDynamics.progress = self.progress;
          const rawVel = self.getVelocity();
          const normVel = Math.max(Math.min(rawVel / 1500, 2.0), -2.0);

          gsap.to(scrollDynamics, {
            velocity: normVel,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
            onComplete: () => {
              gsap.to(scrollDynamics, {
                velocity: 0,
                duration: 0.7,
                ease: "power2.out",
              });
            },
          });
        },
      });

      // Parallax vertical de la cámara WebGL con ScrollTrigger scrub
      gsap.to(mesh.position, {
        y: -0.3,
        z: -0.1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
    });

    // 7. Manejo responsivo (Resize)
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      material.uniforms.uResolution.value.set(width, height);

      planeSize = calculatePlaneSize();
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(
        planeSize.width,
        planeSize.height,
        32,
        32
      );
    };

    window.addEventListener("resize", handleResize);

    // 8. Loop de animación optimizado con timing nativo de alto rendimiento (sin deprecación)
    let animationFrameId: number;
    let startTime: number | null = null;

    const renderLoop = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsedTime = (timestamp - startTime) * 0.001;

      // Actualizar variables uniformes del shader
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uMouse.value.set(mouseTarget.x, mouseTarget.y);
      material.uniforms.uScrollProgress.value = scrollDynamics.progress;
      material.uniforms.uScrollVelocity.value = scrollDynamics.velocity;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Sincronizar ScrollTrigger tras el montaje
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    // 9. Cleanup de recursos WebGL y GSAP
    return () => {
      clearTimeout(refreshTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);

      gsapContext.revert();

      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Canvas WebGL interactivo Three.js + GSAP Shader */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full will-change-transform"
      />
      {/* Velo ultra sutil para contraste estético sin opacar la fluidez 3D */}
      <div className="absolute inset-0 bg-[#FAF8F5]/10 pointer-events-none" />
    </div>
  );
}
