import { useRef, useEffect, useState, useCallback } from "react";
import { createChart } from "lightweight-charts";
import { getMinutesChart } from "@/services/earning-service";
import { useWebSocket } from "../../../hooks/useWebSocket";

export default function StockLiveChart({ symbol }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const logicalRangeRef = useRef(null);
  const isFetchingRef = useRef(false);
  const lastRequestedKeybRef = useRef("");
  const didInitialScrollRef = useRef(false);
  const [tooltip, setTooltip] = useState(null);
  const [liveData, setLiveData] = useState([]);
  const liveDataRef = useRef(liveData);
  const [pendingPrepend, setPendingPrepend] = useState(0);

  // 실시간 데이터 관리를 위한 ref들 - symbol별로 고유하게 관리
  const currentMinuteRef = useRef(null);
  const currentCandleRef = useRef(null);

  // WebSocket 메시지 핸들러 (메모이제이션)
  const handleWebSocketMessage = useCallback(
    (data) => {
      console.log(`[StockLiveChart] 실시간 데이터 수신 (${symbol}):`, data);
      processRealtimeData(data);
    },
    [symbol]
  );

  // useWebSocket 훅 사용
  const { isConnected } = useWebSocket(symbol, handleWebSocketMessage);

  // symbol이 바뀔 때마다 ref 초기화
  useEffect(() => {
    // 모든 ref 초기화
    currentMinuteRef.current = null;
    currentCandleRef.current = null;
    didInitialScrollRef.current = false;
    isFetchingRef.current = false;
    lastRequestedKeybRef.current = "";
    logicalRangeRef.current = null;

    // 실시간 데이터 초기화
    setLiveData([]);
    setPendingPrepend(0);

    console.log(
      `[StockLiveChart] Symbol changed to ${symbol}, all refs and data reset`
    );
  }, [symbol]);

  useEffect(() => {
    liveDataRef.current = liveData;
  }, [liveData]);

  // 실시간 데이터를 1분봉으로 변환하는 함수
  const processRealtimeData = (realtimeData) => {
    const { localDate, localTime, bidPrice, askPrice } = realtimeData;

    // 현재 시간을 분 단위로 계산
    const year = Number(localDate.slice(0, 4));
    const month = Number(localDate.slice(4, 6)) - 1;
    const day = Number(localDate.slice(6, 8));
    const hour = Number(localTime.slice(0, 2));
    const minute = Number(localTime.slice(2, 4));

    const currentMinute = Math.floor(
      new Date(year, month, day, hour, minute).getTime() / 1000
    );

    const price = Number(bidPrice || askPrice);

    // 새로운 분이 시작되었는지 확인
    if (currentMinuteRef.current !== currentMinute) {
      // 이전 분봉이 있으면 저장
      if (currentCandleRef.current) {
        setLiveData((prev) => {
          const newData = [...prev];
          // 마지막 캔들을 업데이트하거나 새로 추가
          const lastIndex = newData.length - 1;
          if (
            lastIndex >= 0 &&
            newData[lastIndex].time === currentCandleRef.current.time
          ) {
            newData[lastIndex] = { ...currentCandleRef.current };
          } else {
            newData.push({ ...currentCandleRef.current });
          }
          return newData;
        });
      }

      // 새로운 분봉 시작
      currentCandleRef.current = {
        time: currentMinute,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 0, // 실시간 데이터에는 거래량 정보가 없으므로 0으로 설정
      };
      currentMinuteRef.current = currentMinute;
    } else {
      // 같은 분 내에서 가격 업데이트
      if (currentCandleRef.current) {
        currentCandleRef.current.high = Math.max(
          currentCandleRef.current.high,
          price
        );
        currentCandleRef.current.low = Math.min(
          currentCandleRef.current.low,
          price
        );
        currentCandleRef.current.close = price;
      }
    }

    // 실시간으로 차트 업데이트
    if (candleSeriesRef.current && currentCandleRef.current) {
      candleSeriesRef.current.update(currentCandleRef.current);
    }
  };

  // symbol이 바뀔 때마다 초기 데이터 fetch (딱 한 번만)
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      isFetchingRef.current = true;
      lastRequestedKeybRef.current = "";
      try {
        const json = await getMinutesChart(symbol, "", 1, 0); // NEXT=0 (최초 요청)
        if (!json || !json.output2) {
          if (!ignore) setLiveData([]);
          return;
        }
        const candles = (json.output2 || []).map((item) => {
          const year = Number(item.xymd.slice(0, 4));
          const month = Number(item.xymd.slice(4, 6)) - 1;
          const day = Number(item.xymd.slice(6, 8));
          const hour = Number(item.xhms.slice(0, 2));
          const min = Number(item.xhms.slice(2, 4));
          const sec = Number(item.xhms.slice(4, 6));
          const time = Math.floor(
            new Date(year, month, day, hour, min, sec).getTime() / 1000
          );
          return {
            time,
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.last),
            volume: Number(item.evol),
            xymd: item.xymd,
            xhms: item.xhms,
          };
        });
        candles.sort((a, b) => a.time - b.time);
        if (!ignore) setLiveData(candles);
      } finally {
        isFetchingRef.current = false;
      }
    }
    setLiveData([]); // 초기화
    didInitialScrollRef.current = false;
    fetchData();
    return () => {
      ignore = true;
    };
  }, [symbol]);

  // 차트/시리즈 생성 및 구독 (symbol 바뀔 때만)
  useEffect(() => {
    if (!chartContainerRef.current || !symbol) return;
    if (chartRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 250,
      layout: {
        background: { color: "#040816" },
        textColor: "#ffffff",
      },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      timeScale: { borderColor: "#ccc", timeVisible: true },
      rightPriceScale: { borderColor: "#ccc" },
      crosshair: { mode: 0 },
    });
    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#7cff9e", // 상승(초록)
      downColor: "#bca8ff", // 하락(파랑)
      borderUpColor: "#2e8b57",
      borderDownColor: "#5a4db2",
      wickUpColor: "#2e8b57",
      wickDownColor: "#5a4db2",
      borderVisible: true,
      wickVisible: true,
    });
    candleSeriesRef.current = candleSeries;

    chart.applyOptions({ height: 250 });

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setTooltip(null);
        return;
      }
      const time = param.time;
      const point = param.point;
      const item = liveDataRef.current.find((d) => d.time === time);
      if (!item) {
        setTooltip(null);
        return;
      }
      setTooltip({
        x: point.x,
        y: point.y,
        data: {
          date: new Date(time * 1000).toLocaleDateString("ko-KR"),
          time: new Date(time * 1000).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          high: item.high,
          low: item.low,
          open: item.open,
          close: item.close,
          volume: item.volume,
        },
      });
    });

    // 무한 스크롤: 왼쪽 끝 도달 시 과거 데이터 fetch
    const onVisibleTimeRangeChange = async () => {
      if (!chartRef.current) return;
      const logicalRange = chartRef.current
        .timeScale()
        .getVisibleLogicalRange();
      logicalRangeRef.current = logicalRange;
      const range = chartRef.current.timeScale().getVisibleRange();
      if (!range) return;
      const from =
        typeof range.from === "number"
          ? range.from
          : new Date(range.from).getTime() / 1000;
      const oldest = liveDataRef.current[0];
      if (!oldest) return;
      const buffer = 60 * 5; // 5분 버퍼
      if (from <= oldest.time + buffer) {
        if (isFetchingRef.current) return;
        // KEYB 파라미터로 기존 데이터의 첫 분봉보다 5분 더 과거로 만들어서 요청
        const pad = (n) => n.toString().padStart(2, "0");
        const date = new Date((oldest.time - 300) * 1000); // 5분 더 과거
        const keyb =
          date.getFullYear().toString() +
          pad(date.getMonth() + 1) +
          pad(date.getDate()) +
          pad(date.getHours()) +
          pad(date.getMinutes()) +
          pad(date.getSeconds());
        if (lastRequestedKeybRef.current === keyb) return;
        isFetchingRef.current = true;
        lastRequestedKeybRef.current = keyb;
        try {
          const prevData = await getMinutesChart(symbol, keyb, 1, 1); // NEXT=1 (추가 요청)
          if (prevData?.output2) {
            const newCandles = prevData.output2.map((item) => {
              const year = Number(item.xymd.slice(0, 4));
              const month = Number(item.xymd.slice(4, 6)) - 1;
              const day = Number(item.xymd.slice(6, 8));
              const hour = Number(item.xhms.slice(0, 2));
              const min = Number(item.xhms.slice(2, 4));
              const sec = Number(item.xhms.slice(4, 6));
              const time = Math.floor(
                new Date(year, month, day, hour, min, sec).getTime() / 1000
              );
              return {
                time,
                open: Number(item.open),
                high: Number(item.high),
                low: Number(item.low),
                close: Number(item.last),
                volume: Number(item.evol),
                xymd: item.xymd,
                xhms: item.xhms,
              };
            });
            newCandles.sort((a, b) => a.time - b.time);
            // 중복 제거 + 오름차순 정렬
            const filtered = newCandles.filter(
              (nc) => !liveDataRef.current.some((d) => d.time === nc.time)
            );
            if (filtered.length > 0) {
              setLiveData((prev) => {
                const merged = [...filtered, ...prev];
                const unique = [];
                const seen = new Set();
                for (const d of merged) {
                  if (!seen.has(d.time)) {
                    unique.push(d);
                    seen.add(d.time);
                  }
                }
                unique.sort((a, b) => a.time - b.time);
                console.log("[StockLiveChart] prepend", {
                  filteredTimes: filtered.map((d) => d.time),
                  prevFirst: prev[0]?.time,
                  uniqueFirst: unique[0]?.time,
                  uniqueLength: unique.length,
                  prevLength: prev.length,
                  filteredLength: filtered.length,
                  prevTimes: prev.map((d) => d.time),
                  uniqueTimes: unique.map((d) => d.time),
                });
                return unique;
              });
              setPendingPrepend(filtered.length); // 논리적 범위 보정 예약
            }
          }
        } catch (e) {
          console.error("Failed to load additional minutes data:", e);
        } finally {
          isFetchingRef.current = false;
        }
      }
    };
    chart.timeScale().subscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);

    return () => {
      chartRef.current
        ?.timeScale()
        .unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [symbol]);

  // 데이터가 바뀔 때 차트에 반영 (차트/구독은 재생성 X)
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;
    if (liveData.length === 0) return;
    candleSeriesRef.current.setData(liveData);
    // 최초 렌더링 때만 scrollToRealTime()
    if (!didInitialScrollRef.current) {
      chartRef.current.timeScale().scrollToRealTime();
      didInitialScrollRef.current = true;
    }
  }, [liveData]);

  // 논리적 범위 보정 useEffect
  useEffect(() => {
    if (pendingPrepend > 0 && logicalRangeRef.current && chartRef.current) {
      const added = pendingPrepend;
      const from = logicalRangeRef.current.from + added;
      const to = logicalRangeRef.current.to + added;
      console.log("[StockLiveChart] setVisibleLogicalRange", {
        from,
        to,
        added,
        logicalRange: logicalRangeRef.current,
        pendingPrepend,
        liveDataLength: liveData.length,
      });
      chartRef.current.timeScale().setVisibleLogicalRange({ from, to });
      setPendingPrepend(0);
    }
  }, [liveData, pendingPrepend]);

  function formatVolume(value) {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toString();
  }

  return (
    <div style={{ position: "relative", width: "600px", height: "250px" }}>
      <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            pointerEvents: "none",
            fontSize: "12px",
            whiteSpace: "nowrap",
            zIndex: 1000,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
            {tooltip.data.date} {tooltip.data.time}
          </div>
          <div>
            고가: <span style={{ color: "#e74c3c" }}>{tooltip.data.high}</span>
          </div>
          <div>
            저가: <span style={{ color: "#3498db" }}>{tooltip.data.low}</span>
          </div>
          <div>
            시가: <span style={{ color: "#2ecc71" }}>{tooltip.data.open}</span>
          </div>
          <div>
            종가: <span style={{ color: "#f39c12" }}>{tooltip.data.close}</span>
          </div>
          <div>
            거래량:{" "}
            <span style={{ color: "#a3e635" }}>
              {formatVolume(tooltip.data.volume)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
