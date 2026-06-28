import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging.js";

// ================= FIREBASE CONFIG =================

const firebaseConfig = {

  apiKey: "AIzaSyCZ8IjPWB6xfHbhwGeM53kmOn2H5-eGu98",

  authDomain: "gs-dispatcher-notification.firebaseapp.com",

  projectId: "gs-dispatcher-notification",

  storageBucket: "gs-dispatcher-notification.firebasestorage.app",

  messagingSenderId: "889504306794",

  appId: "1:889504306794:web:3aa12466e2dcbfcb3c5c13"

};

// ================= INIT =================

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

// ================= REGISTER SERVICE WORKER =================

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")

    .then(async (registration) => {

      console.log("Service Worker berhasil didaftarkan.");

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {

        alert("Izin notifikasi ditolak.");

        return;

      }

      try {

        const token = await getToken(messaging, {

          vapidKey: "BLutwEx4IG0D5mbOOM4O05gbkfEf7s8cyiGDVwWkpP_5q5DYcShVoXUeY6y8uiU7qy_aRZ38dF5l_QWX6DivvvI",

          serviceWorkerRegistration: registration

        });

        if (token) {

          console.log("FCM Token:", token);

          // Nanti token ini bisa dikirim ke Google Apps Script

        } else {

          console.log("Token tidak tersedia.");

        }

      } catch (err) {

        console.error("Gagal mengambil token:", err);

      }

    })

    .catch(err => {

      console.error("Service Worker gagal:", err);

    });

}

// ================= SAAT WEB SEDANG DIBUKA =================

onMessage(messaging, (payload) => {

  console.log(payload);

  alert(payload.notification.title);

});
