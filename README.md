# Justin & Charlotte Wedding Memories

A GitHub-hosted wedding site starter for Justin and Charlotte MacKenzie, styled around the wedding palette and ready for photos, video, audio, and shared memories.

## Included pages

- `index.html` — landing page with the main focal photo, title area, and verse
- `pages/ceremony.html` — ceremony photo gallery
- `pages/portraits.html` — portraits, family, and wedding party
- `pages/reception.html` — reception photos
- `pages/media.html` — wedding video, speeches, songs, and audio recordings
- `pages/slideshow.html` — slideshow images shown during the reception
- `pages/details.html` — date, venue, verse, wedding party, and order of service
- `pages/share.html` — thank-you page with invitation to send additional media or congratulations

## Gallery behaviour

All photo galleries are set up to:

- show lightweight thumbnails on the page first
- fall back to the original image if a thumbnail is missing
- open the full original image in the lightbox
- allow left/right cycling through the full gallery
- show an `Original` link below the lightbox image

The gallery pages use a masonry-style column layout so the page keeps the more natural mosaic presentation instead of uniform image rows.

## Thumbnail folders

For each photo gallery folder, place thumbnails in a `thumbs/` subfolder using the same filenames as the originals. Example:

- `assets/media/ceremony/ceremony-01.jpg`
- `assets/media/ceremony/thumbs/ceremony-01.jpg`

This works for:

- `assets/media/ceremony`
- `assets/media/portraits`
- `assets/media/reception`
- `assets/media/slideshow`

## Generating thumbnails

Use the included helper script:

```bash
python tools/generate-gallery-thumbnails.py assets/media/ceremony
python tools/generate-gallery-thumbnails.py assets/media/portraits
python tools/generate-gallery-thumbnails.py assets/media/reception
python tools/generate-gallery-thumbnails.py assets/media/slideshow
```

Default settings:

- longest edge: **560px**
- JPEG quality: **82**
- output folder: `thumbs/` inside the source folder

You can also override them:

```bash
python tools/generate-gallery-thumbnails.py assets/media/slideshow --max-edge 640 --quality 84
```

## Adding more photos

1. Put the full-size image files into the matching media folder.
2. Run the thumbnail script on that folder.
3. Open `assets/js/data.js`.
4. Add the new files to the matching array with at least:
   - `src`
   - `alt`
   - optional `title`
   - optional `caption`

You do not need to manually add `thumbSrc` unless you want to use a custom thumbnail path.

## Adding videos and audio

Use `assets/js/data.js` for:

- `weddingVideo`
- `receptionVideos`
- `audio`

The full wedding video is embedded from YouTube.

## Local preview

Because this site uses JavaScript data files, it is best previewed with a local web server instead of opening the HTML files directly.

```bash
python -m http.server
```
