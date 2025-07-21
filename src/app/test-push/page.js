'use client';

import axiosInstance from '@/services/axios-instance';
import { useEffect, useState } from 'react';
import { requestFcmToken, handleForegroundMessage } from '@/services/fcm-service';

export default function PushTestPage() {
    const [status, setStatus] = useState('');

    const sendPush = async () => {
        try {
            const res = await axiosInstance.post('/notifications/push-test');
            setStatus('✅ 전송 성공: ' + res.data.message);
        } catch (err) {
            console.error(err);
            setStatus('❌ 전송 실패');
        }
    };

    useEffect(() => {
        requestFcmToken();

        handleForegroundMessage((payload) => {
            alert(`${payload?.notification?.title}\n${payload?.notification?.body}`);
        });
    }, []);

    return (
        <main>
            <h1>🔔 푸시 알림 테스트 페이지</h1>
            <p>이 페이지에 접속하면 브라우저 알림 권한을 요청하고, 알림을 수신합니다.</p>
            <button onClick={sendPush}>📤 테스트 알림 보내기</button>
            <p>{status}</p>
        </main>
    );
}
