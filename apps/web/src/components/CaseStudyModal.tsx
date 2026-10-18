"use client";

import { useEffect } from "react";
import { X, CheckCircle2, ShieldAlert, Cpu, Activity, ExternalLink } from "lucide-react";

export interface CaseStudyData {
  id: string;
  title: string;
  clientType: string;
  problem: string;
  solution: string;
  rudaTest: {
    name: string;
    description: string;
    metrics: string;
    outcome: string;
  }[];
  verdict: string;
  technologies: string[];
  liveUrl?: string;
}

interface CaseStudyModalProps {
  caseStudy: CaseStudyData | null;
  onClose: () => void;
}

export function CaseStudyModal({ caseStudy, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (caseStudy) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [caseStudy, onClose]);

  if (!caseStudy) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#362f37] border border-[#b82d46]/60 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-[#f5dade]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#615362] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#721828]/70 text-[#f2cf6b] border border-[#721828]">
                Expediente de Testing Rudo
              </span>
              <span className="text-xs text-[#c29da5]">{caseStudy.clientType}</span>
            </div>
            <h3 id="case-study-title" className="text-xl sm:text-2xl font-bold text-[#ff6b85] tracking-tight">
              {caseStudy.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-[#c29da5] hover:text-[#f2cf6b] bg-[#423943] hover:bg-[#721828] rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm">
          {/* El Dolor vs La Solución */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#423943] border border-red-900/50 rounded-xl p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff6b85] mb-2">
                <ShieldAlert size={14} /> El Dolor Crítico Inicial
              </span>
              <p className="text-[#f5dade] leading-relaxed">{caseStudy.problem}</p>
            </div>
            <div className="bg-[#423943] border border-[#cba135]/40 rounded-xl p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f2cf6b] mb-2">
                <CheckCircle2 size={14} /> La Solución de Ingeniería
              </span>
              <p className="text-[#f5dade] leading-relaxed">{caseStudy.solution}</p>
            </div>
          </div>

          {/* Batería de Pruebas Rudas */}
          <div>
            <h4 className="flex items-center gap-2 text-base font-bold text-[#ff6b85] mb-3">
              <Activity className="text-[#f2cf6b]" size={18} />
              Batería de Pruebas Rudas Superadas
            </h4>
            <div className="space-y-3">
              {caseStudy.rudaTest.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-[#423943] border border-[#615362] rounded-xl p-3.5 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#f5dade] flex items-center gap-2">
                      <Cpu size={14} className="text-[#ff6b85]" />
                      {test.name}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      {test.outcome}
                    </span>
                  </div>
                  <p className="text-xs text-[#c29da5]">{test.description}</p>
                  <div className="mt-1 text-xs font-mono text-[#f2cf6b] bg-[#362f37] px-2 py-1 rounded inline-block w-fit border border-[#615362]">
                    Métrica: {test.metrics}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Veredicto de Certificación */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#721828]/40 via-[#0e111a] to-[#07080c] border-l-4 border-[#cba135]">
            <span className="text-xs font-bold uppercase text-[#f2cf6b] block mb-1">
              Veredicto de Arquitectura:
            </span>
            <p className="text-[#f5dade] text-xs sm:text-sm font-medium italic">
              &ldquo;{caseStudy.verdict}&rdquo;
            </p>
          </div>

          {/* Stack Técnico */}
          <div>
            <span className="text-xs font-bold text-[#c29da5] uppercase tracking-wider block mb-2">
              Tecnologías Utilizadas:
            </span>
            <div className="flex flex-wrap gap-2">
              {caseStudy.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#423943] text-[#f5dade] border border-[#615362]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#615362] flex flex-wrap items-center justify-between gap-3">
          {caseStudy.liveUrl ? (
            <a
              href={caseStudy.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] border border-[#cba135]/40 rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <span>Ver Caso Completo & Demo en renkaidev.workers.dev</span>
              <ExternalLink size={13} />
            </a>
          ) : (
            <span />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-[#f5dade] hover:text-[#f2cf6b] bg-[#423943] hover:bg-[#721828] border border-[#615362] rounded-xl transition-all"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
}
