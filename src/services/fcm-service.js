// Firebase 클라이언트 초기화 및 푸시 토큰 요청 로직
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import axiosInstance from "@/services/axios-instance";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// 토큰 요청 및 서버 전송 함수
export const requestFcmToken = async () => {
    try {
        const supported = await isSupported(); // ✅ 브라우저에서만 true
        if (!supported) {
            console.warn("❌ FCM: 이 브라우저에서는 지원되지 않습니다.");
            return;
        }

        const messaging = getMessaging(app);
        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js'),
        });

        if (token) {
            console.log("✅ FCM 토큰:", token);

            await axiosInstance.post("/user/fcm", { token });
        }
    } catch (err) {
        console.error("❌ FCM 토큰 요청 실패:", err);
    }
};

export const handleForegroundMessage = async (callback) => {
    const supported = await isSupported();
    if (!supported) return;

    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
        console.log("📩 포그라운드 알림 수신:", payload);
        callback?.(payload);
    });
};
