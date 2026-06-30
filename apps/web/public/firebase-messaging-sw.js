importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyC46MqMT83z35W-uT-F6vhithriQwzeTJk',
  authDomain: 'khan-enterprises-b39cb.firebaseapp.com',
  projectId: 'khan-enterprises-b39cb',
  storageBucket: 'khan-enterprises-b39cb.firebasestorage.app',
  messagingSenderId: '1031513194816',
  appId: '1:1031513194816:web:1fbf1023d26a838c18faa5',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  if (!payload.notification) {
    const notificationTitle = payload.data?.title || 'New Alert';
    const notificationOptions = {
      body: payload.data?.body || 'You have a new message.',
      icon: '/icon-192x192.png',
      data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});