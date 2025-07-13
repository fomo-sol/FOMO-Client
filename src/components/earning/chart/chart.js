"use client";

import React, { useEffect, useRef } from "react";
import { createChart, LineStyle } from "lightweight-charts";

export default function StockChart({ stockData }) {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const lineOpenRef = useRef(null);
    const lineCloseRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current || !stockData || stockData.length === 0) return;

        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                backgroundColor: "#ffffff",
                textColor: "#000",
            },
            grid: {
                vertLines: { color: "#e1e3e6" },
                horzLines: { color: "#e1e3e6" },
            },
            rightPriceScale: { borderColor: "#ccc" },
            timeScale: { borderColor: "#ccc" },
        });
        chartRef.current = chart;

        const lineOpen = chart.addLineSeries({
            color: "#8884d8",
            lineStyle: LineStyle.Solid,
            lineWidth: 2,
            title: "시가",
        });

        const lineClose = chart.addLineSeries({
            color: "#82ca9d",
            lineStyle: LineStyle.Solid,
            lineWidth: 2,
            title: "종가",
        });

        lineOpenRef.current = lineOpen;
        lineCloseRef.current = lineClose;

        const openData = stockData.map((item) => ({
            time: `${item.xymd.slice(0, 4)}-${item.xymd.slice(4, 6)}-${item.xymd.slice(6, 8)}`,
            value: Number(item.open),
        }));
        const closeData = stockData.map((item) => ({
            time: `${item.xymd.slice(0, 4)}-${item.xymd.slice(4, 6)}-${item.xymd.slice(6, 8)}`,
            value: Number(item.clos),
        }));

        lineOpen.setData(openData);
        lineClose.setData(closeData);

        function handleResize() {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        }
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [stockData]);

    return (
        <div
            ref={chartContainerRef}
            style={{ width: "600px", height: "400px" }}
        />
    );
}
