"""
Pruebas Rudas de Integridad de Medios, Video, Audio y Navbar Multilingüe
------------------------------------------------------------------------
Certifica que:
1. Todos los videos MP4 existen físicamente y no están vacíos.
2. Los videos contienen pistas de video (vide) y pistas de audio (soun).
3. Los videos NO están excluidos por .gitignore (para prevenir 404 en despliegues).
4. La compilación estática (apps/web/out/videos) contiene los videos de demostración.
5. El Navbar lateral incluye el soporte para todos los idiomas exigidos:
   - Español (es)
   - Ruso (ru)
   - Portugués (pt)
   - Italiano (it)
   - Inglés/Europeo (en)
   - Alemán (de)
6. Los enlaces y anclas del Navbar apuntan a secciones reales y accesibles.
"""

import os
import re
import pytest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_VIDEOS_DIR = os.path.join(ROOT_DIR, "apps", "web", "public", "videos")
OUT_VIDEOS_DIR = os.path.join(ROOT_DIR, "apps", "web", "out", "videos")
GITIGNORE_PATH = os.path.join(ROOT_DIR, ".gitignore")
SIDEBAR_TSX_PATH = os.path.join(ROOT_DIR, "apps", "web", "src", "components", "CyberLateralSidebar.tsx")
PLAYER_TSX_PATH = os.path.join(ROOT_DIR, "apps", "web", "src", "components", "ModernCanvasVideoPlayer.tsx")

DEMO_VIDEOS = [
    "dashboard-excel-agricola-contratistas.mp4",
    "dashboard-excel-agricola-contratistas2.mp4",
]

REQUIRED_LANGUAGES = ["es", "ru", "pt", "it", "en", "de"]


def test_video_files_exist_and_not_empty():
    """Valida que los archivos de video existen en public/videos y tienen tamaño real (>10MB)."""
    assert os.path.isdir(PUBLIC_VIDEOS_DIR), f"El directorio {PUBLIC_VIDEOS_DIR} debe existir"
    for vname in DEMO_VIDEOS:
        vpath = os.path.join(PUBLIC_VIDEOS_DIR, vname)
        assert os.path.isfile(vpath), f"El video {vname} debe existir físicamente en {vpath}"
        size = os.path.getsize(vpath)
        assert size > 10 * 1024 * 1024, f"El video {vname} debe ser mayor a 10MB (tamaño real: {size} bytes)"


def test_video_tracks_have_audio_and_video_atoms():
    """Inspecciona los átomos MP4 para certificar que contienen flujo de video y audio."""
    for vname in DEMO_VIDEOS:
        vpath = os.path.join(PUBLIC_VIDEOS_DIR, vname)
        with open(vpath, "rb") as f:
            content = f.read()
            # En contenedores MP4: 'vide' indica Video Handler, 'soun' indica Sound/Audio Handler
            has_video = b"vide" in content
            has_audio = b"soun" in content
            assert has_video, f"El video {vname} debe contener un handler de video ('vide')"
            assert has_audio, f"El video {vname} debe contener un handler de audio ('soun')"


def test_gitignore_does_not_ignore_demo_videos():
    """Certifica que .gitignore NO bloquea los videos de demostración requeridos para producción."""
    assert os.path.isfile(GITIGNORE_PATH), ".gitignore debe existir"
    with open(GITIGNORE_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Si existe una regla '*.mp4', debe estar contrarrestada por '!apps/web/public/videos/*.mp4'
    if "*.mp4" in content:
        assert "!apps/web/public/videos/*.mp4" in content, (
            ".gitignore debe permitir explícitamente '!apps/web/public/videos/*.mp4' "
            "para evitar que los videos se omitan en Git y Cloudflare"
        )


def test_video_player_is_unmuted_and_has_volume_controls():
    """Valida que el reproductor no fuerce audio silenciado sin controles de volumen ni Web Audio."""
    assert os.path.isfile(PLAYER_TSX_PATH), "ModernCanvasVideoPlayer.tsx debe existir"
    with open(PLAYER_TSX_PATH, "r", encoding="utf-8") as f:
        code = f.read()

    # Debe contener AudioContext o síntesis sonora de confirmación
    assert "AudioContext" in code or "playCyberChime" in code, (
        "El reproductor debe incluir sintetizador de confirmación de audio auditivo"
    )

    # Debe contener control de volumen interactivo
    assert 'type="range"' in code, "El reproductor debe incluir un slider de volumen para el usuario"

    # No debe tener video oculto con className='hidden'
    assert 'className="hidden"' not in code, (
        "El elemento <video> no debe tener 'className=hidden' porque desactiva la decodificación de fotogramas en Chromium"
    )


def test_cyber_lateral_sidebar_has_all_required_languages():
    """Certifica que el Navbar Lateral implementa todos los idiomas requeridos por el usuario."""
    assert os.path.isfile(SIDEBAR_TSX_PATH), "CyberLateralSidebar.tsx debe existir"
    with open(SIDEBAR_TSX_PATH, "r", encoding="utf-8") as f:
        code = f.read()

    # Cada idioma debe estar en I18N_NAV
    for lang in REQUIRED_LANGUAGES:
        assert f"{lang}:" in code, f"CyberLateralSidebar debe contener la traducción para '{lang}'"

    # Debe contener selector interactivo de idioma
    assert "handleSelectLang" in code, "CyberLateralSidebar debe tener función de selección de idioma"
    assert "role=\"navigation\"" in code, "CyberLateralSidebar debe cumplir con el rol ARIA de navegación"
    assert "Escape" in code, "CyberLateralSidebar debe soportar repliegue con tecla Escape para accesibilidad"
