// 실적발표 관련 함수들

export async function getStockData(symbol) {
  symbol = symbol.toUpperCase(); // Ensure the symbol is in uppercase
  try {
    const response = await fetch(
      `http://localhost:4000/api/hantu?SYMB=${symbol}`
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
