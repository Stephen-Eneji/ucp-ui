import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/crypto-info-card.scss'

ReactRender(({ coins, settings }) => {
  return (
    <div className={`ucp-crypto-info-card ${settings.dark_mode ? 'ucp-dark-mode' : ''}`}>
      <div className="ucp-cic-main-body">
        {
          coins.slice(0, settings.count ?? 10).map((coin, index) => (
            <div className="ucp-cic-children-main" key={index}>
                <div className="ucp-cic-children-backdrop">
                  <div className="ucp-cic-children-coin-logo">
                    <img src={coin.image} alt={coin.name} />
                  </div>
                </div>
              <div className="ucp-cic-children-main-cnt">
                <div className="ucp-cic-children-coin-market-detail">
                  <div className="ucp-cic-children-coin-market-detail-content">
                    <div className="ucp-cic-children-coin-name">
                      {coin.name}
                      <span className="ucp-cic-children-coin-symbol">
                        ({coin.symbol.toUpperCase()})
                      </span>
                    </div>
                    {/* rank */}
                    <div className="ucp-cic-children-coin-rank">
                      Rank: {coin.market_cap_rank}
                    </div>
                    {/* price */}
                    <div className="ucp-cic-children-coin-price">
                      Price: {settings?.currency_symbol}{coin.current_price}
                    </div>
                  </div>
                </div>
                <div className="ucp-cic-children-coin-history">
                  <div className="ucp-cic-children-coin-history-title">
                    Coins History
                  </div>
                  <div className="ucp-cic-children-coin-history-content">
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
