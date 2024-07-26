import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/crypto-info-card.scss'

ReactRender(({coins}) => {
  return (
    <div className="ucp-crypto-info-card">
      <div className="ucp-cic-main-body">
        {
          [1, 2, 3, 4, 5, 6, 7, 10, 17, 18, 19].map((index) => (
            <div className="ucp-cic-children-main">
                <div className="ucp-cic-children-backdrop">
                  <div className="ucp-cic-children-coin-logo">
                    
                  </div>
                </div>
              <div className="ucp-cic-children-main-cnt">
                <div className="ucp-cic-children-coin-market-detail">
                  <div className="ucp-cic-children-coin-market-detail-content">
                    <div className="ucp-cic-children-coin-name">
                      Bitcoin
                      <span className="ucp-cic-children-coin-symbol">
                        (BTC)
                      </span>
                    </div>
                    {/* rank */}
                    <div className="ucp-cic-children-coin-rank">
                      Rank: {index}
                    </div>
                    {/* price */}
                    <div className="ucp-cic-children-coin-price">
                        Price: $12345.67
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
