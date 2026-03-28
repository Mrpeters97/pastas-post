// Service Worker for Pastas Post Push Notifications

self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'Pastas Post';
    const options = {
        body: data.body || 'Miaauww! Pasta heeft je een bericht gestuurd',
        icon: 'Styling/Logo.svg',
        badge: 'Styling/Logo.svg',
        tag: 'pastas-post-notification',
        requireInteraction: false,
        vibrate: [200, 100, 200],
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Klik op notificatie → opent app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(() => {
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
