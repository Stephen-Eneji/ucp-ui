import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/price-block-widget.scss'
import { CoinData } from "../../types";
import PricePercentage from "../../helper-components/PricePercentage";
import { roundToSignificantFigures } from "../../helper/helper";
import { ucwpAPIV1 } from "../../helper/api-helper";
import useBinanceStreamTickerWebSocket from "../../helper-components/WebHooks/BinanceStreamTicker";

type CurrencyPriceSet = {
  gbp?: number;
  usd?: number;
  eur?: number;
};

// symbol to currency mapping
const currencySymbolMap: Record<string, string> = {
  gbp: "£",
  usd: "$",
  eur: "€",
};

function CoinCard({ coin, settings }) {
  const [coinPrice, setCoinPrice] = useState<CurrencyPriceSet>({});
  const [selectedCurrency, setSelectedCurrency] = useState(
    settings?.default_currency ?? "usd"
  );

  useEffect(() => {
    ucwpAPIV1.fetchData('coin-info', { coin_id: coin.id }).then((data) => {
      const prices = data.market_data.current_price;
      console.log(prices);
      setCoinPrice({
        gbp: prices.gbp,
        usd: prices.usd,
        eur: prices.eur,
      });
    });
  }, []);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="ucwp-price-block-widget-item">
      <div className="ucwp-price-block-item-backdrop">
        <div className="ucwp-pbw-backdrop-icon-holder">
          <img src={coin.image} alt={coin.name} />
        </div>
      </div>
      <div className="ucwp-price-block-widget-item-content">
        <div className="ucwp-pbw-empty-holder"> </div>
        <div className="ucwp-pbw-market-details-holder">
          <div className="ucwp-pbw-price-holder">
            {currencySymbolMap[selectedCurrency] ?? settings.currency_symbol}
            {(coinPrice[selectedCurrency] ?? coin.current_price).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </div>
          <div className="ucwp-pbw-price-change-holder">
            <PricePercentage
              arrowSize={15}
              percentage={roundToSignificantFigures(
                coin.price_change_percentage_24h ?? 0,
                4
              )}
            />
          </div>
        </div>
        <div className="ucwp-pbw-info-holder">
          <div className="ucwp-pbw-coin-name">
            {coin.name}
            <span className="ucwp-pbw-coin-symbol">({coin.symbol})</span>
          </div>
          {/* a set of div to switch currrency */}
          <div className="ucwp-pbw-currency-switcher-holder">
            <div className="ucwp-pbw-currency-switcher">
              {["usd", "gbp", "eur"].map((currency) => (
                <button
                  className={`ucwp-pbw-currency-switcher-button ${
                    currency === selectedCurrency
                      ? "ucwp-pbw-currency-switcher-button-active"
                      : ""
                  }`}
                  type="button"
                  key={currency}
                  onClick={() => handleCurrencyChange(currency)}
                >
                  {currency.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ReactRender<{ coins: CoinData[] }>(({ coins, settings }) => {
  const [coinList, _] = useState<CoinData[]>(coins ?? []); // Initialize with props
  const { connected, data, error } = useBinanceStreamTickerWebSocket(
    coinList?.map((coin) => coin.symbol).slice(0, settings.count),
    settings?.usd_conversion_rate ?? 1
  );
  return (
    <div className="ucwp-price-block-widget">
        {
          coinList.slice(0, settings.count ?? 10).map((_coin, index) => {
            const coin = { ..._coin, ...data[_coin.symbol.toUpperCase()] };
            return (
              <CoinCard key={index} coin={coin} settings={settings} />
            );
          })
        }
    </div>
  )
})