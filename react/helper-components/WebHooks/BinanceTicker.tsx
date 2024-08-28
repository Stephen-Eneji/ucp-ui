import { useState, useEffect, useCallback } from "react";

function useBinanceTickerWebSocket(symbols, defaultCurrencyDollarRate = 1) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState({});
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket("wss://ws-api.binance.com:443/ws-api/v3");

      socket.onopen = () => {
        console.log("Connected to Binance WebSocket");
        setConnected(true);

        symbols.forEach((symbol) => {
          const message = {
            id: Date.now(),
            method: "ticker.24hr",
            params: {
              symbol: `${symbol.toUpperCase()}USD`,
            },
          };
          socket.send(JSON.stringify(message));
        });
      };

      socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log(response);
        if (response.result) {
          const data = response.result;
          setTickerData((prevData) => ({
            ...prevData,
            [data.symbol]: {
              symbol: data.symbol,
              lastPrice: parseFloat(data.lastPrice).toFixed(2),
              priceChange: parseFloat(data.priceChange).toFixed(2),
              priceChangePercent: parseFloat(data.priceChangePercent).toFixed(
                2
              ),
              volume: parseFloat(data.volume).toFixed(2),
              highPrice: parseFloat(data.highPrice).toFixed(2),
              lowPrice: parseFloat(data.lowPrice).toFixed(2),
              timestamp: new Date().toLocaleString(),
            },
          }));
        }
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
