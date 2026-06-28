import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging.js";

// Firebase Config
const firebaseConfig = {

  apiKey: "AIzaSyCZ8IjPWB6xfHbhwGeM53kmOn2H5-eGu98",

  authDomain: "gs-dispatcher-notification.firebaseapp.com",

  projectId: "gs-dispatcher-notification",

  storageBucket: "gs-dispatcher-notification.firebasestorage.app",

  messagingSenderId: "889504306794",

  appId: "1:889504306794:web:3aa12466e2dcbfcb3c5c13"

};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

Notification.requestPermission().then(permission => {

  if (permission === "granted") {

    getToken(messaging, {

      vapidKey: "BLutwEx4IG0D5mbOOM4O05gbkfEf7s8cyiGDVwWkpP_5q5DYcShVoXUeY6y8uiU7qy_aRZ38dF5l_QWX6DivvvI"

    }).then((token) => {

      console.log("FCM Token:", token);

    });

  }

});

onMessage(messaging, (payload) => {

  alert(payload.notification.title);

});
