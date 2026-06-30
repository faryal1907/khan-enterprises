const fs = require('fs');
const path = require('path');

// Firebase config - these are public values safe to expose
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC46MqMT83z35W-uT-F6vhithriQwzeTJk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'khan-enterprises-b39cb.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'khan-enterprises-b39cb',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'khan-enterprises-b39cb.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1031513194816',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1031513194816:web:1fbf1023d26a838c18faa5',
};

const swContent = `
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: '${firebaseConfig.apiKey}',
  authDomain: '${firebaseConfig.authDomain}',
  projectId: '${firebaseConfig.projectId}',
  storageBucket: '${firebaseConfig.storageBucket}',
  messagingSenderId: '${firebaseConfig.messagingSenderId}',
  appId: '${firebaseConfig.appId}',
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
`;

const publicDir = path.join(__dirname, '..', 'public');
const swPath = path.join(publicDir, 'firebase-messaging-sw.js');

fs.writeFileSync(swPath, swContent.trim());
console.log('Firebase service worker generated successfully');
