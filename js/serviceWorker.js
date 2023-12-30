// Nombre del caché
const CACHE_NAME = 'level-rp-payment-organizer-cache-v3'; // Cambia a v3
// Recursos que queremos que se almacenen en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
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
