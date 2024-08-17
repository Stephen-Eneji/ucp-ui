import React, { useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/price-block-widget.scss'
import { CoinData } from "../../types";
import PricePercentage from "../../helper-components/PricePercentage";
import { roundToSignificantFigures } from "../../helper/helper";

ReactRender<{ coins: CoinData[] }>(({ coins, settings }) => {
  const [coinList, _] = useState<CoinData[]>(coins ?? []); // Initialize with props
  return (
    <div className="ucwp-price-block-widget">
        {
          coinList.slice(0, settings.count ?? 10).map((coin, index) => {
            return (
              <div key={index} className="ucwp-price-block-widget-item">
                <div className="ucwp-price-block-item-backdrop">
                  <div className="ucwp-pbw-backdrop-icon-holder">
                    <img src={coin.image} alt={coin.name} />
                  </div>
                </div>
                <div className="ucwp-price-block-widget-item-content">
                  <div className="ucwp-pbw-empty-holder"> </div>
                  <div className="ucwp-pbw-market-details-holder">
                    <div className="ucwp-pbw-price-holder">
                      {coin.current_price}
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
                    <div className="ucwp-pbw-coin-name">{coin.name}
                      <span className="ucwp-pbw-coin-symbol">({coin.symbol})</span>
                    </div>
                    {/* a set of div to switch currrency */}
                    <div className="ucwp-pbw-currency-switcher-holder">
                      <div className="ucwp-pbw-currency-switcher">
                        <button className="ucwp-pbw-currency-switcher-button" type="button">USD</button>
                        <button className="ucwp-pbw-currency-switcher-button" type="button">EUR</button>
                      </div>
                    </div>
                  </div>
                  </div>
              </div>
            );
          })
        }
    </div>
  )
})