import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/crypto-price-table-2.scss'
import { abbreviateNumber, levenshteinDistance, searchCoin } from "../../helper/helper";
import { CoinData } from "../../types";
import PricePercentage from "../../helper-components/PricePercentage";

ReactRender(({ coins, settings }) => {
  settings.count = parseInt(settings.count ?? "10");
  const [coinList, setCoinList] = useState<CoinData[]>(coins ?? []); // Initialize with props
  const [startCount, setStartCount] = useState<number>(0);

  const search = (e: any) => {
    const value = e.target.value;
    // if value is empty, 
    if (value?.length === 0) {
      setCoinList(coins);
      return;
    }
    setCoinList(
      searchCoin(
        value,
        coins.slice(startCount, startCount + (settings.count ?? 10))
      )
    );

  };

  useEffect(() => {
    setCoinList(coins.slice(startCount, startCount + (settings.count ?? 10)));
  }, [startCount]);



  let width = settings.parent_width;
  // if width does not end with % or px then add px
  if (!width.endsWith('%') &&!width.endsWith('px')) {
    width += 'px';
  }
  return (
    <div className="ucwp-crypto-price-table" style={{ width: width }}>
      <div className="ucwp-crypto-price-table-main">
          <input
            type="text"
            className="ucwp-crypto-price-table-main-search ucwp-crypto-search-input"
            placeholder={`${settings.search_placeholder}`}
            onChange={search}
          />
        <table className={`ucwp-crypto-price-table-main-table`}>
          <thead>
            <tr>
              <th></th>
              <th>#Name</th>
              <th>Price </th>
              <th>24H Change</th>
                <>
                  <th>Market Cap</th>
                  <th> Volume</th>
                  <th> Supply</th>
                </>
            </tr>
          </thead>
          <tbody>
            {coinList
              .slice(0, (settings.count ?? 10))
              .map((coin, index) => (
                <tr
                  key={index}
                  data-table-row-coin={`${coin.name}---${coin.symbol}`}
                >
                  <td>{index + 1 + startCount}</td>
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
                    <PricePercentage
                      percentage={coin.price_change_percentage_24h}
                      arrowSize={12}
                    />
                  </td>
                    <>
                      <td>{abbreviateNumber(coin.market_cap)}</td>
                      <td>{abbreviateNumber(coin.total_volume)}</td>
                      <td>{abbreviateNumber(coin.circulating_supply)}</td>
                    </>
                </tr>
              ))}
          </tbody>
        </table>
          <div className="ucwp-crypto-price-table-main-pagination">
            <button
              disabled={startCount === 0}
              onClick={() => setStartCount(startCount - (settings.count ?? 10))}
            >
              Previous
            </button>
            <button
              disabled={coins.length === startCount + (settings.count ?? 10)}
              onClick={() => setStartCount(startCount + (settings.count ?? 10))}
            >
              Next
            </button>
          </div>
      </div>
    </div>
  );
})
