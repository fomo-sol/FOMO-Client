"use client";

import { getStockData } from "@/services/earning-service";
import { useParams } from "next/navigation";
// chart 그리기 ㄱㅂㅈ~~
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function EarningReleasePage() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    async function fetchStockData() {
      try {
        const data = await getStockData(symbol);
        if (data?.output2) {
          console.log("Fetched stock data:", data.output2);
          setStockData(data.output2.reverse());
        } else {
          console.error("No output2 data received for symbol:", symbol);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }

    fetchStockData();
  }, [symbol]);

  return (
    <div className="p-6">
      ({symbol})
      <div>
        <h1 className="text-2xl font-bold">Chart for {symbol}</h1>
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={Object.values(stockData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xymd" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="open"
                stroke="#8884d8"
                name="시가"
              />
              <Line
                type="monotone"
                dataKey="clos"
                stroke="#82ca9d"
                name="종가"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
