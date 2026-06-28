importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCZ8IjPWB6xfHbhwGeM53kmOn2H5-eGu98",
  authDomain: "gs-dispatcher-notification.firebaseapp.com",
  projectId: "gs-dispatcher-notification",
  storageBucket: "gs-dispatcher-notification.firebasestorage.app",
  messagingSenderId: "889504306794",
  appId: "1:889504306794:web:3aa12466e2dcbfcb3c5c13"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "https://i.postimg.cc/NMRDPgT5/GS-dispacer.jpg"
    }
  );
});
