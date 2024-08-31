import { useState } from "react";
import "@/styles/sass/crypto-price-picker-pro.scss";
import { UCWPWidgetSetting, CoinData } from "../../types";
import ReactRender from "../../helper-components/react-wrapper";
import Card002 from "./cards/card-002";
import Card003 from "./cards/card-003";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import React from "react";
import useKrakenTickerWebSocket from "../../helper-components/WebHooks/KrakenTicker";

Chart.register(CategoryScale);
const getCard = (card: string) => {
console.log(card);
  switch (card) {
    case "card-002":
      return Card002;
    case "card-003":
      return Card003;
    default:
      return Card002;
  }
};

ReactRender(
  ({ coins, settings }: { coins: CoinData[]; settings: UCWPWidgetSetting }) => {
    const [coinList, setCoinList] = useState<CoinData[]>(coins ?? []); // Initialize with props
    const Card = getCard(settings.card ?? "card-001");
    const { connected, data, error } = useKrakenTickerWebSocket(
      coinList?.map((coin) => coin.symbol).slice(0, settings.count),
      settings?.usd_conversion_rate ?? 1
    );

    return (
      <div
        className="ucwp-crypto-price-picker-main"
        style={{
          flexDirection:
            settings?.orientation == "horizontal" ? "row" : "column",
        }}
      >
        {coinList.slice(0, settings.count).map((_coin, index) => {
          const coin = { ..._coin, ...data[_coin.symbol.toUpperCase()] };
          return (
            <Card
              key={coin.id}
              coinData={coin}
              style={{}}
              currency_symbol={settings.currency_symbol}
            />
          );
        })}
      </div>
    );
  }
);
