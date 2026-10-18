"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Maximize2,
  Sliders,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Clock,
  Zap,
  Layers,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

interface VideoTrack {
  id: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  durationLabel: string;
  metrics: {
    label: string;
    value: string;
    desc: string;
    trend: string;
  }[];
  chapters: {
    time: number;
    title: string;
    speechText: string;
    persuasiveHighlight: string;
  }[];
}

const VIDEO_TRACKS: VideoTrack[] = [
  {
    id: "dashboard-1",
    title: "Dashboard Agrícola: Consolidación de Contratistas & Cuadrillas",
    subtitle: "De 14 planillas descalzadas a un centro de comando unificado en tiempo real",
    videoSrc: "/videos/dashboard-excel-agricola-contratistas.mp4",
    durationLabel: "Preview Demostrativo",
    metrics: [
      {
        label: "Reducción de Duplicados",
        value: "100%",
        desc: "Cero pagos dobles o cuadrillas repetidas en nómina",
        trend: "Erradicación total",
      },
      {
        label: "Tiempo Manual Semanal",
        value: "-38 hrs",
        desc: "Ahorro directo en consolidación y cruce de datos",
        trend: "Recuperación de horas",
      },
      {
        label: "Velocidad de Carga",
        value: "<350 ms",
        desc: "Modelado relacional optimizado sin bloqueos",
        trend: "x12 más veloz",
      },
      {
        label: "Ahorro Trimestral",
        value: "$4.5M CLP",
        desc: "Recuperados al frenar fugas en horas no autorizadas",
        trend: "ROI inmediato",
      },
    ],
    chapters: [
      {
        time: 0,
        title: "01. El Dolor: 14 Planillas Desfasadas",
        speechText:
          "¿Cansado de perder dinero en planillas colapsadas y pagos duplicados? Antes de esta solución, la empresa perdía más de 38 horas semanales intentando cuadrar 14 planillas descalzadas entre correos y chats de WhatsApp, sufriendo graves errores en los pagos a contratistas y dolores de cabeza permanentes a fin de mes.",
        persuasiveHighlight: "Eliminación total de la ceguera operativa, cruces manuales y fuga de dinero.",
      },
      {
        time: 5,
        title: "02. Arquitectura de Normalización & Cruces",
        speechText:
          "Con este centro de comando y motor rápido creado por naxo resuelve, unificamos jornales, faenas y cuadrillas con tolerancia cero a inconsistencias. Cada cálculo se valida en milisegundos, erradicando al cien por ciento los pagos dobles y las horas no autorizadas antes de girar un solo peso.",
        persuasiveHighlight: "Algoritmos de deduplicación matemática y validación en tiempo real.",
      },
      {
        time: 12,
        title: "03. Resultados Reales & Retorno de Inversión",
        speechText:
          "El resultado es contundente: cero duplicados, reportes gerenciales en un parpadeo y más de cuatro millones y medio de pesos recuperados en la primera temporada. Menos calentamiento de cabeza, menos horas perdidas y control absoluto de la rentabilidad de tu negocio.",
        persuasiveHighlight: "Rentabilidad probada, ahorro de tiempo y tranquilidad operativa.",
      },
    ],
  },
  {
    id: "dashboard-2",
    title: "Telemetría de Rendimiento & Detección de Fugas",
    subtitle: "Filtrado dinámico de alta velocidad y alertas directivas en faena",
    videoSrc: "/videos/dashboard-excel-agricola-contratistas2.mp4",
    durationLabel: "Módulo Operativo",
    metrics: [
      {
        label: "Detección de Fugas",
        value: "Instantánea",
        desc: "Alerta automática ante jornales que exceden límites",
        trend: "Freno en tiempo real",
      },
      {
        label: "Precisión de Datos",
        value: "99.98%",
        desc: "Validación estricta de RUT, cuadrilla y pesaje",
        trend: "Auditoría perfecta",
      },
      {
        label: "Tiempo de Búsqueda",
        value: "<1 segundo",
        desc: "Adiós al dolor de cabeza buscando semanas atrás",
        trend: "Respuesta inmediata",
      },
      {
        label: "Trazabilidad Total",
        value: "100%",
        desc: "Historial inmutable de modificaciones y accesos",
        trend: "Transparencia legal",
      },
    ],
    chapters: [
      {
        time: 0,
        title: "01. Monitoreo Activo de Rendimiento",
        speechText:
          "En este segundo módulo observamos el motor de filtros dinámicos. La administración puede auditar el costo exacto por contratista y contrastar el rendimiento por hectárea en tiempo real, respaldando cada decisión de negocio con números verificados y no con corazonadas.",
        persuasiveHighlight: "Toma de decisiones respaldada por números verificados, no suposiciones.",
      },
      {
        time: 6,
        title: "02. Filtros Dinámicos Sin Congelamiento",
        speechText:
          "Olvídate de las macros lentas que se cuelgan o colapsan el computador. Este motor de alta velocidad procesa miles de registros en veinte milisegundos, entregando respuestas inmediatas sin bloqueos de pantalla ni pérdida de información.",
        persuasiveHighlight: "Fluidez extrema sin los clásicos congelamientos de Excel.",
      },
      {
        time: 14,
        title: "03. Conclusión: De la Fricción a la Automatización",
        speechText:
          "Esto no es solo un dashboard visual. Es una solución de ingeniería que rescata el tiempo de tu equipo, cuida tu dinero y te saca un tremendo dolor de cabeza de encima con naxo resuelve.",
        persuasiveHighlight: "Transformación digital con pruebas rudas de estrés y cero error humano.",
      },
    ],
  },
];

export function ModernCanvasVideoPlayer() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const activeTrack = VIDEO_TRACKS[activeTrackIndex];

  // Canvas & Video Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [hudMode, setHudMode] = useState<"cyber" | "clean">("cyber");

  // Web Audio Confirmation Chime (Audible Cyber Feedback)
  const playCyberChime = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext fallback
    }
  }, []);

  // AI Voice State
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState(
    activeTrack.chapters[0].speechText
  );
  const [currentHighlight, setCurrentHighlight] = useState(
    activeTrack.chapters[0].persuasiveHighlight
  );

  // Active Chapter Index
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const lastSpokenChapterRef = useRef<number>(-1);

  // Speech Synthesis Engine Refs & Voice Cache
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar y almacenar voces del navegador (gestión de asincronismo en Chromium)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      } catch (err) {
        console.warn("No fue posible cargar las voces del sistema", err);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Mitigación de congelamiento en Chromium (bug donde speech se pausa a los 15s)
  useEffect(() => {
    if (!voiceSpeaking) return;
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 9000);
    return () => clearInterval(interval);
  }, [voiceSpeaking]);

  /* ------------------------------------------------------------------ */
  /*  Speech Synthesis (Voz IA en Español - Solución & Resultados)       */
  /* ------------------------------------------------------------------ */

  const stopVoice = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
      window.speechSynthesis.cancel();
      activeUtteranceRef.current = null;
      setVoiceSpeaking(false);
    }
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (!isVoiceActive || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      try {
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
          speechTimeoutRef.current = null;
        }

        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        activeUtteranceRef.current = utterance; // Referencia retenida para evitar garbage collection en V8

        const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
        const spanishVoice =
          availableVoices.find((v) => v.lang.toLowerCase() === "es-cl") ||
          availableVoices.find((v) => v.lang.toLowerCase().startsWith("es-mx") || v.lang.toLowerCase().includes("mexico")) ||
          availableVoices.find((v) => v.lang.toLowerCase().startsWith("es-419") || v.lang.toLowerCase().includes("latin")) ||
          availableVoices.find((v) => v.lang.toLowerCase().startsWith("es-ar") || v.lang.toLowerCase().startsWith("es-co")) ||
          availableVoices.find((v) => v.lang.toLowerCase().startsWith("es-es") || v.lang.toLowerCase().includes("spain") || v.lang.toLowerCase().includes("spanish")) ||
          availableVoices.find((v) => v.lang.toLowerCase().startsWith("es"));

        if (spanishVoice) {
          utterance.voice = spanishVoice;
          utterance.lang = spanishVoice.lang;
        } else {
          utterance.lang = "es-CL";
        }

        utterance.rate = 1.0; // Cadencia firme y clara
        utterance.pitch = 1.0;
        utterance.volume = 1.0; // Volumen al 100%

        utterance.onstart = () => {
          setVoiceSpeaking(true);
        };
        utterance.onend = () => {
          setVoiceSpeaking(false);
          activeUtteranceRef.current = null;
        };
        utterance.onerror = (e) => {
          if (e.error !== "interrupted" && e.error !== "canceled") {
            console.warn("Aviso de síntesis vocal:", e.error);
          }
          setVoiceSpeaking(false);
          activeUtteranceRef.current = null;
        };

        // Breve retardo para permitir que el ciclo de cancelación de Chromium libere el bus de audio
        speechTimeoutRef.current = setTimeout(() => {
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
          }
        }, 45);
      } catch (err) {
        console.error("Falla en síntesis vocal Web Speech:", err);
        setVoiceSpeaking(false);
      }
    },
    [isVoiceActive, voices]
  );

  /* ------------------------------------------------------------------ */
  /*  Canvas HUD Overlay (Scanlines, Golden Brackets & Telemetría)       */
  /* ------------------------------------------------------------------ */

  const renderCanvasFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas para mantener transparencia cristalina sobre el video nativo
    ctx.clearRect(0, 0, width, height);

    if (hudMode === "cyber") {
      // 1. Scanlines sutiles estilo monitor militar/forense
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      // 2. Overlays HUD en las 4 esquinas (Marco de Precisión)
      const bracketSize = 24;
      const margin = 18;
      ctx.strokeStyle = "#cba135"; // Dorado
      ctx.lineWidth = 2.5;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(margin, margin + bracketSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + bracketSize, margin);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - margin - bracketSize, margin);
      ctx.lineTo(width - margin, margin);
      ctx.lineTo(width - margin, margin + bracketSize);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(margin, height - margin - bracketSize);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(margin + bracketSize, height - margin);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(width - margin - bracketSize, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.lineTo(width - margin, height - margin - bracketSize);
      ctx.stroke();

      // 3. Telemetría HUD Superior
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = "#ff758f"; // Vino
      ctx.fillText("● TELEMETRÍA EN VIVO · PABLO VALDÉS", margin + 10, margin + 22);

      ctx.fillStyle = "#f2cf6b"; // Dorado
      const isPaused = !video || video.paused;
      ctx.fillText(
        `STATUS: ${isPaused ? "PAUSADO" : "EN REPRODUCCIÓN · 60 FPS"}`,
        margin + 10,
        margin + 40
      );

      // Tiempo HUD Superior Derecho
      ctx.textAlign = "right";
      const curTime = video ? video.currentTime : 0;
      const curMin = Math.floor(curTime / 60)
        .toString()
        .padStart(2, "0");
      const curSec = Math.floor(curTime % 60)
        .toString()
        .padStart(2, "0");
      ctx.fillStyle = "#f5dade";
      ctx.fillText(`TIMECODE: 00:${curMin}:${curSec}`, width - margin - 10, margin + 22);
      ctx.fillStyle = "#c29da5";
      ctx.fillText("DEDUPLICACIÓN: 100% ACTIVA", width - margin - 10, margin + 40);

      // 4. Visualizador de Espectro de Audio / Voz IA en Canvas
      if (voiceSpeaking || (video && !video.paused && !video.muted)) {
        const barCount = 30;
        const barWidth = 3;
        const barSpacing = 4;
        const startX = width / 2 - (barCount * (barWidth + barSpacing)) / 2;
        const baseY = height - 26;

        ctx.fillStyle = "#cba135";
        const now = Date.now() / 140;
        for (let i = 0; i < barCount; i++) {
          const barHeight = Math.max(
            4,
            Math.sin(now + i * 0.4) * 12 + Math.cos(now * 0.7 + i * 0.2) * 8 + 14
          );
          ctx.fillRect(
            startX + i * (barWidth + barSpacing),
            baseY - barHeight,
            barWidth,
            barHeight
          );
        }

        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ff6b85";
        ctx.fillText("● AUDIO TRANSMISIÓN EN VIVO", width / 2, baseY + 12);
      }
    }

    animationFrameRef.current = requestAnimationFrame(renderCanvasFrame);
  }, [hudMode, voiceSpeaking]);

  /* ------------------------------------------------------------------ */
  /*  Video Event Listeners & Time Sync                                  */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 1);

      // Detectar capítulo actual para coordinar la narración por voz
      const currentChIdx = activeTrack.chapters.reduce(
        (acc, ch, idx) => (video.currentTime >= ch.time ? idx : acc),
        0
      );

      if (currentChIdx !== lastSpokenChapterRef.current) {
        lastSpokenChapterRef.current = currentChIdx;
        setCurrentChapterIdx(currentChIdx);
        const chapter = activeTrack.chapters[currentChIdx];
        setCurrentSubtitle(chapter.speechText);
        setCurrentHighlight(chapter.persuasiveHighlight);

        // Si la voz está encendida y el video se está reproduciendo, narrar el capítulo
        if (isVoiceActive && !video.paused) {
          speakText(chapter.speechText);
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      stopVoice();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    // Iniciar loop de renderizado en canvas
    animationFrameRef.current = requestAnimationFrame(renderCanvasFrame);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopVoice();
    };
  }, [activeTrack, isVoiceActive, renderCanvasFrame, speakText, stopVoice]);

  // Al cambiar de track o video
  const selectTrack = (index: number) => {
    stopVoice();
    setActiveTrackIndex(index);
    lastSpokenChapterRef.current = -1;
    setCurrentChapterIdx(0);
    setCurrentSubtitle(VIDEO_TRACKS[index].chapters[0].speechText);
    setCurrentHighlight(VIDEO_TRACKS[index].chapters[0].persuasiveHighlight);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
          if (isVoiceActive) {
            speakText(VIDEO_TRACKS[index].chapters[0].speechText);
          }
        }).catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
      }
    }
  };

  // Controles con activación de gesto de usuario directa
  const handleDirectSpeak = (customText?: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // ignore
      }
    }
    setIsVoiceActive(true);
    const textToSpeak = customText || currentSubtitle;
    speakText(textToSpeak);
    if (videoRef.current && videoRef.current.paused) {
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
      }
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // ignore
      }
    }

    if (video.paused) {
      if (isVoiceActive) {
        speakText(currentSubtitle);
      }
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn("Reproducción unmuted bloqueada por navegador, intentando muted:", err);
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => {
            setIsPlaying(true);
          }).catch((finalErr) => {
            console.error("Fallo definitivo de reproducción de video:", finalErr);
            setIsPlaying(false);
          });
        });
      }
    } else {
      video.pause();
      setIsPlaying(false);
      stopVoice();
    }
  };

  const jumpToChapter = (chapterTime: number, chapterIdx: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // ignore
      }
    }

    video.currentTime = chapterTime;
    setCurrentChapterIdx(chapterIdx);
    lastSpokenChapterRef.current = chapterIdx;
    const chapter = activeTrack.chapters[chapterIdx];
    setCurrentSubtitle(chapter.speechText);
    setCurrentHighlight(chapter.persuasiveHighlight);

    if (video.paused) {
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
      }
    }

    if (isVoiceActive) {
      speakText(chapter.speechText);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleVoiceGuide = () => {
    if (isVoiceActive) {
      stopVoice();
      setIsVoiceActive(false);
    } else {
      handleDirectSpeak(currentSubtitle);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Selector de Video Tracks */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-[#423943] border border-[#615362]">
        <div className="flex flex-wrap gap-2">
          {VIDEO_TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => selectTrack(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTrackIndex === idx
                  ? "bg-gradient-to-r from-[#721828] to-[#9e233b] text-white shadow-md border border-[#cba135]/50 scale-[1.01]"
                  : "bg-[#362f37] text-[#c29da5] hover:text-[#f5dade] border border-[#615362]"
              }`}
            >
              <FileSpreadsheet size={15} className={activeTrackIndex === idx ? "text-[#f2cf6b]" : "text-[#9e8e97]"} />
              <span>Video 0{idx + 1}: {track.title.split(":")[0]}</span>
            </button>
          ))}
        </div>

        {/* Interruptor de Modo HUD y Voz IA */}
        <div className="flex items-center gap-2 px-2">
          <button
            onClick={() => setHudMode(hudMode === "cyber" ? "clean" : "cyber")}
            className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-[#362f37] hover:bg-[#362f37] text-[#c29da5] hover:text-[#f2cf6b] border border-[#615362] transition flex items-center gap-1.5"
            title="Alternar gráficos HUD futuristas sobre el canvas"
          >
            <Sliders size={13} className="text-[#f2cf6b]" />
            <span>HUD: {hudMode === "cyber" ? "Cyber" : "Limpio"}</span>
          </button>

          <button
            onClick={toggleVoiceGuide}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold border transition flex items-center gap-1.5 ${
              isVoiceActive
                ? "bg-[#721828]/60 text-[#f2cf6b] border-[#cba135]/60 shadow-[0_0_12px_rgba(203,161,53,0.3)]"
                : "bg-[#362f37] text-[#9e8e97] border-[#615362]"
            }`}
          >
            {isVoiceActive ? <Mic size={13} className="text-[#f2cf6b]" /> : <MicOff size={13} />}
            <span>{isVoiceActive ? "Voz IA: Activa" : "Voz IA: Mute"}</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Canvas Player (Izquierda 7 cols) + Métricas & Teleprompter (Derecha 5 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Canvas Renderer + Controles (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#b82d46] bg-[#07080c] shadow-[0_20px_50px_rgba(0,0,0,0.9)] group aspect-video">
            
            {/* 1. Elemento de Video Nativo Hardware-Accelerated (100% visible, sin proxies) */}
            <video
              ref={videoRef}
              src={activeTrack.videoSrc}
              playsInline
              loop
              preload="auto"
              muted={isMuted}
              onClick={togglePlay}
              className="w-full h-full object-cover block cursor-pointer bg-black"
            />

            {/* 2. Capa HUD Cyberpunk en Canvas Transparente */}
            {hudMode === "cyber" && (
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                onClick={togglePlay}
                className="absolute inset-0 w-full h-full pointer-events-none object-cover"
              />
            )}

            {/* 3. Botón Central Play cuando está pausado */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px] cursor-pointer group-hover:bg-black/35 transition-all z-10"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#721828] via-[#9e233b] to-[#cba135] flex items-center justify-center text-white shadow-[0_0_35px_rgba(184,45,70,0.9)] border-2 border-[#f2cf6b] transform group-hover:scale-110 transition-transform">
                  <Play size={36} className="ml-1 text-white fill-white" />
                </div>
                <span className="mt-3 px-3.5 py-1 rounded-full bg-black/85 border border-[#cba135]/70 text-xs font-mono font-bold text-[#f2cf6b] tracking-wider uppercase shadow-lg">
                  ▶ Iniciar Demostración en Video con Audio
                </span>
              </div>
            )}

            {/* 4. Barra Superior Flotante con Estado de Audio y Voz */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (voiceSpeaking) {
                      stopVoice();
                    } else {
                      handleDirectSpeak();
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    voiceSpeaking
                      ? "bg-[#721828] text-[#f2cf6b] border border-[#cba135] shadow-[0_0_20px_rgba(203,161,53,0.5)] animate-pulse"
                      : "bg-[#721828]/95 hover:bg-[#9e233b] text-white border border-[#f2cf6b]/70 hover:scale-105 active:scale-95"
                  }`}
                  title="Haz clic para escuchar la voz IA guiando las soluciones y resultados del dashboard"
                >
                  {voiceSpeaking ? (
                    <>
                      <Mic size={15} className="text-[#f2cf6b]" />
                      <span>🔊 Voz IA Activa (Clic para Silenciar)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={15} className="text-[#f2cf6b] animate-bounce" />
                      <span>🔊 Escuchar Guía por Voz IA</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                    !isMuted
                      ? "bg-emerald-800/90 text-white border border-emerald-400"
                      : "bg-[#362f37]/90 text-[#f2cf6b] border border-[#615362] hover:border-[#f2cf6b]"
                  }`}
                  title={isMuted ? "Clic para Activar Audio del Video" : "Audio del Video Activo"}
                >
                  {!isMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span>{isMuted ? "Audio Video: Silenciado" : "Audio Video: Activo"}</span>
                </button>
              </div>

              {/* Enlace directo a abrir video en pestaña */}
              <a
                href={activeTrack.videoSrc}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-black/60 hover:bg-black/80 text-[#c29da5] hover:text-white border border-[#615362] transition flex items-center gap-1"
                title="Abrir video directamente en pestaña nueva"
              >
                <span>MP4 Directo</span>
                <Maximize2 size={11} />
              </a>
            </div>

            {/* Barra de Progreso Interactiva en Canvas */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#07080c] via-[#07080c]/90 to-transparent space-y-2">
              
              {/* Scrubbing Bar */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  if (videoRef.current) {
                    videoRef.current.currentTime = pos * duration;
                  }
                }}
                className="w-full h-2 bg-[#281a24] rounded-full overflow-hidden cursor-pointer relative group/bar"
              >
                <div
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#721828] via-[#b82d46] to-[#f2cf6b] relative shadow-[0_0_10px_rgba(242,207,107,0.8)]"
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Botones de Control */}
              <div className="flex items-center justify-between text-xs font-mono text-[#f5dade]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-[#423943] hover:bg-[#4c424e] border border-[#615362] text-[#f2cf6b] transition cursor-pointer"
                    title={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                      }
                    }}
                    className="p-2 rounded-xl bg-[#423943] hover:bg-[#4c424e] border border-[#615362] text-[#c29da5] hover:text-[#f5dade] transition cursor-pointer"
                    title="Reiniciar Video"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-[#423943] hover:bg-[#4c424e] border border-[#615362] text-[#c29da5] hover:text-[#f5dade] transition cursor-pointer"
                    title={isMuted ? "Activar Audio Video" : "Silenciar Video"}
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#f2cf6b]" />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVol = parseFloat(e.target.value);
                      setVolume(newVol);
                      if (videoRef.current) {
                        videoRef.current.volume = newVol;
                        videoRef.current.muted = newVol === 0;
                        setIsMuted(newVol === 0);
                      }
                    }}
                    className="w-16 h-1.5 accent-[#cba135] bg-[#281a24] rounded-lg cursor-pointer"
                    title="Control de Volumen del Video"
                  />

                  <span className="text-[11px] text-[#c29da5]">
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, "0")}{" "}
                    / {Math.floor(duration / 60)}:
                    {Math.floor(duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>

                {/* Badge Indicador de Voz IA */}
                <div className="flex items-center gap-2">
                  {voiceSpeaking && (
                    <span className="flex items-center gap-1.5 text-[10px] text-[#f2cf6b] font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>IA NARRANDO</span>
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#721828]/60 text-[#f2cf6b] border border-[#721828]">
                    Canvas 2D Hardware-Accelerated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Capítulos y Timestamps Interactivos */}
          <div className="bg-[#423943] border border-[#615362] rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-mono text-[#f2cf6b] font-bold uppercase tracking-wider block">
              Capítulos Interactivos con Guía Auditiva:
            </span>
            <div className="grid sm:grid-cols-3 gap-2">
              {activeTrack.chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToChapter(ch.time, idx)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex flex-col justify-between ${
                    currentChapterIdx === idx
                      ? "bg-[#721828]/40 border-[#cba135] text-[#f5dade] shadow-sm"
                      : "bg-[#362f37] border-[#615362] text-[#c29da5] hover:text-[#f5dade] hover:border-[#721828]"
                  }`}
                >
                  <div className="font-bold font-mono text-[#ff6b85] text-[11px] mb-1">
                    {ch.title}
                  </div>
                  <div className="text-[10px] text-[#c29da5] line-clamp-1">
                    {ch.persuasiveHighlight}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Teleprompter de Voz IA + Métricas de Impacto (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Teleprompter / Subtítulos HUD de la Voz IA */}
          <div className="bg-gradient-to-br from-[#141824] via-[#0e111a] to-[#07080c] border border-[#b82d46]/60 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#615362] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#721828] to-[#cba135] flex items-center justify-center text-white">
                  <Mic size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#ff6b85]">
                    Guía Auditiva de Inteligencia Artificial
                  </h4>
                  <span className="text-[10px] text-[#c29da5] font-mono">
                    Síntesis Vocal en Tiempo Real (es-CL)
                  </span>
                </div>
              </div>

              <button
                onClick={toggleVoiceGuide}
                className="text-[10px] font-mono px-2 py-1 rounded bg-[#721828]/50 text-[#f2cf6b] hover:bg-[#721828] transition border border-[#721828]"
              >
                {isVoiceActive ? "Silenciar" : "Activar"}
              </button>
            </div>

            {/* Texto que la IA está diciendo */}
            <div className="min-h-[100px] flex flex-col justify-center">
              <p className="text-xs sm:text-sm text-[#f5dade] leading-relaxed italic">
                "{currentSubtitle}"
              </p>
            </div>

            {/* Fila de Valor Persuasivo */}
            <div className="mt-4 pt-3 border-t border-[#615362] flex items-center gap-2 text-xs">
              <Sparkles size={14} className="text-[#f2cf6b] shrink-0" />
              <span className="text-[#f2cf6b] font-semibold text-[11px]">
                {currentHighlight}
              </span>
            </div>

            {/* Botón de Acción Directa para Escuchar Explicación */}
            <div className="mt-4 pt-4 border-t border-[#615362] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (voiceSpeaking) {
                    stopVoice();
                  } else {
                    handleDirectSpeak();
                  }
                }}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-md ${
                  voiceSpeaking
                    ? "bg-[#721828] text-[#f2cf6b] border-[#cba135] shadow-[0_0_15px_rgba(203,161,53,0.4)] animate-pulse"
                    : "bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] text-white border-[#f2cf6b]/50 hover:scale-[1.02]"
                }`}
              >
                {voiceSpeaking ? (
                  <>
                    <VolumeX size={15} />
                    <span>Pausar Explicación IA</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={15} className="text-[#f2cf6b]" />
                    <span>▶️ Escuchar Explicación de la Solución</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-[#c29da5] font-mono text-center sm:text-right">
                {voiceSpeaking ? "🔊 Relatando solución en tiempo real" : "Voz natural en español (es-CL)"}
              </span>
            </div>
          </div>

          {/* Métricas de Implementación y Reducción de Errores */}
          <div className="bg-[#423943] border border-[#615362] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#f2cf6b] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#f2cf6b]" />
                <span>Resultados Comprobados en Producción</span>
              </h4>
              <span className="text-[10px] text-[#c29da5] font-mono">
                Métricas Reales
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {activeTrack.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#362f37] border border-[#615362] flex flex-col justify-between"
                >
                  <span className="text-[10px] text-[#c29da5] uppercase font-mono tracking-tight">
                    {m.label}
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-[#ff6b85] my-1">
                    {m.value}
                  </div>
                  <span className="text-[10px] text-[#f2cf6b] font-medium leading-tight">
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#721828]/25 border border-[#721828] text-xs text-[#f5dade] flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[#f2cf6b] mt-0.5 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                <strong>Garantía de Implementación:</strong> Si el sistema no elimina los cuellos de botella en la primera semana de despliegue, refactorizamos la arquitectura sin costo adicional.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
