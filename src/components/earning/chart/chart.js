"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, LineStyle } from "lightweight-charts";

export default function StockChart({ stockData }) {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const [tooltip, setTooltip] = useState(null); // { x, y, data } or null

    function formatVolume(value) {
        if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
        if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
        return value.toString();
    }

    useEffect(() => {
        if (!chartContainerRef.current || stockData.length === 0) return;

        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: { backgroundColor: "#fff", textColor: "#000" },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            timeScale: { borderColor: "#ccc", timeVisible: true },
            rightPriceScale: { borderColor: "#ccc" },
        });

        chartRef.current = chart;

        const formatDate = (xymd) =>
            `${xymd.slice(0, 4)}-${xymd.slice(4, 6)}-${xymd.slice(6, 8)}`;

        const openData = stockData.map((item) => ({
            time: formatDate(item.xymd),
            value: Number(item.open),
        }));
        const closeData = stockData.map((item) => ({
            time: formatDate(item.xymd),
            value: Number(item.clos),
        }));

        const lineOpen = chart.addLineSeries({ color: "#5a4db2", lineWidth: 2 });
        const lineClose = chart.addLineSeries({ color: "#2e8b57", lineWidth: 2 });

        lineOpen.setData(openData);
        lineClose.setData(closeData);

        // 거래량 색상 전날 대비 비교
        const volumeData = stockData.map((item, i) => {
            const prev = stockData[i - 1];
            const curVol = Number(item.tvol);
            const prevVol = i > 0 ? Number(prev.tvol) : curVol;
            return {
                time: formatDate(item.xymd),
                value: curVol,
                color: curVol > prevVol ? "rgba(255, 127, 127, 0.3)" : "rgba(135, 206, 250, 0.3)",
            };
        });

        const volumeSeries = chart.addHistogramSeries({
            priceScaleId: "",
            priceFormat: { type: "volume" },
            scaleMargins: { top: 0.85, bottom: 0 },
        });

        volumeSeries.setData(volumeData);

        volumeSeries.autoscaleInfoProvider = () => {
            const max = Math.max(...volumeData.map((v) => v.value));
            return {
                priceRange: {
                    minValue: 0,
                    maxValue: max * 1.1,
                },
            };
        };

        // 툴팁 표시 이벤트 처리
        chart.subscribeCrosshairMove((param) => {
            if (!param.time || !param.point) {
                setTooltip(null);
                return;
            }

            const time = param.time;
            const point = param.point; // { x, y } 차트 내 좌표

            const idx = stockData.findIndex((d) => formatDate(d.xymd) === time);
            if (idx === -1) {
                setTooltip(null);
                return;
            }

            const item = stockData[idx];
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

        return () => {
            chart.remove();
        };
    }, [stockData]);

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
