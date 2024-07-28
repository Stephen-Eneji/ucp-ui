import React, { useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/crypto-price-table.scss'
import { abbreviateNumber, levenshteinDistance, searchCoin } from "../../helper/helper";
import { CoinData } from "../../types";

ReactRender(({ coins, settings }) => {
  const [coinList, setCoinList] = useState<CoinData[]>(coins ?? []); // Initialize with props

  const search = (e: any) => {
    const value = e.target.value;
    setCoinList(searchCoin(value, coins.slice(0, settings.count ?? 10)));

  };


  let width = settings.parent_width;
  const isStyle2 = settings.card === 'card-002'
  // if width does not end with % or px then add px
  if (!width.endsWith('%') &&!width.endsWith('px')) {
    width += 'px';
  }
  return (
    <div className="ucp-crypto-price-table" style={{ width: width }}>
      <div className="ucp-crypto-price-table-main">
        {isStyle2 && (
          <input
            type="text"
            className="ucp-crypto-price-table-main-search ucp-crypto-search-input"
            placeholder={`${settings.search_placeholder}`}
            onChange={search}
          />
        )}
        <table className={`ucp-crypto-price-table-main-table`}>
          <thead>
            <tr>
              <th></th>
              <th>#Name</th>
              <th>Price </th>
              <th>24H Change</th>
              {isStyle2 && (
                <>
                  <th>Market Cap</th>
                  <th> Volume</th>
                  <th> Supply</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {coinList.slice(0, settings.count ?? 10).map((coin, index) => (
              <tr
                key={index}
                data-table-row-coin={`${coin.name}---${coin.symbol}`}
              >
                <td>{index}</td>
                <td>
                  <div className="crypto-price-table-name-info">
                    <div className="crypto-price-table-name-info-image">
                      <img src={coin.image} alt={coin.name} />
                    </div>
                    <div className="crypto-price-table-name-info-name">
                      <span>{coin.name}</span>
                      <span>{coin.symbol}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {settings.currency_symbol}
                  {coin.current_price}
                </td>
                <td>
                  <i
                    className={`fa-solid fa-arrow-${
                      coin.price_change_percentage_24h > 0 ? "up" : "down"
                    }`}
                  ></i>
                  {coin.price_change_percentage_24h}
                </td>
                {isStyle2 && (
                  <>
                    <td>{abbreviateNumber(coin.market_cap)}</td>
                    <td>{abbreviateNumber(coin.total_volume)}</td>
                    <td>{abbreviateNumber(coin.circulating_supply)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
})
