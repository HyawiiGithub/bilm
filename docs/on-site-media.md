Hosting on-site media for CineNova

This project now supports playing locally-hosted media from the viewer pages (movies and TV).

Why use on-site media?
- Avoids poor quality / ads from third-party providers
- Gives you full control over quality and playback experience

Where to place files
- Movies:
  - /media/movie/<TMDB_ID>/master.m3u8 (recommended for HLS)
  - /media/movie/<TMDB_ID>/index.m3u8
  - /media/movie/<TMDB_ID>.m3u8
  - /media/movie/<TMDB_ID>.mp4 (fallback)
  - /media/movie/<TMDB_ID>/video.mp4

- TV shows (per-episode builds):
  - /media/tv/<TMDB_ID>/master.m3u8
  - /media/tv/<TMDB_ID>/season-<S>/episode-<E>.m3u8 (optional)
  - /media/tv/<IMDB_ID>/master.m3u8 (if you prefer IMDB IDs)
  - /media/tv/<TMDB_ID>.mp4 or per-episode MP4 files as fallback

Notes & behavior
- The viewer will check common paths using HTTP HEAD requests when you press "Play on site." If a file is found, it will try to play it in a native player in-page.
- HLS (.m3u8) is supported. Where the browser does not support native HLS, hls.js is loaded from a CDN and used to attach the stream to the <video> element.
- MP4 files are used as a fallback when no HLS manifest is found.

Development tips
- When testing locally with the built-in dev-server, put test media into the repo under /media and open the viewer page in /cinenova/ (or root) to test.
- For best results, encode HLS playlists with multiple bitrate variants (master playlist) so the player can adapt.
- Ensure correct CORS headers when hosting media on a different domain or CDN.

Security and legal
- Only host and serve media you own or are licensed to distribute.
- Be mindful of copyright when uploading content to your hosting provider or public GitHub Pages — GitHub Pages is not intended for hosting large media files.

Example local path test
- Add a sample HLS at: /media/movie/12345/master.m3u8
- Open viewer: /movies/viewer.html?id=12345 → click "Play on site" → player will attempt to load /media/movie/12345/master.m3u8

If you'd like, I can:
- Add an on-load check to show/hide the "Play on site" button only when an on-site file exists
- Add an upload tool to help package and upload HLS to a CDN
- Move inline styles into a shared CSS file for better lint/accessibility
