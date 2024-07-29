import React, { useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/price-block-widget.scss'
import { CoinData } from "../../types";
import PricePercentage from "../../helper-components/PricePercentage";
import { roundToSignificantFigures } from "../../helper/helper";

ReactRender<{ coins: CoinData[] }>(({ coins, settings }) => {
  const [coinList, _] = useState<CoinData[]>(coins ?? []); // Initialize with props
  return (
    <div className="ucp-price-block-widget">
        {
          coinList.slice(0, settings.count ?? 10).map((coin, index) => {
            return (
              <div key={index} className="ucp-price-block-widget-item">
                <div className="ucp-price-block-item-backdrop">
                  <div className="ucp-pbw-backdrop-icon-holder">
                    <img src={coin.image} alt={coin.name} />
                  </div>
                </div>
                <div className="ucp-price-block-widget-item-content">
                  <div className="ucp-pbw-empty-holder"> </div>
                  <div className="ucp-pbw-market-details-holder">
                    <div className="ucp-pbw-price-holder">
                      {coin.current_price}
                    </div>
                    <div className="ucp-pbw-price-change-holder">
                      <PricePercentage
                        arrowSize={15}
                        percentage={roundToSignificantFigures(
                          coin.price_change_percentage_24h ?? 0,
                          4
                        )}
                      />
                    </div>
                  </div>
                  <div className="ucp-pbw-info-holder">
                    <div className="ucp-pbw-coin-name">{coin.name}
                      <span className="ucp-pbw-coin-symbol">({coin.symbol})</span>
                    </div>
                    {/* a set of div to switch currrency */}
                    <div className="ucp-pbw-currency-switcher-holder">
                      <div className="ucp-pbw-currency-switcher">
                        <button className="ucp-pbw-currency-switcher-button" type="button">USD</button>
                        <button className="ucp-pbw-currency-switcher-button" type="button">EUR</button>
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