// Nombre del caché
const CACHE_NAME = 'level-rp-payment-organizer-cache-v1';
// Recursos que queremos que se almacenen en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  // Añadir otros recursos como imágenes, etc.
];

// Instalación del Service Worker y precarga del caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta las peticiones y devuelve los recursos desde el caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // El recurso está en caché, lo devolvemos
        if (response) {
          return response;
        }

        // Si el recurso no está en caché, intentamos la petición normalmente
        return fetch(event.request);
      }
    )
  );
});

// Activación del Service Worker y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Borrar los cachés que no están en la lista blanca
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
