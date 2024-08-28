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
  channel: string;
  type: string;
  data: Array<{
    symbol: string;
    bid: number;
    ask: number;
    last: number;
    volume: number;
    high: number;
    low: number;
    change_pct: number;
    [key: string]: any;
  }>;
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
        args: symbols.map((symbol) => `instrument:${symbol}USD`),
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      try {
        const response: BitMEXWebSocketResponse = JSON.parse(event.data);
        if (
          response.channel === "ticker" &&
          response.data &&
          response.data.length > 0
        ) {
          response.data.forEach((instrumentData) => {
            const originalSymbol = instrumentData.symbol.replace("/USD", "");
            setTickerData((prevData) => ({
              ...prevData,
              [originalSymbol]: {
                symbol: originalSymbol,
                lastPrice: (
                  instrumentData.last * defaultCurrencyDollarRate
                ).toFixed(2),
                bidPrice: (
                  instrumentData.bid * defaultCurrencyDollarRate
                ).toFixed(2),
                askPrice: (
                  instrumentData.ask * defaultCurrencyDollarRate
                ).toFixed(2),
                volume: instrumentData.volume.toFixed(2),
                high: (instrumentData.high * defaultCurrencyDollarRate).toFixed(
                  2
                ),
                low: (instrumentData.low * defaultCurrencyDollarRate).toFixed(
                  2
                ),
                changePct: instrumentData.change_pct.toFixed(2),
                timestamp: new Date().toLocaleString(),
              },
            }));
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
  }, [symbols, defaultCurrencyDollarRate]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  return { connected, data: tickerData, error };
}

export default useBitMEXTickerWebSocket;
