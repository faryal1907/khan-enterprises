importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: new URL(location).searchParams.get('apiKey'),
  authDomain: new URL(location).searchParams.get('authDomain'),
  projectId: new URL(location).searchParams.get('projectId'),
  storageBucket: new URL(location).searchParams.get('storageBucket'),
  messagingSenderId: new URL(location).searchParams.get('messagingSenderId'),
  appId: new URL(location).searchParams.get('appId'),
};

// If parameters are not passed in URL, you could hardcode them here, 
// but it's better to pass them during registration if possible, or fallback to hardcoded if you prefer.
// For Next.js, passing via URL params during Service Worker registration is a common workaround 
// for using environment variables in a static JS file.

// We will assume the registration passes the config in the URL query string.
if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // FCM SDK automatically shows a notification if the payload contains `notification`.
    // We only need to manually call showNotification if it's a data-only payload without a `notification` block.
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
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
