// Nombre del caché
const CACHE_NAME = 'level-rp-payment-organizer-cache-v4'; // Cambia a v4
// Recursos que queremos que se almacenen en caché
const urlsToCache = [
  '/Level-RP-Payment-Organizer',
  '/Level-RP-Payment-Organizer/index.html',
  '/Level-RP-Payment-Organizer/css/styles.css',
  '/Level-RP-Payment-Organizer/js/main.js',
  '/Level-RP-Payment-Organizer/icons/icon-72x72.png',
  '/Level-RP-Payment-Organizer/icons/icon-96x96.png',
  '/Level-RP-Payment-Organizer/icons/icon-128x128.png',
  '/Level-RP-Payment-Organizer/icons/icon-144x144.png',
  '/Level-RP-Payment-Organizer/icons/icon-152x152.png',
  '/Level-RP-Payment-Organizer/icons/icon-192x192.png',
  '/Level-RP-Payment-Organizer/icons/icon-384x384.png',
  '/Level-RP-Payment-Organizer/icons/icon-512x512.png',
  '/Level-RP-Payment-Organizer/icons/icon-120x120.png',
  '/Level-RP-Payment-Organizer/icons/icon-180x180.png',
  '/Level-RP-Payment-Organizer/icons/icon-167x167.png'
];


// Estrategia de caché para recursos estáticos
function cacheStaticAssets(request) {
  return caches.match(request)
    .then(response => {
      if (response) {
        return response;
      }
      return fetch(request).then(newResponse => {
        if (!newResponse || newResponse.status !== 200 || newResponse.type !== 'basic') {
          return newResponse;
        }
        const responseToCache = newResponse.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(request, responseToCache);
          });
        return newResponse;
      });
    });
}

// Estrategia de caché para datos dinámicos
function cacheDynamicData(request) {
  return fetch(request)
    .then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      const responseToCache = response.clone();
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, responseToCache);
        });
      return response;
    })
    .catch(() => {
      return caches.match(request);
    });
}

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
  const request = event.request;

  // Puedes añadir lógica aquí para manejar diferentes tipos de peticiones de manera diferente
  // Por ejemplo, usar cacheStaticAssets para ciertos tipos de archivos y cacheDynamicData para otros
  event.respondWith(cacheStaticAssets(request));
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
