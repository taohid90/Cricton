// ===================================================
// 1. FIREBASE MESSAGING SECTION (Push Notifications)
// ===================================================
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyD_HBGuQSh_GzqrHqHbgdaoBikLZsK3Qqs",
    authDomain: "new-all-f99f7.firebaseapp.com",
    databaseURL: "https://new-all-f99f7-default-rtdb.firebaseio.com",
    projectId: "new-all-f99f7",
    storageBucket: "new-all-f99f7.firebasestorage.app",
    messagingSenderId: "1069748173900",
    appId: "1:1069748173900:web:158d6336c0f4628133c8e9"
};

// Initialize Firebase inside Service Worker
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const messaging = firebase.messaging();

// রিসিভ করা নোটিফিকেশন ব্যাকগ্রাউন্ডে দেখানোর হ্যান্ডেলার
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Background Message:', payload);
    const notificationTitle = payload.notification.title || 'CRICTON Live';
    const notificationOptions = {
        body: payload.notification.body || 'New live sports update available!',
        icon: payload.notification.icon || 'https://i.postimg.cc/6q0pMkty/20260803-110152.jpg',
        data: {
            url: payload.data && payload.data.url ? payload.data.url : '/'
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// নোটিফিকেশনে চাপ দিলে ওয়েবসাইটের লিংকে নিয়ে যাওয়ার লজিক
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});


// ===================================================
// 2. PWA SERVICE WORKER SECTION (Your Original Code)
// ===================================================
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
