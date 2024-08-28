import { useState, useEffect, useCallback } from "react";

interface TickerData {
  symbol: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  volume: string;
  high: string;
  low: string;
  changePct: string;
  timestamp: string;
}

interface BitMEXWebSocketResponse {
  table: string;
  action: "partial" | "update" | "insert" | "delete";
  data: Array<{
    symbol: string;
    lastPriceProtected?: number;
    openValue?: number;
    fairPrice?: number;
    markPrice?: number;
    timestamp?: string;
  }>;
  keys?: string[];
  types?: { [key: string]: string };
  filter?: { account?: number; symbol?: string };
}

function useBitMEXTickerWebSocket(
  symbols: string[],
  defaultCurrencyDollarRate = 1
) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState<Record<string, TickerData>>({});
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket("wss://ws.bitmex.com/realtime");

    socket.onopen = () => {
      console.log("Connected to BitMEX WebSocket");
      setConnected(true);

      const subscribeMessage = {
        op: "subscribe",
        args: symbols.map((symbol) => `instrument:${symbol.toUpperCase()}USD`),
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      try {
        const response: BitMEXWebSocketResponse = JSON.parse(event.data);
        if (response.table === "instrument" && response.action === "update") {
          response.data.forEach((instrumentData) => {
            if (instrumentData.symbol) {
              const originalSymbol = instrumentData.symbol.replace("USD", "");
              setTickerData((prevData) => ({
                ...prevData,
                [originalSymbol]: {
                  symbol: originalSymbol,
                  lastPrice: (
                    (instrumentData.lastPriceProtected ?? 0) *
                    defaultCurrencyDollarRate
                  ).toFixed(2),
                  bidPrice: (
                    (instrumentData.fairPrice ?? 0) * defaultCurrencyDollarRate
                  ).toFixed(2),
                  askPrice: (
                    (instrumentData.markPrice ?? 0) * defaultCurrencyDollarRate
                  ).toFixed(2),
                  volume: (instrumentData.openValue ?? 0).toFixed(2),
                  high: (
                    (instrumentData.lastPriceProtected ?? 0) *
                    defaultCurrencyDollarRate
                  ).toFixed(2),
                  low: (
                    (instrumentData.fairPrice ?? 0) * defaultCurrencyDollarRate
                  ).toFixed(2),
                  changePct: "N/A", // Update or calculate changePct if necessary
                  timestamp:
                    instrumentData.timestamp ?? new Date().toLocaleString(),
                },
              }));
            }
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from BitMEX WebSocket");
      setConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Error connecting to BitMEX WebSocket");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  return { connected, data: tickerData, error };
}

export default useBitMEXTickerWebSocket;
