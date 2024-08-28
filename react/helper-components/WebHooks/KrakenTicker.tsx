import { useState, useEffect, useCallback } from "react";

function useKrakenTickerWebSocket(symbols, defaultCurrencyDollarRate = 1) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState({});
  const [error, setError] = useState<string|null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket("wss://ws.kraken.com/v2");

      socket.onopen = () => {
        console.log("Connected to Kraken WebSocket");
        setConnected(true);

        symbols.forEach((symbol) => {
          const subscribeMessage = {
            method: "subscribe",
            params: {
              symbol: [`${symbol}/USD`],
            },
          };
          socket.send(JSON.stringify(subscribeMessage));
        });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.channel === "ticker") {
          const tickerUpdate = data.data;
          setTickerData((prevData) => ({
            ...prevData,
            [data.symbol]: {
              symbol: data.symbol,
              price: (
                parseFloat(tickerUpdate.ask) * defaultCurrencyDollarRate
              ).toFixed(2),
              volume: parseFloat(tickerUpdate.v).toFixed(2),
              low: (
                parseFloat(tickerUpdate.l) * defaultCurrencyDollarRate
              ).toFixed(2),
              high: (
                parseFloat(tickerUpdate.h) * defaultCurrencyDollarRate
              ).toFixed(2),
              change24h: (
                parseFloat(tickerUpdate.c) * defaultCurrencyDollarRate
              ).toFixed(2),
              timestamp: new Date().toLocaleString(),
            },
          }));
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from Kraken WebSocket");
        setConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Error connecting to Kraken WebSocket");
      };

      return () => {
        socket.close();
      };
    } catch (err) {
      setError("Error initializing Kraken WebSocket");
    }
  }, [symbols, defaultCurrencyDollarRate]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  return { connected, data: tickerData, error };
}

export default useKrakenTickerWebSocket;
