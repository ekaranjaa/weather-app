const staticCache = 'static_i';
const dynamicCache = 'dynamic_i';
const assets = [
   '/',
   '/favicon.ico',
   '/dist/bundle.js',
   '/dist/bundle.css',
   'https://kit.fontawesome.com/885fbd8d84.js',
   '/vendor/css/weather-icons.min.css',
   '/vendor/font/weathericons-regular-webfont.eot',
   '/vendor/font/weathericons-regular-webfont.svg',
   '/vendor/font/weathericons-regular-webfont.ttf',
   '/vendor/font/weathericons-regular-webfont.woff',
   '/vendor/font/weathericons-regular-webfont.woff2',
];
const limitCacheSize = (name, size) => {
   caches.open(name).then((cache) => {
      cache.keys().then((keys) => {
         if (keys.length > size) {
            cache.delete(keys[0]).then(limitCacheSize(name, size));
         }
      });
   });
};

self.addEventListener('install', (e) => {
   e.waitUntil(
      caches.open(staticCache).then((cache) => {
         cache.addAll(assets);
      })
   );
});

self.addEventListener('activate', (e) => {
   e.waitUntil(
      caches.keys().then((keys) => {
         Promise.all(
            keys
               .filter((key) => key !== staticCache)
               .map((key) => caches.delete(key))
         );
      })
   );
});

self.addEventListener('fetch', (e) => {
   if (!(e.request.url.indexOf('http') === 0) || e.request.method !== 'GET') {
      return;
   }

   e.respondWith(
      caches.match(e.request).then((cacheRes) => {
         return (
            cacheRes ||
            fetch(e.request).then(async (fetchRes) => {
               return await caches.open(dynamicCache).then((cache) => {
                  cache.put(e.request.url, fetchRes.clone());
                  limitCacheSize(dynamicCache, 20);
                  return fetchRes;
               });
            })
         );
      })
   );
});
