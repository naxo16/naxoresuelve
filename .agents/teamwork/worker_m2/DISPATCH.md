## 2026-10-18T06:35:29Z

You are Worker M2 (Frontend UI/UX & Customer Portal Worker) for the 'naxoresuelve' platform overhaul.
Your working directory is: C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\worker_m2

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read:
1. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\ORIGINAL_REQUEST.md
2. C:\Apache64\Apache24\htdocs\naxoresuelve\PROJECT.md
3. C:\Apache64\Apache24\htdocs\naxoresuelve\AGENTS.md
4. C:\Apache64\Apache24\htdocs\naxoresuelve\GEMINI.md
5. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\explorer_survey_2\handoff.md
6. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\explorer_survey_2\analysis.md

WRITE OWNERSHIP:
You EXCLUSIVELY own files in `C:\Apache64\Apache24\htdocs\naxoresuelve\apps\web\src\` (including components and app routes).
Do NOT modify `apps/api/` or `tests/`.

YOUR TASKS:
1. Resolve all 14 ESLint Errors and Warnings in `apps/web`:
   Run `npm run lint` in `apps/web` to see the errors. Fix each one:
   - `ModernCanvasVideoPlayer.tsx`: Fix `renderCanvasFrame` ordering/useCallback before usage; escape unescaped double quotes `"` as `&quot;`.
   - `CyberLateralSidebar.tsx`: Fix `setLang(saved)` state update in effect; wrap `document.documentElement.lang` in proper effect; fix `closeSidebar()` declaration order; fix JSX comment syntax `{/* ... */}` instead of raw comments.
   - `AuditModal.tsx`: Fix `setTopic(preselectedTopic)` in effect.
   - `ThreeArchitectureNode.tsx`: Fix `setHasWebGLError(true)` inside useEffect.
   - `SdlcLifecycleCarousel.tsx`: Fix JSX comments; clean unused imports.
   - `page.tsx`: Escape unescaped double quotes `&quot;`.
   Keep iterating until `npm run lint` exits with code 0!
2. Create Customer Portal Page (`apps/web/src/app/portal/page.tsx`):
   - Private client dashboard for authenticated users.
   - Display customer request tracking (`solicitudes`) with status badges (Pendiente, En Proceso, Completado, Rechazado).
   - Display technical audit visualizer (`auditorías`) showing OWASP compliance, SSL/TLS grade, latency, and system health.
   - Clean, modular code, strict TypeScript, ARIA accessibility, WCAG AAA color contrast (pure white on `#0a0c10`/`#141822`, accents `#721828` and `#cba135`).
   - Graceful fallback: reads JWT from localStorage/cookie; if offline or unauthenticated, provides sample dashboard view or friendly redirect to `/login`.
   - Action buttons: "Nueva Solicitud", "Descargar Informe PDF/Audit", "Cerrar Sesión", "Volver al Inicio".
3. Add GitHub Social Button & Portal Redirect in `apps/web/src/app/login/page.tsx`:
   - Add GitHub button alongside Google, Facebook, Instagram, Microsoft in social login buttons with GitHub SVG icon.
   - Upon successful login, display clear button "Ir al Portal de Clientes" navigating to `/portal`.
4. Link Sidebar Navigation:
   - In `apps/web/src/components/CyberLateralSidebar.tsx`, add "Portal Clientes" link navigating to `/portal`.
5. Maintain Color Palette Compliance:
   - Do NOT delete `--bg-dark: #3a3640` in `globals.css` (required by `test_media_and_navbar_integrity.py`).

VERIFICATION:
1. Run `npm run build` in `apps/web` -> must compile with code 0!
2. Run `npm run lint` in `apps/web` -> must exit with code 0!
3. Run `pytest -v` in project root -> all 79 tests must pass 100% green without regressions.
Deliver your completion report to `C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\worker_m2\handoff.md`.
Follow the Handoff Protocol (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
When finished, send a message to parent with summary and file path.
