import {useState} from "react";
import '@/styles/sass/price-slider-widget.scss'
import {UCPWidgetSetting, CoinData} from "../../types";
import ReactRender from "../../helper-components/react-wrapper";
import Marquee from "react-fast-marquee";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Card001 from "./cards/card-001";
import Card002 from "./cards/card-002";
import {ArrowLeft2, ArrowRight2} from "iconsax-react";
import React from "react";


Chart.register(CategoryScale);
const getCard = (card: string) => {
	switch (card) {
		case 'card-001':
			return Card001 ;
		case 'card-002':
			return Card002;
		default:
			return Card001;
	}
}
ReactRender<{ coins: CoinData[] }>(({ coins, settings }) => {
    const [coinList, _] = useState<CoinData[]>(coins ?? []); // Initialize with props
    const [direction, setDirection] = useState<"left" | "right">("left");
    const Card = getCard(settings?.card ?? "card-001");
    const animationDuration =
      (settings.speed || 3000) / (coinList?.length ?? 10);
    const parentWidth =
      typeof settings.parent_width === "number"
        ? `${settings.parent_width}px`
        : settings.parent_width;

    return (
      <div className="ucp-price-slider-widget" style={{ width: parentWidth }}>
        {settings.card == "card-002" && (
          <div className={"ucp-price-slider-control"}>
            <div
              className="ucp-price-slider-control-btn"
              onClick={() => setDirection("left")}
            >
              <ArrowLeft2 size="32" variant="Outline" />
            </div>
            <div
              className="ucp-price-slider-control-btn"
              onClick={() => setDirection("right")}
            >
              <ArrowRight2 size="32" variant="Outline" />
            </div>
          </div>
        )}
        <Marquee
          className="ucp-price-slider-widget-marquee"
          style={{ display: "flex", gap: "10px" }}
          pauseOnHover={true}
          speed={animationDuration}
          gradient={true}
          gradientWidth={50}
          direction={direction}
        >
          <div
            className={`ucp-price-slider-holder-cnt ${
              settings.card == "card-002" ? "ucp-price-slider-dark" : ""
            }`}
          >
            {coinList
              ?.slice(0, settings.count)
              .map((coin) => (
                <Card
                  key={coin.id}
                  coinData={coin}
                  currency_symbol={settings.currency_symbol}
                />
              ))}
          </div>
        </Marquee>
      </div>
    );
  }
);

