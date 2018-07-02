let staticCacheName = 'currency-converter-v2';
let contentImgsCache = 'currency-converter-imgs';
let allCaches = [
  staticCacheName,
  contentImgsCache
];

self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open('currency-converter-v2').then(function(cache) {
			return cache.addAll([
				'/',
				'index.html',
				'assets/font-awesome/css/font-awesome.css',
				'css/bootstrap.min.css',
				'js/bootstrap.min.js',
				'js/jquery-2.0.0.min.js',
				'https://free.currencyconverterapi.com/api/v5/countries',
				'https://free.currencyconverterapi.com/api/v5/currencies',
				]);
		})
	);
});

// ada

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          return cacheName.startsWith('currency-converter') &&
          !allCaches.includes(cacheName);
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
	// console.log(event.request.url);

	event.respondWith(
		caches.open('currency-converter-v2').then(function(cache){
			return caches.match(event.request).then(function(response){
				if (response) {
					return response;
				}
				return fetch(event.request).then(function(networkResponse) {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				});
			}).catch(function(error){
				console.error("Error in fetch handler:", error);
				throw error;
			});
		}) 

  	);
});

