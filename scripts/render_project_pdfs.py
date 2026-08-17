from pathlib import Path

import pypdfium2 as pdfium


ROOT = Path(__file__).resolve().parents[1]
MAX_SCALE = 1.6
MIN_SCALE = 1.0
TARGET_WIDTH = 1600
JPEG_QUALITY = 82


def render_pdf(pdf_path: Path) -> int:
    output_dir = pdf_path.parent / 'web-pdf-pages'
    output_dir.mkdir(exist_ok=True)
    document = pdfium.PdfDocument(str(pdf_path))
    page_count = len(document)

    for index in range(page_count):
        page = document[index]
        page_width, _ = page.get_size()
        scale = min(MAX_SCALE, max(MIN_SCALE, TARGET_WIDTH / page_width))
        image = page.render(scale=scale).to_pil()

        if image.mode != 'RGB':
            image = image.convert('RGB')

        output_path = output_dir / f'page-{index + 1:03d}.jpg'
        image.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)

    print(f'{pdf_path.parent.name}: {page_count} pages rendered')
    return page_count


def main() -> None:
    total = 0
    for pdf_path in sorted(ROOT.glob('[0-9]*/*.pdf')):
        total += render_pdf(pdf_path)
    print(f'Complete: {total} PDF pages rendered as web images.')


if __name__ == '__main__':
    main()
