import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { getStockDataByDate } from "@/services/earning-service";

export default function StockChart({ stockData, symbol }) {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const lineOpenRef = useRef(null);
    const lineCloseRef = useRef(null);
    const volumeSeriesRef = useRef(null);
    const isFetchingRef = useRef(false);

    const [tooltip, setTooltip] = useState(null);
    const [localStockData, setLocalStockData] = useState(stockData || []);
    const localStockDataRef = useRef(localStockData);

    // Sync localStockDataRef
    useEffect(() => {
        localStockDataRef.current = localStockData;
    }, [localStockData]);

    // Sync localStockData when prop changes
    useEffect(() => {
        setLocalStockData(stockData || []);
    }, [stockData]);

    function formatDate(xymd) {
        return `${xymd.slice(0, 4)}-${xymd.slice(4, 6)}-${xymd.slice(6, 8)}`;
    }
    function getTimestamp(xymd) {
        return new Date(formatDate(xymd)).getTime() / 1000;
    }

    // 최초 1회만 차트 생성
    useEffect(() => {
        if (!chartContainerRef.current || !symbol) return;

        if (chartRef.current) return; // 이미 생성됨

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: { backgroundColor: "#fff", textColor: "#000" },
            grid: { vertLines: { visible: false }, horzLines: { visible: false } },
            timeScale: { borderColor: "#ccc", timeVisible: true },
            rightPriceScale: { borderColor: "#ccc" },
        });
        chartRef.current = chart;

        lineOpenRef.current = chart.addLineSeries({ color: "#5a4db2", lineWidth: 2 });
        lineCloseRef.current = chart.addLineSeries({ color: "#2e8b57", lineWidth: 2 });
        volumeSeriesRef.current = chart.addHistogramSeries({
            priceScaleId: "",
            priceFormat: { type: "volume" },
            scaleMargins: { top: 0.85, bottom: 0 },
        });

        chart.subscribeCrosshairMove((param) => {
            if (!param.time || !param.point) {
                setTooltip(null);
                return;
            }
            const time = param.time;
            const point = param.point;
            const idx = localStockDataRef.current.findIndex((d) => formatDate(d.xymd) === time);
            if (idx === -1) {
                setTooltip(null);
                return;
            }
            const item = localStockDataRef.current[idx];
            setTooltip({
                x: point.x,
                y: point.y,
                data: {
                    date: time,
                    high: item.high,
                    low: item.low,
                    open: item.open,
                    close: item.clos,
                    volume: item.tvol,
                },
            });
        });

        const onVisibleTimeRangeChange = async () => {
            if (!chartRef.current) return;
            const range = chartRef.current.timeScale().getVisibleRange();
            if (!range) return;

            const from = typeof range.from === "number" ? range.from : new Date(range.from).getTime() / 1000;
            const oldest = localStockDataRef.current[0]?.xymd;
            if (!oldest) return;
            const oldestTimestamp = getTimestamp(oldest);
            const bufferSeconds = 86400;

            if (from <= oldestTimestamp + bufferSeconds) {
                if (isFetchingRef.current) return;
                isFetchingRef.current = true;
                try {
                    const data = await getStockDataByDate(symbol, oldest);
                    if (data?.output2) {
                        const newData = data.output2.reverse();
                        const filtered = newData.filter(
                            (nd) => !localStockDataRef.current.some((sd) => sd.xymd === nd.xymd)
                        );
                        if (filtered.length > 0) {
                            // 현재 스크롤 위치 저장
                            const scrollPos = chartRef.current.timeScale().scrollPosition();

                            setLocalStockData((prev) => [...filtered, ...prev]);

                            // 스크롤 위치 보정: 추가 데이터 개수만큼 밀어내기
                            setTimeout(() => {
                                chartRef.current.timeScale().scrollToPosition(scrollPos + filtered.length);
                            }, 0);
                        }
                    }
                } catch (e) {
                    console.error("Failed to load additional data:", e);
                } finally {
                    isFetchingRef.current = false;
                }
            }
        };

        chart.timeScale().subscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);

        return () => {
            if (!chartRef.current) return;
            chartRef.current.timeScale().unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
            chartRef.current.remove();
            chartRef.current = null;
        };
    }, [symbol]);

    // localStockData 바뀔 때마다 데이터만 갱신
    useEffect(() => {
        if (!chartRef.current) return;
        if (localStockData.length === 0) return;

        const openData = localStockData.map((item) => ({
            time: formatDate(item.xymd),
            value: Number(item.open),
        }));
        const closeData = localStockData.map((item) => ({
            time: formatDate(item.xymd),
            value: Number(item.clos),
        }));
        const volumeData = localStockData.map((item, i) => {
            const prev = localStockData[i - 1];
            const curVol = Number(item.tvol);
            const prevVol = i > 0 ? Number(prev.tvol) : curVol;
            return {
                time: formatDate(item.xymd),
                value: curVol,
                color: curVol > prevVol ? "rgba(255, 127, 127, 0.3)" : "rgba(135, 206, 250, 0.3)",
            };
        });

        lineOpenRef.current.setData(openData);
        lineCloseRef.current.setData(closeData);
        volumeSeriesRef.current.setData(volumeData);
    }, [localStockData]);

    function formatVolume(value) {
        if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
        if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
        return value.toString();
    }

    return (
        <div style={{ position: "relative", width: "600px", height: "400px" }}>
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
                    <div>날짜: {tooltip.data.date}</div>
                    <div>고가: {tooltip.data.high}</div>
                    <div>저가: {tooltip.data.low}</div>
                    <div>시가: {tooltip.data.open}</div>
                    <div>종가: {tooltip.data.close}</div>
                    <div>거래량: {formatVolume(tooltip.data.volume)}</div>
                </div>
            )}
        </div>
    );
}
