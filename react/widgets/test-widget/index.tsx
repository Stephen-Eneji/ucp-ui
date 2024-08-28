import React from "react";
import {useKrakenTickerWebSocket} from "../../helper-components/WebHooks";
import ReactRender from "../../helper-components/react-wrapper";

const KrakenTickerDisplay: React.FC = () => {
  const { connected, data, error } = useKrakenTickerWebSocket([
    "BTC",
  ]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!connected) {
    return <div>Connecting to Kraken WebSocket...</div>;
  }

  return (
    <div>
      <h1>Kraken Ticker Data</h1>
      {Object.entries(data).map(([symbol, tickerData]) => (
        <div key={symbol}>
          <h2>{symbol}</h2>
          <p>Last Price: ${tickerData.last}</p>
          <p>Ask: ${tickerData.ask}</p>
          <p>Bid: ${tickerData.bid}</p>
          <p>
            24h Change: ${tickerData.change} ({tickerData.changePct}%)
          </p>
          <p>24h High: ${tickerData.high}</p>
          <p>24h Low: ${tickerData.low}</p>
          <p>24h Volume: {tickerData.volume}</p>
          <p>Last Updated: {tickerData.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

ReactRender(KrakenTickerDisplay);
