import { useEffect, useRef, useCallback } from "react";

// 전역 WebSocket 연결 관리
const globalWebSocket = {
  ws: null,
  subscribers: new Map(), // symbol -> Set of callbacks
  isConnecting: false,
  reconnectTimeout: null,
  subscribedSymbols: new Set(), // 이미 구독된 심볼들 추적
};

export function useWebSocket(symbol, onMessage) {
  const isSubscribed = useRef(false);
  const callbackRef = useRef(onMessage);
  const currentSymbolRef = useRef(null);

  // onMessage가 변경될 때마다 ref 업데이트
  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  // WebSocket 연결 함수
  const connectWebSocket = useCallback(() => {
    if (
      globalWebSocket.isConnecting ||
      globalWebSocket.ws?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    globalWebSocket.isConnecting = true;

    try {
      const ws = new WebSocket("ws://localhost:4000/wsClient");
      globalWebSocket.ws = ws;

      ws.onopen = () => {
        console.log(`[useWebSocket] Global WebSocket 연결 성공`);
        globalWebSocket.isConnecting = false;

        // 모든 구독된 심볼들 요청 (중복 제거)
        const symbols = Array.from(globalWebSocket.subscribers.keys());
        const uniqueSymbols = [...new Set(symbols)];
        uniqueSymbols.forEach((sym) => {
          if (!globalWebSocket.subscribedSymbols.has(sym)) {
            ws.send(
              JSON.stringify({
                type: "subscribe",
                symbol: sym,
                clientId: `global_${sym}`,
              })
            );
            globalWebSocket.subscribedSymbols.add(sym);
            console.log(`[useWebSocket] 심볼 구독 요청: ${sym}`);
          }
        });
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "realtime" && msg.symbol) {
            // 해당 심볼을 구독하는 모든 콜백 호출
            const callbacks = globalWebSocket.subscribers.get(msg.symbol);
            if (callbacks) {
              callbacks.forEach((callback) => {
                if (typeof callback === "function") {
                  callback(msg.data);
                }
              });
            }
          }
        } catch (e) {
          console.error("[useWebSocket] 메시지 파싱 오류:", e);
        }
      };

      ws.onerror = (err) => {
        console.warn("[useWebSocket] WebSocket 연결 에러:", err);
        globalWebSocket.isConnecting = false;
      };

      ws.onclose = (event) => {
        console.log(
          "[useWebSocket] WebSocket 연결 종료:",
          event.code,
          event.reason
        );
        globalWebSocket.isConnecting = false;
        globalWebSocket.ws = null;
        globalWebSocket.subscribedSymbols.clear(); // 구독 상태 초기화

        // 자동 재연결
        if (event.code !== 1000) {
          globalWebSocket.reconnectTimeout = setTimeout(() => {
            console.log("[useWebSocket] 재연결 시도...");
            connectWebSocket();
          }, 5000);
        }
      };
    } catch (error) {
      console.error("[useWebSocket] WebSocket 연결 실패:", error);
      globalWebSocket.isConnecting = false;
    }
  }, []);

  // 심볼 구독
  const subscribe = useCallback(
    (symbol, callback) => {
      console.log(`[useWebSocket] 구독 시도: ${symbol}`);
      if (!globalWebSocket.subscribers.has(symbol)) {
        globalWebSocket.subscribers.set(symbol, new Set());
      }
      globalWebSocket.subscribers.get(symbol).add(callback);

      // WebSocket이 연결되어 있고 아직 구독하지 않은 심볼이라면 요청
      if (
        globalWebSocket.ws?.readyState === WebSocket.OPEN &&
        !globalWebSocket.subscribedSymbols.has(symbol)
      ) {
        globalWebSocket.ws.send(
          JSON.stringify({
            type: "subscribe",
            symbol,
            clientId: `global_${symbol}`,
          })
        );
        globalWebSocket.subscribedSymbols.add(symbol);
        console.log(`[useWebSocket] 심볼 구독 요청 전송: ${symbol}`);
      } else if (!globalWebSocket.isConnecting && !globalWebSocket.ws) {
        console.log(`[useWebSocket] WebSocket 연결 시작: ${symbol}`);
        connectWebSocket();
      } else {
        console.log(`[useWebSocket] 이미 구독 중이거나 연결 중: ${symbol}`);
      }
    },
    [connectWebSocket]
  );

  // 심볼 구독 해제
  const unsubscribe = useCallback((symbol, callback) => {
    console.log(`[useWebSocket] 구독 해제 시도: ${symbol}`);
    const callbacks = globalWebSocket.subscribers.get(symbol);
    if (callbacks) {
      callbacks.delete(callback);
      console.log(
        `[useWebSocket] 콜백 제거됨: ${symbol}, 남은 콜백 수: ${callbacks.size}`
      );

      if (callbacks.size === 0) {
        globalWebSocket.subscribers.delete(symbol);
        console.log(`[useWebSocket] 모든 콜백 제거됨: ${symbol}`);

        // WebSocket이 연결되어 있다면 서버에 구독 해제 요청
        if (
          globalWebSocket.ws?.readyState === WebSocket.OPEN &&
          globalWebSocket.subscribedSymbols.has(symbol)
        ) {
          globalWebSocket.ws.send(
            JSON.stringify({
              type: "unsubscribe",
              symbol,
              clientId: `global_${symbol}`,
            })
          );
          globalWebSocket.subscribedSymbols.delete(symbol);
          console.log(`[useWebSocket] 심볼 구독 해제 요청 전송: ${symbol}`);
        } else {
          console.log(
            `[useWebSocket] WebSocket 연결이 없거나 이미 해제됨: ${symbol}`
          );
        }
      }
    } else {
      console.log(
        `[useWebSocket] 구독 목록에서 심볼을 찾을 수 없음: ${symbol}`
      );
    }
  }, []);

  useEffect(() => {
    if (!symbol || !callbackRef.current) return;

    // 이전 심볼이 있었다면 구독 해제
    if (currentSymbolRef.current && currentSymbolRef.current !== symbol) {
      console.log(
        `[useWebSocket] 심볼 변경: ${currentSymbolRef.current} -> ${symbol}`
      );
      unsubscribe(currentSymbolRef.current, callbackRef.current);
    }

    // 이미 구독 중인지 확인
    if (isSubscribed.current && currentSymbolRef.current === symbol) {
      return;
    }

    isSubscribed.current = true;
    currentSymbolRef.current = symbol;
    subscribe(symbol, callbackRef.current);

    return () => {
      isSubscribed.current = false;
      if (currentSymbolRef.current) {
        unsubscribe(currentSymbolRef.current, callbackRef.current);
        currentSymbolRef.current = null;
      }
    };
  }, [symbol, subscribe, unsubscribe]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (globalWebSocket.reconnectTimeout) {
        clearTimeout(globalWebSocket.reconnectTimeout);
      }
    };
  }, []);

  return {
    isConnected: globalWebSocket.ws?.readyState === WebSocket.OPEN,
    isConnecting: globalWebSocket.isConnecting,
  };
}
