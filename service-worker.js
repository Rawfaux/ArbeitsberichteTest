// Service Worker = ein kleines Hintergrundprogramm, das der Browser
// separat von der eigentlichen Seite ausführt. Seine einzige Aufgabe
// hier: die App-Dateien einmal zwischenspeichern (cachen), damit sie
// beim nächsten Öffnen auch ohne Internetverbindung geladen werden.

const CACHE_NAME = 'arbeitsnachweis-cache-v2';
const ZU_CACHENDE_DATEIEN = [
  './arbeitsnachweis-erfassung.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Wird einmal beim ersten Besuch ausgeführt: Dateien herunterladen
// und im Cache ablegen.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ZU_CACHENDE_DATEIEN))
  );
  self.skipWaiting();
});

// Alte Cache-Versionen aufräumen, falls die App später aktualisiert wird
// (dazu einfach CACHE_NAME oben hochzählen, z.B. auf 'v2').
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((namen) =>
      Promise.all(namen.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Bei jeder Anfrage: erst schauen, ob die Datei im Cache liegt
// (funktioniert offline), sonst normal aus dem Internet laden.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((treffer) => treffer || fetch(event.request))
  );
});
