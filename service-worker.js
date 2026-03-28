// Service Worker for Pastas Post Push Notifications

console.log('[SW] Service Worker loaded');

// Handle push events
self.addEventListener('push', (event) => {
    console.log('[SW] Push event received:', event);
    
    const data = event.data?.json() || {};
    const title = data.title || 'Miaauww!';
    const options = {
        body: data.body || 'Pasta heeft je een bericht gestuurd',
        icon: 'https://pastas-post.vercel.app/Styling/Logo.svg',
        badge: 'https://pastas-post.vercel.app/Styling/Logo.svg',
        tag: 'pastas-post-notification',
        requireInteraction: false,
        vibrate: [200, 100, 200],
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
            .then(() => console.log('[SW] Notification shown'))
            .catch(err => console.error('[SW] Notification error:', err))
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Try to focus existing window
            for (const client of clientList) {
                if (client.url === 'https://pastas-post.vercel.app/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window if none exists
            if (clients.openWindow) {
                return clients.openWindow('https://pastas-post.vercel.app/');
            }
        })
    );
});

// Handle install
self.addEventListener('install', (event) => {
    console.log('[SW] Service Worker installing');
    self.skipWaiting();
});

// Handle activate
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activating');
    event.waitUntil(clients.claim());
});
