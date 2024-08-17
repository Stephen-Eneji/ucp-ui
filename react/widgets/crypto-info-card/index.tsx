import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/crypto-info-card.scss'

ReactRender(({ coins, settings }) => {
  return (
    <div className={`ucwp-crypto-info-card ${settings.dark_mode ? 'ucwp-dark-mode' : ''}`}>
      <div className="ucwp-cic-main-body">
        {
          coins.slice(0, settings.count ?? 10).map((coin, index) => (
            <div className="ucwp-cic-children-main" key={index}>
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
                    {/* random history about bitcoin */}
                    Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries. Transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.
                  </div>
                </div>  
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
})
