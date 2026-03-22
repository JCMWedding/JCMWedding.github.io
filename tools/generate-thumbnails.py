#!/usr/bin/env python3
"""Generate web thumbnails for a single gallery folder.

Usage:
    python tools/generate-gallery-thumbnails.py assets/media/ceremony
    python tools/generate-gallery-thumbnails.py assets/media/slideshow --max-edge 640 --quality 84
"""
from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image, ImageOps

SUPPORTED_EXTS = {'.jpg', '.jpeg', '.png', '.webp'}


def build_thumbnail(src_path: Path, out_path: Path, max_edge: int, quality: int, overwrite: bool) -> bool:
    if out_path.exists() and not overwrite:
        return False

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src_path) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGB')
        elif im.mode == 'RGBA' and src_path.suffix.lower() in {'.jpg', '.jpeg'}:
            bg = Image.new('RGB', im.size, (255, 255, 255))
            bg.paste(im, mask=im.getchannel('A'))
            im = bg

        im.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)

        save_kwargs = {}
        suffix = src_path.suffix.lower()
        if suffix in {'.jpg', '.jpeg'}:
            if im.mode == 'RGBA':
                bg = Image.new('RGB', im.size, (255, 255, 255))
                bg.paste(im, mask=im.getchannel('A'))
                im = bg
            save_kwargs.update({'quality': quality, 'optimize': True, 'progressive': True})
        elif suffix == '.png':
            save_kwargs.update({'optimize': True})
        elif suffix == '.webp':
            save_kwargs.update({'quality': quality, 'method': 6})

        im.save(out_path, **save_kwargs)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description='Generate thumbnails inside a thumbs/ subfolder for a gallery folder.')
    parser.add_argument('folder', type=Path, help='Folder containing original gallery images')
    parser.add_argument('--max-edge', type=int, default=560, help='Longest thumbnail edge in pixels (default: 560)')
    parser.add_argument('--quality', type=int, default=82, help='JPEG/WebP quality (default: 82)')
    parser.add_argument('--overwrite', action='store_true', help='Overwrite existing thumbnails')
    args = parser.parse_args()

    folder = args.folder.resolve()
    if not folder.is_dir():
        raise SystemExit(f'Folder not found: {folder}')

    thumbs_dir = folder / 'thumbs'
    created = 0
    skipped = 0

    for src_path in sorted(folder.iterdir()):
        if not src_path.is_file():
            continue
        if src_path.parent.name == 'thumbs':
            continue
        if src_path.suffix.lower() not in SUPPORTED_EXTS:
            continue
        out_path = thumbs_dir / src_path.name
        if build_thumbnail(src_path, out_path, args.max_edge, args.quality, args.overwrite):
            created += 1
        else:
            skipped += 1

    print(f'Gallery folder: {folder}')
    print(f'Thumbnails folder: {thumbs_dir}')
    print(f'Created: {created}')
    print(f'Skipped: {skipped}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
