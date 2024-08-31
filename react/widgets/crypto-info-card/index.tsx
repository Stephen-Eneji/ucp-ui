import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/crypto-info-card.scss'
import { ucwpAPIV1 } from "../../helper/api-helper";
import { CoinData } from "../../types";

function Card({ coin, settings }) {
  const [description, setDescription] = useState<string>('')
  useEffect(() => {
    ucwpAPIV1.fetchData('coin-info', { coin_id: coin.id }).then((data) => {
      setDescription(data.description.en)
    })
  }, [coin.id])
  return (
    <div className="ucwp-cic-children-main">
                <div className="ucwp-cic-children-backdrop">
                  <div className="ucwp-cic-children-coin-logo">
                    <img src={coin.image} alt={coin.name} />
                  </div>
                </div>
              <div className="ucwp-cic-children-main-cnt">
                <div className="ucwp-cic-children-coin-market-detail">
                  <div className="ucwp-cic-children-coin-market-detail-content">
                    <div className="ucwp-cic-children-coin-name">
                      {coin.name}
                      <span className="ucwp-cic-children-coin-symbol">
                        ({coin.symbol.toUpperCase()})
                      </span>
                    </div>
                    {/* rank */}
                    <div className="ucwp-cic-children-coin-rank">
                      Rank: {coin.market_cap_rank}
                    </div>
                    {/* price */}
                    <div className="ucwp-cic-children-coin-price">
                      Price: {settings?.currency_symbol}{coin.current_price}
                    </div>
                  </div>
                </div>
                <div className="ucwp-cic-children-coin-history">
                  <div className="ucwp-cic-children-coin-history-title">
                    Coins History
                  </div>
                  <div className="ucwp-cic-children-coin-history-content">
                    {description.slice(0, 500)+" ..."}
                  </div>
                </div>  
              </div>
            </div>
  )
}
ReactRender(({ coins, settings }) => {
  const [coinList, setCoinList] = useState<CoinData[]>(coins ?? []);
  
  return (
    <div
      className={`ucwp-crypto-info-card ${
        settings.dark_mode ? "ucwp-dark-mode" : ""
      }`}
    >
      <div className="ucwp-cic-main-body">
        {coinList.slice(0, settings.count ?? 10).map((coin, index) => (
          <Card key={index} coin={coin} settings={settings} />
        ))}
      </div>
    </div>
  );
})
