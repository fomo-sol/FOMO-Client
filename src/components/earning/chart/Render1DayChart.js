import { useRef, useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import { getStockDataByDate, getStockData } from "@/services/earning-service";

export function Render1DayChart({ symbol, fomcDates = [] }) {
  // 기존 1day 차트의 모든 코드 (useRef, useEffect 등)
  // ... 기존 chart.js의 1day 차트 코드 전체를 이 함수로 이동 ...
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const lineOpenRef = useRef(null);
  const lineCloseRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const isFetchingRef = useRef(false);
  const trendLinesRef = useRef([]);
  const maLineRefs = useRef([]); // MA 시리즈들
  const logicalRangeRef = useRef(null);
  const fomcLinesRef = useRef([]); // FOMC 수직선들

  const [tooltip, setTooltip] = useState(null);
  const [localStockData, setLocalStockData] = useState([]);
  const localStockDataRef = useRef(localStockData);
  const [clickPoints, setClickPoints] = useState([]);
  const [maVisible, setMaVisible] = useState({
    5: true,
    20: true,
    60: true,
    120: true,
  });
  const [fomcVisible, setFomcVisible] = useState({
    fed: true, // 금리 결정
    minutes: true, // 의사록
  });

  // FOMC 날짜를 차트에 마커로 표시하는 함수
  function drawFomcMarkers() {
    if (!chartRef.current || !lineOpenRef.current || !fomcDates.length) return;

    // 오늘 날짜(yyyy-mm-dd)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    // 마커 데이터 생성
    const markers = fomcDates
      .map((dateObj) => {
        const date = dateObj.fed_release_date || dateObj.minutes_release_date;
        if (!date) return null;
        const dateStr = new Date(date).toISOString().split("T")[0];
        if (dateStr > todayStr) return null; // 미래 날짜 제외

        // 토글 상태 확인
        if (dateObj.fed_release_date && !fomcVisible.fed) return null;
        if (dateObj.minutes_release_date && !fomcVisible.minutes) return null;

        return {
          time: dateStr,
          position: "belowBar",
          color: dateObj.fed_release_date ? "#ff0000" : "#00ff00", // 더 눈에 띄는 색상
          shape: "circle",
        };
      })
      .filter(Boolean);

    // 마커 추가
    lineOpenRef.current.setMarkers(markers);
  }

  // fomcVisible이 바뀔 때마다 마커 즉시 업데이트
  useEffect(() => {
    if (chartRef.current && lineOpenRef.current) {
      drawFomcMarkers();
    }
  }, [fomcVisible]);

  // fomcDates, localStockData가 바뀔 때마다 마커 추가
  useEffect(() => {
    drawFomcMarkers();
  }, [fomcDates, localStockData]);

  // symbol이 바뀔 때마다 데이터 fetch
  useEffect(() => {
    if (!symbol) return;
    async function fetchData() {
      try {
        const res = await getStockData(symbol);
        if (res?.output2) {
          setLocalStockData(res.output2.reverse());
        } else {
          setLocalStockData([]);
        }
      } catch (e) {
        setLocalStockData([]);
      }
    }
    fetchData();
  }, [symbol]);

  useEffect(() => {
    localStockDataRef.current = localStockData;
  }, [localStockData]);

  function formatDate(xymd) {
    return `${xymd.slice(0, 4)}-${xymd.slice(4, 6)}-${xymd.slice(6, 8)}`;
  }

  function getTimestamp(xymd) {
    return new Date(formatDate(xymd)).getTime() / 1000;
  }

  // 이동평균선 계산 함수
  function calcMA(data, period) {
    return data
      .map((item, idx, arr) => {
        if (idx < period - 1) return null;
        const sum = arr
          .slice(idx - period + 1, idx + 1)
          .reduce((acc, cur) => acc + Number(cur.clos), 0);
        return {
          time: formatDate(item.xymd),
          value: +(sum / period).toFixed(2),
        };
      })
      .filter(Boolean);
  }

  function drawTrendLine(p1, p2) {
    const trendSeries = chartRef.current.addLineSeries({
      color: "orange",
      lineWidth: 2,
      priceLineVisible: false,
      crossHairMarkerVisible: false,
    });
    trendSeries.setData([p1, p2]);

    const clickHandler = (param) => {
      const price = param.seriesPrices.get(trendSeries);
      if (price !== undefined) {
        chartRef.current.removeSeries(trendSeries);
        trendLinesRef.current = trendLinesRef.current.filter(
          (s) => s !== trendSeries
        );
        chartRef.current.unsubscribeClick(clickHandler);
      }
    };

    chartRef.current.subscribeClick(clickHandler);
    trendLinesRef.current.push(trendSeries);
  }

  // MA legend configs
  const maConfigs = [
    { period: 5, color: "rgba(255,215,0,0.4)", label: "5일선" }, // 진노랑
    { period: 20, color: "rgba(0,191,255,0.4)", label: "20일선" }, // 진파랑
    { period: 60, color: "rgba(255,105,180,0.4)", label: "60일선" }, // 진핑크
    { period: 120, color: "rgba(50,205,50,0.4)", label: "120일선" }, // 진연두
  ];

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
    });
    chartRef.current = chart;

    lineOpenRef.current = chart.addLineSeries({
      color: "#bca8ff", // 기존 보라 계열보다 더 밝고 선명
      lineWidth: 2,
    });
    lineCloseRef.current = chart.addLineSeries({
      color: "#7cff9e", // 기존 초록 계열보다 더 형광 느낌으로 대비 강조
      lineWidth: 2,
    });
    volumeSeriesRef.current = chart.addHistogramSeries({
      priceScaleId: "",
      priceFormat: { type: "volume" },
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    // MA 시리즈 추가 (5, 20, 60, 120)
    maLineRefs.current = maConfigs.map((cfg) =>
      chart.addLineSeries({
        color: cfg.color,
        lineWidth: 1.5,
        priceLineVisible: false,
        crossHairMarkerVisible: false,
        lastValueVisible: false,
        visible: maVisible[cfg.period],
      })
    );

    chart.applyOptions({ height: 250 });

    chart.subscribeClick((param) => {
      if (!param.time || !param.seriesPrices) return;
      const price = param.seriesPrices.get(lineOpenRef.current);
      if (price === undefined) return;

      const newPoint = { time: param.time, value: price };

      setClickPoints((prev) => {
        if (prev.length === 1) {
          drawTrendLine(prev[0], newPoint);
          return [];
        }
        return [newPoint];
      });
    });

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setTooltip(null);
        return;
      }
      const time = param.time;
      const point = param.point;
      const idx = localStockDataRef.current.findIndex(
        (d) => formatDate(d.xymd) === time
      );
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
              (nd) =>
                !localStockDataRef.current.some((sd) => sd.xymd === nd.xymd)
            );
            if (filtered.length > 0) {
              setLocalStockData((prev) => [...filtered, ...prev]);
              setTimeout(() => {
                // logicalRange 보정
                if (logicalRangeRef.current) {
                  const added = filtered.length;
                  chartRef.current.timeScale().setVisibleLogicalRange({
                    from: logicalRangeRef.current.from + added,
                    to: logicalRangeRef.current.to + added,
                  });
                }
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
      chartRef.current
        .timeScale()
        .unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
      chartRef.current.remove();
      chartRef.current = null;
    };
  }, [symbol, fomcDates]);

  // MA 토글에 따라 visible 옵션 동기화
  useEffect(() => {
    maConfigs.forEach(({ period }, idx) => {
      if (maLineRefs.current[idx]) {
        maLineRefs.current[idx].applyOptions({
          visible: !!maVisible[period],
        });
      }
    });
  }, [maVisible]);

  useEffect(() => {
    if (!chartRef.current || localStockData.length === 0) return;

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
        color:
          curVol > prevVol
            ? "rgba(255, 127, 127, 0.3)"
            : "rgba(135, 206, 250, 0.3)",
      };
    });

    lineOpenRef.current.setData(openData);
    lineCloseRef.current.setData(closeData);
    volumeSeriesRef.current.setData(volumeData);

    // MA 데이터 세팅
    const maPeriods = [5, 20, 60, 120];
    maPeriods.forEach((period, idx) => {
      if (maLineRefs.current[idx]) {
        const maData = calcMA(localStockData, period);
        maLineRefs.current[idx].setData(maData);
      }
    });
  }, [localStockData, fomcDates]);

  function formatVolume(value) {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toString();
  }

  return (
    <div style={{ position: "relative", width: "600px" }}>
      {/* MA legend */}
      <div className="absolute top-2 left-2 flex gap-3 z-10 bg-black/40 rounded px-2 py-1">
        {maConfigs.map(({ period, color, label }, idx) => (
          <label
            key={period}
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: color }}
            />
            <span className="text-xs text-white">{label}</span>
            <input
              type="checkbox"
              checked={maVisible[period]}
              onChange={() =>
                setMaVisible((v) => ({ ...v, [period]: !v[period] }))
              }
              className="accent-blue-500 cursor-pointer"
            />
          </label>
        ))}
      </div>

      {/* FOMC 이벤트 토글 */}
      {fomcDates.length > 0 && (
        <div className="absolute right-18 z-10 bg-black/40 rounded">
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: "#ff0000" }}
            />
            <span className="text-xs text-white w-12">금리 결정</span>
            <input
              type="checkbox"
              checked={fomcVisible.fed}
              onChange={() => setFomcVisible((v) => ({ ...v, fed: !v.fed }))}
              className="accent-red-500 cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: "#00ff00" }}
            />
            <span className="text-xs text-white w-12">의사록</span>
            <input
              type="checkbox"
              checked={fomcVisible.minutes}
              onChange={() =>
                setFomcVisible((v) => ({ ...v, minutes: !v.minutes }))
              }
              className="accent-green-500 cursor-pointer"
            />
          </label>
        </div>
      )}
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
