import { useState, useEffect, useCallback } from "react";

function useBitMEXTickerWebSocket(symbols, defaultCurrencyDollarRate = 1) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState({});
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket("wss://ws.bitmex.com/realtime");

      socket.onopen = () => {
        console.log("Connected to BitMEX WebSocket");
        setConnected(true);

        symbols.forEach((symbol) => {
          const subscribeMessage = {
            op: "subscribe",
            args: [`instrument:${symbol}USD`],
          };
          socket.send(JSON.stringify(subscribeMessage));
        });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.table === "instrument" && data.data && data.data.length > 0) {
          const instrumentData = data.data[0];
          setTickerData((prevData) => ({
            ...prevData,
            [instrumentData.symbol]: {
              symbol: instrumentData.symbol,
              lastPrice: (
                parseFloat(instrumentData.lastPrice) * defaultCurrencyDollarRate
              ).toFixed(2),
              bidPrice: (
                parseFloat(instrumentData.bidPrice) * defaultCurrencyDollarRate
              ).toFixed(2),
              askPrice: (
                parseFloat(instrumentData.askPrice) * defaultCurrencyDollarRate
              ).toFixed(2),
              timestamp: new Date(instrumentData.timestamp).toLocaleString(),
            },
          }));
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from BitMEX WebSocket");
        setConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Error connecting to BitMEX WebSocket");
      };

      return () => {
        socket.close();
      };
    } catch (err) {
      setError("Error initializing BitMEX WebSocket");
    }
  }, [symbols, defaultCurrencyDollarRate]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  return { connected, data: tickerData, error };
}

export default useBitMEXTickerWebSocket;
