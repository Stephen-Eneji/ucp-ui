import React from "react";
import {useBinanceTickerWebSocket, useBitMEXTickerWebSocket, useCoinbasePrimeTickerWebSocket, useKrakenTickerWebSocket} from "../../helper-components/WebHooks";
import ReactRender from "../../helper-components/react-wrapper";

const YourComponent = () => {
  const symbols = ["BTC", "ETH"];

  const {
    connected: binanceConnected,
    data: binanceData,
    error: binanceError,
  } = useBinanceTickerWebSocket(symbols, 1600);
  const {
    connected: bitmexConnected,
    data: bitmexData,
    error: bitmexError,
  } = useBitMEXTickerWebSocket(symbols, 1600);
  const {
    connected: coinbaseConnected,
    data: coinbaseData,
    error: coinbaseError,
  } = useCoinbasePrimeTickerWebSocket(symbols, 1600);
  const {
    connected: krakenConnected,
    data: krakenData,
    error: krakenError,
  } = useKrakenTickerWebSocket(symbols, 1600);

  return (
    <div>
      <h1>Binance Data</h1>
      {binanceError ? (
        <p>Error: {binanceError}</p>
      ) : (
        <pre>{JSON.stringify(binanceData, null, 2)}</pre>
      )}

      <h1>BitMEX Data</h1>
      {bitmexError ? (
        <p>Error: {bitmexError}</p>
      ) : (
        <pre>{JSON.stringify(bitmexData, null, 2)}</pre>
      )}

      <h1>Coinbase Prime Data</h1>
      {coinbaseError ? (
        <p>Error: {coinbaseError}</p>
      ) : (
        <pre>{JSON.stringify(coinbaseData, null, 2)}</pre>
      )}

      <h1>Kraken Data</h1>
      {krakenError ? (
        <p>Error: {krakenError}</p>
      ) : (
        <pre>{JSON.stringify(krakenData, null, 2)}</pre>
      )}
    </div>
  );
};

ReactRender(YourComponent);
