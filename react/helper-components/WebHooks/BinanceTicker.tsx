import { useState, useEffect, useCallback } from "react";

interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  highPrice: string;
  lowPrice: string;
  timestamp: string;
}

interface BinanceWebSocketResponse {
  id: string;
  status: number;
  result: {
    symbol: string;
    lastPrice: string;
    priceChange: string;
    priceChangePercent: string;
    volume: string;
    highPrice: string;
    lowPrice: string;
    [key: string]: any;
  };
}

function useBinanceTickerWebSocket(
  symbols: string[],
  defaultCurrencyDollarRate = 1
) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState<Record<string, TickerData>>({});
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket("wss://ws-api.binance.com:443/ws-api/v3");

    socket.onopen = () => {
      console.log("Connected to Binance WebSocket");
      setConnected(true);

      symbols.forEach((symbol) => {
        const message = {
          id: Date.now().toString(),
          method: "ticker.24hr",
          params: {
            symbol: `${symbol.toUpperCase()}USDT`,
          },
        };
        socket.send(JSON.stringify(message));
      });
    };

    socket.onmessage = (event) => {
      const response: BinanceWebSocketResponse = JSON.parse(event.data);
      if (response.result) {
        const data = response.result;
        const originalSymbol = data.symbol.replace("USDT", "");
        setTickerData((prevData) => ({
          ...prevData,
          [originalSymbol]: {
            symbol: originalSymbol,
            lastPrice: (
              parseFloat(data.lastPrice) * defaultCurrencyDollarRate
            ).toFixed(2),
            priceChange: (
              parseFloat(data.priceChange) * defaultCurrencyDollarRate
            ).toFixed(2),
            priceChangePercent: parseFloat(data.priceChangePercent).toFixed(2),
            volume: parseFloat(data.volume).toFixed(2),
            highPrice: (
              parseFloat(data.highPrice) * defaultCurrencyDollarRate
            ).toFixed(2),
            lowPrice: (
              parseFloat(data.lowPrice) * defaultCurrencyDollarRate
            ).toFixed(2),
            timestamp: new Date().toLocaleString(),
          },
        }));
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from Binance WebSocket");
      setConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Error connecting to Binance WebSocket");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, []);

  return { connected, data: tickerData, error };
}

export default useBinanceTickerWebSocket;
