// 실적발표 관련 함수들

export async function getStockData(symbol) {
  return getStockDataByDate(symbol);
}

// 날짜 기준으로 100일 이전 데이터 불러오기 (BYMD: YYYYMMDD)
export async function getStockDataByDate(symbol, bymd) {
  symbol = symbol.toUpperCase();

  try {
    const query = bymd ? `SYMB=${symbol}&BYMD=${bymd}` : `SYMB=${symbol}`;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/earnings/hantu?${query}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}

// 분봉(실시간) 차트 데이터 조회
export async function getMinutesChart(symbol, keyb, nmin = 1, next = 1) {
  symbol = symbol.toUpperCase();
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/earnings/hantu/minutesChart?SYMB=${symbol}&NMIN=${nmin}&NEXT=${next}`;
    if (keyb !== undefined && keyb !== null) {
      url += `&KEYB=${keyb}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch minutes chart data:", error);
    return null;
  }
}

export function formatRevenue(value) {
  const num = typeof value === "bigint" ? Number(value) : Number(value);
  if (isNaN(num)) return "-";

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else {
    return num.toLocaleString();
  }
}
