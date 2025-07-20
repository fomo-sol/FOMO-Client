// 백그라운드 알림 처리용 서비스워커 (브라우저 직접 접근)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAgFqUZ63FwIQhkQODzQIZKCW9SJzCW3FQ",
    authDomain: "fomo-push-507b2.firebaseapp.com",
    projectId: "fomo-push-507b2",
    storageBucket: "fomo-push-507b2.firebasestorage.app",
    messagingSenderId: "346372034525",
    appId: "1:346372034525:web:47655a479d4c55e0f97034",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    const { title, body } = payload.notification;
    self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
    });
});