// Service Worker IZITAILLE - Offline Cache & PWA
const CACHE_NAME = 'izitaille-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/app',
  '/app/connexion',
  '/manifest.json',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes non-GET ou API externes
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si réponse valide, mise en cache dynamique
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas de panne réseau, renvoyer depuis le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si ressource html introuvable, retourner l'accueil de l'app
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/app');
          }
          return new Response('Ressource indisponible hors ligne', { status: 503 });
        });
      })
  );
});
