// sw.js

self.addEventListener('push', function(event) {
    let data = { 
        title: 'CRICTON Live', 
        body: 'লাইভ ম্যাচ উপভোগ করুন!',
        icon: 'https://cdn-icons-png.flaticon.com/512/3074/3074058.png',
        image: '', // বড় ছবির জন্য
        url: 'https://cricton.top/'
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || 'https://cdn-icons-png.flaticon.com/512/3074/3074058.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3074/3074058.png',
        image: data.image || null, // বড় ব্যানার ছবি শো করবে
        vibrate: [100, 50, 100],
        data: {
            url: data.url || 'https://cricton.top/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
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
