import { useState, useEffect, useCallback } from "react";

interface TickerData {
  symbol: string;
  ask: string;
  bid: string;
  last: string;
  volume: string;
  low: string;
  high: string;
  change: string;
  changePct: string;
  timestamp: string;
}

interface KrakenWebSocketResponse {
  channel: string;
  type: "snapshot" | "update";
  data: Array<{
    ask: number;
    bid: number;
    last: number;
    volume: number;
    low: number;
    high: number;
    change: number;
    change_pct: number;
    symbol: string;
    [key: string]: any;
  }>;
}

function useKrakenTickerWebSocket(
  symbols: string[],
  defaultCurrencyDollarRate = 1
) {
  const [connected, setConnected] = useState(false);
  const [tickerData, setTickerData] = useState<Record<string, TickerData>>({});
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket("wss://ws.kraken.com/v2");

    socket.onopen = () => {
      console.log("Connected to Kraken WebSocket");
      setConnected(true);

      const subscribeMessage = {
        method: "subscribe",
        params: {
          channel: "ticker",
          snapshot: true,
          symbol: symbols.map((symbol) => `${symbol}/USD`),
        },
        req_id: Date.now(),
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      try {
        const response: KrakenWebSocketResponse = JSON.parse(event.data);
        if (
          response.channel === "ticker" &&
          response.data &&
          response.data.length > 0
        ) {
          response.data.forEach((tickerUpdate) => {
            const originalSymbol = tickerUpdate.symbol.split("/")[0];
            setTickerData((prevData) => ({
              ...prevData,
              [originalSymbol]: {
                symbol: originalSymbol,
                ask: (tickerUpdate.ask * defaultCurrencyDollarRate).toFixed(2),
                bid: (tickerUpdate.bid * defaultCurrencyDollarRate).toFixed(2),
                last: (tickerUpdate.last * defaultCurrencyDollarRate).toFixed(
                  2
                ),
                volume: tickerUpdate.volume.toFixed(2),
                low: (tickerUpdate.low * defaultCurrencyDollarRate).toFixed(2),
                high: (tickerUpdate.high * defaultCurrencyDollarRate).toFixed(
                  2
                ),
                change: (
                  tickerUpdate.change * defaultCurrencyDollarRate
                ).toFixed(2),
                changePct: tickerUpdate.change_pct.toFixed(2),
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
      console.log("Disconnected from Kraken WebSocket");
      setConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Error connecting to Kraken WebSocket");
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

export default useKrakenTickerWebSocket;
