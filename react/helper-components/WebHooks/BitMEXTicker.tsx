import { useState, useEffect, useCallback } from "react";

interface TickerData {
  symbol: string;
  current_price?: number;
  total_volume?: number;
  high_24h?: number;
  low_24h?: number;
  price_change_percentage_24h?: number;
  last_updated?: string;
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
                  current_price:
                    instrumentData.lastPriceProtected !== undefined
                      ? instrumentData.lastPriceProtected *
                        defaultCurrencyDollarRate
                      : undefined,
                  total_volume: instrumentData.openValue,
                  high_24h:
                    instrumentData.lastPriceProtected !== undefined
                      ? instrumentData.lastPriceProtected *
                        defaultCurrencyDollarRate
                      : undefined,
                  low_24h:
                    instrumentData.fairPrice !== undefined
                      ? instrumentData.fairPrice * defaultCurrencyDollarRate
                      : undefined,
                  price_change_percentage_24h: undefined, // BitMEX doesn't provide this directly
                  last_updated:
                    instrumentData.timestamp ?? Date().toLocaleString(),
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
