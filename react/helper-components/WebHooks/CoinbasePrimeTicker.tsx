import { useState, useEffect, useCallback } from "react";

function useCoinbasePrimeTickerWebSocket(
  symbols,
  defaultCurrencyDollarRate = 1
) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState({});
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket("wss://ws-feed.prime.coinbase.com");

      socket.onopen = () => {
        console.log("Connected to Coinbase Prime WebSocket");
        setConnected(true);

        symbols.forEach((symbol) => {
          const subscribeMessage = {
            type: "subscribe",
            product_ids: [`${symbol}-USD`],
            channels: ["ticker"],
          };
          socket.send(JSON.stringify(subscribeMessage));
        });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "ticker") {
          setTickerData((prevData) => ({
            ...prevData,
            [data.product_id]: {
              symbol: data.product_id,
              price: (
                parseFloat(data.price) * defaultCurrencyDollarRate
              ).toFixed(2),
              volume: parseFloat(data.volume_24h).toFixed(2),
              change24h: (
                parseFloat(data.price_change_24h) * defaultCurrencyDollarRate
              ).toFixed(2),
              changePercent24h: (
                parseFloat(data.price_change_percent_24h) * 100
              ).toFixed(2),
              timestamp: new Date(data.time).toLocaleString(),
            },
          }));
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from Coinbase Prime WebSocket");
        setConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Error connecting to Coinbase Prime WebSocket");
      };

      return () => {
        socket.close();
      };
    } catch (err) {
      setError("Error initializing Coinbase Prime WebSocket");
    }
  }, [symbols, defaultCurrencyDollarRate]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  return { connected, data: tickerData, error };
}

export default useCoinbasePrimeTickerWebSocket;
