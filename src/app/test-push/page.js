'use client';

import { useEffect } from 'react';
import { requestFcmToken, handleForegroundMessage } from '@/services/fcm-service';

export default function PushTestPage() {
    useEffect(() => {
        // 브라우저 알림 권한 요청 및 토큰 서버 전송
        requestFcmToken();

        // 포그라운드 메시지 수신 처리
        handleForegroundMessage((payload) => {
            alert(`${payload?.notification?.title}\n${payload?.notification?.body}`);
        });
    }, []);

    return (
        <main>
            <h1>🔔 푸시 알림 테스트 페이지</h1>
            <p>이 페이지에 접속하면 브라우저 알림 권한을 요청하고, 알림을 수신합니다.</p>
        </main>
    );
}
