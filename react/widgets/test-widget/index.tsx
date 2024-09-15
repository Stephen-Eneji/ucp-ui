import React from "react";
import {
  useKrakenTickerWebSocket,
  useBitMEXTickerWebSocket,
  useBinanceTickerWebSocket,
} from "../../helper-components/WebHooks";
import ReactRender from "../../helper-components/react-wrapper";
import useBinanceStreamTickerWebSocket from "../../helper-components/WebHooks/BinanceStreamTicker";

const TickerDisplay: React.FC = () => {
  // Use both hooks
  const {
    connected: krakenConnected,
    data: krakenData,
    error: krakenError,
  } = useKrakenTickerWebSocket(["BTC", "ETH"]);

  const {
    connected: bitmexConnected,
    data: bitmexData,
    error: bitmexError,
  } = useBitMEXTickerWebSocket(["BTC", "ETH"]);
  
  const {
    connected: binanceConnected,
    data: binanceData,
    error: binanceError,
  } = useBinanceTickerWebSocket(["BTC", "ETH"]);

  const { connected, data, error } = useBinanceStreamTickerWebSocket(["BTC", "ETH"]);

  return (
    <div>
      {/* a table of column , platform, status. message */}
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Status</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kraken</td>
            <td>{krakenConnected ? "Connected" : "Disconnected"}</td>
            <td>{krakenError ? krakenError : "Successfully connected"}</td>
          </tr>
          <tr>
            <td>BitMEX</td>
            <td>{bitmexConnected ? "Connected" : "Disconnected"}</td>
            <td>{bitmexError ? bitmexError : "Successfully connected"}</td>
          </tr>
          <tr>
            <td>Binance</td>
            <td>{binanceConnected ? "Connected" : "Disconnected"}</td>
            <td>{binanceError ? binanceError : "Successfully connected"}</td>
          </tr>
          <tr>
            <td>Binance Stream</td>
            <td>{connected ? "Connected" : "Disconnected"}</td>
            <td>{error ? error : "Successfully connected"}</td>
          </tr>
        </tbody>
      </table>

      {/* Display Kraken error if it exists */}
      {krakenError && <div>Error (Kraken): {krakenError}</div>}

      {/* Display BitMEX error if it exists */}
      {bitmexError && <div>Error (BitMEX): {bitmexError}</div>}

      {/* Show connecting message if any of the connections are not established */}
      {(!krakenConnected || !bitmexConnected) &&
        !krakenError &&
        !bitmexError && <div>Connecting to WebSocket...</div>}

      {/* Display Kraken ticker data */}
      {krakenConnected && !krakenError && (
        <div>
          <h1>Kraken Ticker Data</h1>
          {Object.entries(krakenData).map(([symbol, tickerData]) => (
            <div key={symbol}>
              <h2>{symbol}</h2>
              <p>Current Price: ${tickerData.current_price}</p>
              <p>
                24h Change: ${tickerData.price_change_24h} (
                {tickerData.price_change_percentage_24h}%)
              </p>
              <p>24h High: ${tickerData.high_24h}</p>
              <p>24h Low: ${tickerData.low_24h}</p>
              <p>24h Volume: {tickerData.total_volume}</p>
              <p>Last Updated: {tickerData.last_updated}</p>
            </div>
          ))}
        </div>
      )}

      {/* Display BitMEX ticker data */}
      {bitmexConnected && !bitmexError && (
        <div>
          <h1>BitMEX Ticker Data</h1>
          {Object.entries(bitmexData).map(([symbol, tickerData]) => (
            <div key={symbol}>
              <h2>{symbol}</h2>
              <p>Current Price: ${tickerData.current_price}</p>
              <p>24h High: ${tickerData.high_24h}</p>
              <p>24h Low: ${tickerData.low_24h}</p>
              <p>24h Volume: {tickerData.total_volume}</p>
              <p>Last Updated: {tickerData.last_updated}</p>
            </div>
          ))}
        </div>
      )}

      {/*  Display Binance ticker data */}
      {binanceConnected && !binanceError && (
        <div>
          <h1>Binance Ticker Data</h1>
          {Object.entries(binanceData).map(([symbol, tickerData]) => (
            <div key={symbol}>
              <h2>{symbol}</h2>
              <p>Current Price: ${tickerData.current_price}</p>
              <p>
                24h Change: ${tickerData.price_change_24h} (
                {tickerData.price_change_percentage_24h}%)
              </p>
              <p>24h High: ${tickerData.high_24h}</p>
              <p>24h Low: ${tickerData.low_24h}</p>
              <p>24h Volume: {tickerData.total_volume}</p>
              <p>Last Updated: {tickerData.last_updated}</p>
            </div>
          ))}
        </div>
      )}
        
      {/* Display Binance Stream ticker data */}
      {connected && !error && (
        <div>
          <h1>Binance Stream Ticker Data</h1>
          {Object.entries(data).map(([symbol, tickerData]) => (
            <div key={symbol}>
              <h2>{symbol}</h2>
              <p>Current Price: ${tickerData.current_price}</p>
              <p>
                24h Change: ${tickerData.price_change_24h} (
                {tickerData.price_change_percentage_24h}%)
              </p>
              <p>24h High: ${tickerData.high_24h}</p>
              <p>24h Low: ${tickerData.low_24h}</p>
              <p>24h Volume: {tickerData.total_volume}</p>
              <p>Last Updated: {tickerData.last_updated}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ReactRender(TickerDisplay);
