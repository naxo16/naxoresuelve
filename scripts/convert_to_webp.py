#!/usr/bin/env python3
"""
Optimizador y Conversor Universal a WebP (Multihilo)
---------------------------------------------------
Convierte lotes masivos de imagenes (JPG, PNG, TIFF, BMP) a WebP ultra-optimizado.

Caracteristicas:
  - Procesamiento concurrente multihilo (10x mas rapido).
  - Preserva transparencia en imagenes PNG / RGBA.
  - Corrige automaticamente la rotacion EXIF de fotos de moviles.
  - Estadisticas detalladas en tiempo real (MB ahorrados y porcentaje).
  - Admite ejecucion interactiva (doble clic) o mediante argumentos CLI.
  - 100% compatible con terminales Windows (UTF-8 resiliente).

Uso:
  python scripts/convert_to_webp.py
  python scripts/convert_to_webp.py C:/ruta/mis_fotos --quality 80 --max-size 1920
"""

import argparse
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from PIL import Image, ImageOps

# Asegurar salida UTF-8 sin fallos en Windows cmd / PowerShell
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}


def process_single_image(
    file_path: Path,
    output_dir: Path | None,
    quality: int,
    max_size: int | None,
    delete_original: bool,
    lossless: bool,
) -> dict:
    """Procesa y convierte una imagen individual a WebP."""
    start_time = time.time()
    orig_size = file_path.stat().st_size

    try:
        # Determinar destino
        if output_dir:
            dest_path = output_dir / f"{file_path.stem}.webp"
        else:
            dest_path = file_path.parent / f"{file_path.stem}.webp"

        # Si el archivo original ya es el destino (recomprimir mismo webp)
        temp_dest = dest_path
        if file_path.resolve() == dest_path.resolve():
            temp_dest = dest_path.with_name(f"{file_path.stem}__temp.webp")

        with Image.open(file_path) as img:
            # 1. Corregir rotacion EXIF si proviene de camaras o celulares
            img = ImageOps.exif_transpose(img)

            # 2. Manejo de canales de color y transparencia
            if img.mode in ("RGBA", "LA") or (
                img.mode == "P" and "transparency" in img.info
            ):
                img = img.convert("RGBA")
            elif img.mode != "RGB":
                img = img.convert("RGB")

            # 3. Redimensionar si supera el limite maximo
            if max_size and (img.width > max_size or img.height > max_size):
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

            # 4. Guardar en formato WebP con optimizacion maxima (method=6)
            save_kwargs = {
                "format": "WEBP",
                "method": 6,
            }

            if lossless:
                save_kwargs["lossless"] = True
            else:
                save_kwargs["quality"] = quality

            temp_dest.parent.mkdir(parents=True, exist_ok=True)
            img.save(temp_dest, **save_kwargs)

        if temp_dest != dest_path:
            os.replace(temp_dest, dest_path)

        new_size = dest_path.stat().st_size

        # Si se solicito eliminar el original tras convertirlo
        if delete_original and file_path.resolve() != dest_path.resolve():
            file_path.unlink()

        return {
            "status": "ok",
            "file": file_path.name,
            "orig_size": orig_size,
            "new_size": new_size,
            "duration": time.time() - start_time,
        }

    except Exception as e:
        return {
            "status": "error",
            "file": file_path.name,
            "orig_size": orig_size,
            "new_size": orig_size,
            "error": str(e),
            "duration": time.time() - start_time,
        }


def convert_folder(
    input_path: Path,
    output_path: Path | None = None,
    quality: int = 82,
    max_size: int | None = None,
    recursive: bool = True,
    delete_original: bool = False,
    lossless: bool = False,
    max_workers: int = 8,
):
    """Escanea la carpeta y convierte todas las imagenes en paralelo."""
    if not input_path.exists():
        print(f"[ERROR] La ruta no existe: {input_path}")
        return

    # Buscar imagenes
    glob_pattern = "**/*" if recursive else "*"
    all_files = [
        p
        for p in input_path.glob(glob_pattern)
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    total_images = len(all_files)
    if total_images == 0:
        print(f"[INFO] No se encontraron imagenes compatibles en: {input_path}")
        return

    print("=" * 65)
    print(">> OPTIMIZADOR UNIVERSAL A WEBP (MULTIHILO)")
    print(f"Carpeta origen       : {input_path}")
    print(f"Total de imagenes    : {total_images}")
    print(f"Calidad WebP         : {quality}% {'(Lossless)' if lossless else ''}")
    if max_size:
        print(f"Dimension maxima     : {max_size}px")
    print(f"Hilos en paralelo    : {max_workers}")
    print("=" * 65)

    total_orig_bytes = 0
    total_new_bytes = 0
    success_count = 0
    fail_count = 0
    start_total_time = time.time()

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(
                process_single_image,
                img_path,
                output_path,
                quality,
                max_size,
                delete_original,
                lossless,
            ): img_path
            for img_path in all_files
        }

        for i, future in enumerate(as_completed(futures), start=1):
            res = future.result()
            if res["status"] == "ok":
                success_count += 1
                total_orig_bytes += res["orig_size"]
                total_new_bytes += res["new_size"]
                saved_pct = (
                    (1 - (res["new_size"] / max(res["orig_size"], 1))) * 100
                )
                print(
                    f"[{i}/{total_images}] OK: {res['file']} "
                    f"({res['orig_size'] / 1024:.1f} KB -> {res['new_size'] / 1024:.1f} KB | -{saved_pct:.1f}%)"
                )
            else:
                fail_count += 1
                print(f"[{i}/{total_images}] ERROR en {res['file']}: {res.get('error')}")

    total_duration = time.time() - start_total_time
    saved_bytes = total_orig_bytes - total_new_bytes
    total_saved_pct = (
        (saved_bytes / total_orig_bytes * 100) if total_orig_bytes > 0 else 0
    )

    print("\n" + "=" * 65)
    print("RESUMEN DEL PROCESAMIENTO")
    print(f"Convertidas con exito : {success_count} imagenes")
    if fail_count > 0:
        print(f"Fallidas              : {fail_count} imagenes")
    print(f"Tiempo transcurrido   : {total_duration:.2f} segundos")
    print(f"Velocidad de proceso  : {total_images / max(total_duration, 0.01):.1f} img/segundo")
    print(f"Peso original total   : {total_orig_bytes / (1024 * 1024):.2f} MB")
    print(f"Peso optimizado total : {total_new_bytes / (1024 * 1024):.2f} MB")
    print(f"Espacio ahorrado      : {saved_bytes / (1024 * 1024):.2f} MB ({total_saved_pct:.1f}% menos)")
    print("=" * 65)


def main():
    parser = argparse.ArgumentParser(
        description="Conversor y Optimizador Masivo de Imagenes a WebP."
    )
    parser.add_argument(
        "folder",
        nargs="?",
        default=None,
        help="Ruta de la carpeta con imagenes (ej. C:/mis_fotos o .)",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=None,
        help="Carpeta de destino (si se omite, se guardan en la misma carpeta)",
    )
    parser.add_argument(
        "-q",
        "--quality",
        type=int,
        default=82,
        help="Calidad de compresion WebP entre 1 y 100 (por defecto: 82)",
    )
    parser.add_argument(
        "-m",
        "--max-size",
        type=int,
        default=None,
        help="Redimensionar limite maximo de ancho/alto en pixeles (ej. 1920)",
    )
    parser.add_argument(
        "--no-recursive",
        action="store_true",
        help="No escanear subcarpetas (solo la carpeta principal)",
    )
    parser.add_argument(
        "--delete-original",
        action="store_true",
        help="Eliminar las imagenes originales tras convertirlas a WebP",
    )
    parser.add_argument(
        "--lossless",
        action="store_true",
        help="Compresion 100% sin perdida (ideal para diagramas o pixel art)",
    )
    parser.add_argument(
        "-w",
        "--workers",
        type=int,
        default=8,
        help="Cantidad de hilos concurrentes en paralelo (por defecto: 8)",
    )

    args = parser.parse_args()

    # Si se ejecuta sin argumentos (ej. doble clic o solo `python convert_to_webp.py`)
    target_folder = args.folder
    if not target_folder:
        user_input = input("Ingresa la ruta de la carpeta a procesar (o presiona Enter para carpeta actual): ").strip()
        target_folder = user_input if user_input else "."

    input_path = Path(target_folder).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve() if args.output else None

    convert_folder(
        input_path=input_path,
        output_path=output_path,
        quality=args.quality,
        max_size=args.max_size,
        recursive=not args.no_recursive,
        delete_original=args.delete_original,
        lossless=args.lossless,
        max_workers=args.workers,
    )


if __name__ == "__main__":
    main()
