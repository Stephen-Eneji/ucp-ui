import { useState, useEffect, useCallback } from "react";

function useBinanceTickerWebSocket(symbols, defaultCurrencyDollarRate = 1) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState({});
  const [error, setError] = useState<string|null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket("wss://stream.binance.com:9443/ws");

      socket.onopen = () => {
        console.log("Connected to Binance WebSocket");
        setConnected(true);

        symbols.forEach((symbol) => {
          const message = {
            method: "SUBSCRIBE",
            params: [`${symbol.toLowerCase()}usdt@ticker`],
            id: Date.now(),
          };
          socket.send(JSON.stringify(message));
        });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTickerData((prevData) => ({
          ...prevData,
          [data.s]: {
            symbol: data.s,
            lastPrice: (parseFloat(data.c) * defaultCurrencyDollarRate).toFixed(
              2
            ),
            bidPrice: (parseFloat(data.b) * defaultCurrencyDollarRate).toFixed(
              2
            ),
            askPrice: (parseFloat(data.a) * defaultCurrencyDollarRate).toFixed(
              2
            ),
            timestamp: new Date(data.E).toLocaleString(),
          },
        }));
      };

      socket.onclose = () => {
        console.log("Disconnected from Binance WebSocket");
        setConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Error connecting to Binance WebSocket");
      };

      return () => {
        socket.close();
      };
    } catch (err) {
      setError("Error initializing Binance WebSocket");
    }
  }, [symbols, defaultCurrencyDollarRate]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  return { connected, data: tickerData, error };
}

export default useBinanceTickerWebSocket;
