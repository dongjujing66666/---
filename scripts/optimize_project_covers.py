from pathlib import Path
import re

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "src" / "project-covers"
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png"}
COVER_FILE_OVERRIDES = {
    "11云南白药插画节气海报": "云南白药插画节气海报头图.jpg",
}
TARGET_SIZE = (1440, 810)


def project_order(path: Path) -> int:
    match = re.match(r"(\d+)", path.name)
    return int(match.group(1)) if match else 0


def select_cover(project_dir: Path) -> Path | None:
    image_files = sorted(
        (path for path in project_dir.iterdir() if path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES),
        key=lambda path: path.name,
    )
    if not image_files:
        return None

    override = COVER_FILE_OVERRIDES.get(project_dir.name)
    if override:
        overridden = project_dir / override
        if overridden.exists():
            return overridden

    return next((path for path in image_files if "头图" in path.name or "封面" in path.name), image_files[0])


def export_cover(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        cover = ImageOps.fit(image, TARGET_SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        cover.save(destination, "JPEG", quality=86, optimize=True, progressive=True, subsampling=0)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    project_dirs = sorted(
        (path for path in ROOT.iterdir() if path.is_dir() and re.match(r"^\d+", path.name)),
        key=project_order,
    )

    exported = 0
    for project_dir in project_dirs:
        cover = select_cover(project_dir)
        if cover is None:
            continue

        destination = OUTPUT_DIR / f"{project_order(project_dir):02d}.jpg"
        export_cover(cover, destination)
        exported += 1
        print(f"{destination.relative_to(ROOT)} <- {cover.relative_to(ROOT)}")

    print(f"Exported {exported} optimized project covers.")


if __name__ == "__main__":
    main()
