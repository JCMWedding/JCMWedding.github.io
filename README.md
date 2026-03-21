# Justin & Charlotte Wedding Memories

A static GitHub site built to celebrate the wedding of Justin and Charlotte MacKenzie

## Included pages

- `index.html` — landing page with the main focal photo
- `pages/ceremony.html` — ceremony photo gallery
- `pages/portraits.html` — portraits, family, and wedding party
- `pages/reception.html` — reception photos
- `pages/media.html` — wedding video, speeches, songs, and audio recordings
- `pages/slideshow.html` — slideshow images shown during the reception
- `pages/details.html` — date, venue, verse, wedding party, and order of service
- `pages/share.html` — thank-you page with invitation to send additional media

## Palette used

The site follows, as close as ppssible, the wedding palette:

- Wedding Blue `#2F56B3`
- Rose Ceremony Red `#8B1E2D`
- Ivory Lace `#F4EFEA`
- Veil White `#FCFBF8`
- Charcoal Suit `#44464D`
- Eucalyptus Sage `#7E8F82`
- Chapel Mist `#D8DDE3`
- Warm Stone `#B8ACA3`

Reference files are included in `assets/reference/`.

## Adding more photos

1. Put the new image files in the matching folder:
   - `assets/media/ceremony`
   - `assets/media/portraits`
   - `assets/media/reception`
   - `assets/media/slideshow`
2. Open `assets/js/data.js`
3. Add each file to the matching array with:
   - `src`
   - `title`
   - `caption`
   - `alt`

## Adding videos and audio

Use `assets/js/data.js` for the `videos` and `audio` arrays.

- For a video, set `src` to the media file path and optionally set `poster`
- For audio, set `src` to the audio file path
- If `src` is blank, the site shows a “coming soon” state

## Local preview

Because this site uses JavaScript data files, it is best previewed with a local web server instead of opening the HTML files directly.

```bash
python -m http.server
```

