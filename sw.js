// Plantilla de Service Worker

// 1.- Nombre y archivos a cachear 
const CACHE_NAME= "mi-pwa-cache-v1"; //Nombre de la app
const BASE_PATH="";
const urlsCache=[
    `${BASE_PATH}index.html`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`,
   // "index.html",
   // "style.css",
   // "app.js", //Archivo del arrance de la app
   // "offline.html", // Pagina de error 404 es obligatoria porque no usa internet

];

// 2.- Install  -> el evento que se ejecuta al instalar el SW
// Se dispara la pimera ve que se registra el service worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsCache))
    );
});

// 3.- ACTIVATE -> este evento se ejecuta al activarse, debe limpiar caches viejas
// se dispara cuando el sw se activa ESTA EN EJECUCION
self.addEventListener("activate", event =>{
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key=>caches.delete(key))))
    );
});

// 4.- FETCH -> intercepta las peticiones de la PWA
// Intercepta cada peticion de cada pagina de la PWA 
// Busca la primera cache 
// Si el recurso no esta va a la red 
// Si falla TODO, muestra la pagina Offline.html 
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(
                ()=>caches.match(`${BASE_PATH}offline.html`));
        })
    )
});

// 5.- PUSH -> notificaciones en segundo plano OPCIONAL
self.addEventListener("push", event => {
    const data = event.data ? event.data.text(): "Notificacion sin datos";
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification("Mi PWA", {body: data})
    );
});

//Opcional:
//    SYNC -> sincronizacion en segundo plano
//    Manejo de eventos de APIs que el navegador soporte
