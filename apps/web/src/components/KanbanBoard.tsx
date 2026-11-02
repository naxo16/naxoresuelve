"use client";

import { useState } from "react";
import { Users, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  tag: string;
  status: "todo" | "in_progress" | "review" | "done";
  assignee: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Migración de Planilla Ventas a PostgreSQL",
    tag: "Base de Datos",
    status: "in_progress",
    assignee: "Pablo V.",
  },
  {
    id: "task-2",
    title: "Pruebas de Carga en Servidor Staging",
    tag: "QA / Testing",
    status: "review",
    assignee: "Pablo V.",
  },
  {
    id: "task-3",
    title: "Configuración Bot de WhatsApp & Meta Business",
    tag: "Automatización",
    status: "todo",
    assignee: "Cliente",
  },
  {
    id: "task-4",
    title: "Entrega de Propuesta Formal de 1 Página",
    tag: "Contrato",
    status: "done",
    assignee: "Pablo V.",
  },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [teamCount, setTeamCount] = useState(3);
  const maxTeamLimit = 5;

  const handleInvite = () => {
    if (teamCount < maxTeamLimit) {
      setTeamCount((prev) => prev + 1);
    }
  };

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const columns: { id: Task["status"]; label: string; icon: typeof Clock }[] = [
    { id: "todo", label: "Por Hacer", icon: AlertCircle },
    { id: "in_progress", label: "En Progreso", icon: Clock },
    { id: "review", label: "Revisión Staging", icon: Clock },
    { id: "done", label: "Listo / Producción", icon: CheckCircle },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Barra de Equipo y Límites */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#526072]/20 bg-[#FAF8F5] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E2430] text-[#25D366]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
              Tablero de Tareas Operativas
            </span>
            <p className="text-xs text-[#526072]">
              Seguimiento asíncrono y transparente de requerimientos pactados en tu propuesta.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#526072]/20 bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#111827]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              Equipo: {teamCount}/{maxTeamLimit} cupos utilizados
            </span>
          </div>

          <button
            type="button"
            onClick={handleInvite}
            disabled={teamCount >= maxTeamLimit}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold shadow-sm transition-all ${
              teamCount >= maxTeamLimit
                ? "border border-[#526072]/20 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border border-[#1E2430] bg-[#1E2430] text-white hover:bg-[#111827] active:scale-95"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{teamCount >= maxTeamLimit ? "Límite Alcanzado" : "Invitar (+1)"}</span>
          </button>
        </div>
      </div>

      {/* Grid de 4 Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#526072]/20 bg-[#FAF8F5]/60 p-4"
            >
              <div className="flex items-center justify-between border-b border-[#526072]/15 pb-2">
                <div className="flex items-center gap-2">
                  <ColIcon className="h-4 w-4 text-[#1E2430]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                    {col.label}
                  </span>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-[#526072] border border-[#526072]/20">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 min-h-[160px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col justify-between rounded-xl border border-[#526072]/20 bg-white p-3.5 shadow-sm transition-all hover:border-[#1E2430]/40 hover:shadow-md"
                  >
                    <div>
                      <span className="rounded bg-[#526072]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1E2430]">
                        {task.tag}
                      </span>
                      <h4 className="mt-2 text-xs font-bold text-[#111827]">
                        {task.title}
                      </h4>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#526072]/10 pt-2 text-[10px] text-[#526072]">
                      <span>Asignado: {task.assignee}</span>
                      <div className="flex gap-1">
                        {col.id !== "done" && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus: Record<Task["status"], Task["status"]> = {
                                todo: "in_progress",
                                in_progress: "review",
                                review: "done",
                                done: "done",
                              };
                              moveTask(task.id, nextStatus[col.id]);
                            }}
                            className="font-mono font-bold text-[#1E2430] hover:underline"
                            title="Avanzar etapa"
                          >
                            Avanzar →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
