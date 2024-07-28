import React, { useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import "@/styles/sass/crypto-date-change-table.scss";
import { levenshteinDistance, roundToSignificantFigures } from "../../helper/helper";
import { CoinData } from "../../types";

ReactRender(({ coins, settings }) => {
  const [coinList, setCoinList] = useState<CoinData[]>(coins ?? []); // Initialize with props

  const search = (e: any) => {
    const value = e.target.value;
    // if empty then show all coins
    if (value.length === 0) {
      setCoinList(coins);
      return;
    }
    const filtered = coins.slice(0, settings.count ?? 10).filter((coin) => {
      const nameDistance = levenshteinDistance(
        coin.name.toLowerCase(),
        value.toLowerCase()
      );
      const symbolDistance = levenshteinDistance(
        coin.symbol.toLowerCase(),
        value.toLowerCase()
      );
      return nameDistance <= 3 || symbolDistance <= 3;
    });
    // sort my which has the highest match
    // Combined sort function by both name and symbol distance
    filtered.sort((a, b) => {
      const nameDistanceA = levenshteinDistance(a.name.toLowerCase(), value);
      const nameDistanceB = levenshteinDistance(b.name.toLowerCase(), value);
      const symbolDistanceA = levenshteinDistance(
        a.symbol.toLowerCase(),
        value
      );
      const symbolDistanceB = levenshteinDistance(
        b.symbol.toLowerCase(),
        value
      );

      return (
        nameDistanceA + symbolDistanceA - (nameDistanceB + symbolDistanceB)
      );
    });
    setCoinList(filtered);
  };

  let width = settings.parent_width;
  // if width does not end with % or px then add px
  if (!width.endsWith("%") && !width.endsWith("px")) {
    width += "px";
  }

  return (
    <div className="ucp-crypto-date-change-table" style={{ width: width }}>
      <div className="ucp-crypto-date-change-table-main">
        <input
          type="text"
          className="ucp-crypto-date-change-table-main-search ucp-crypto-search-input"
          placeholder={`${settings.search_placeholder}`}
          onChange={search}
        />
        <table className={`ucp-crypto-date-change-table-main-table`}>
          <thead>
            <tr>
              <th></th>
              <th>#Name</th>
              <th>Price </th>
              <th>24H Change</th>
              <th>7D Change</th>
              <th>30D Change</th>
            </tr>
          </thead>
          <tbody>
            {coinList.map((coin, index) => (
              <tr
                key={index}
                data-table-row-coin={`${coin.name}---${coin.symbol}`}
              >
                <td>{index + 1}</td>
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
                  {roundToSignificantFigures(coin.price_change_percentage_24h, 4)}
                </td>
                <td>
                  <i
                    className={`fa-solid fa-arrow-${
                      coin.price_change_percentage_7d_in_currency ?? 0 > 0
                        ? "up"
                        : "down"
                    }`}
                  ></i>
                  {roundToSignificantFigures(
                    coin.price_change_percentage_7d_in_currency ?? 0,
                    4
                  )}
                </td>
                <td>
                  <i
                    className={`fa-solid fa-arrow-${
                      coin.price_change_percentage_30d_in_currency ?? 0 > 0
                        ? "up"
                        : "down"
                    }`}
                  ></i>
                  {roundToSignificantFigures(
                    coin.price_change_percentage_30d_in_currency ?? 0,
                    4
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
