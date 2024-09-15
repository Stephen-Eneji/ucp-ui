import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import "@/styles/sass/crypto-date-change-table.scss";
import { roundToSignificantFigures, searchCoin } from "../../helper/helper";
import { CoinData } from "../../types";
import PricePercentage from "../../helper-components/PricePercentage";
import useKrakenTickerWebSocket from "../../helper-components/WebHooks/KrakenTicker";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import useBinanceStreamTickerWebSocket from "../../helper-components/WebHooks/BinanceStreamTicker";

ReactRender(({ coins, settings }) => {
  settings.count = parseInt(settings.count ?? "10");
  const [coinList, setCoinList] = useState<CoinData[]>(coins ?? []); // Initialize with props
  const [startCount, setStartCount] = useState<number>(0);
  const { connected, data, error } = useBinanceStreamTickerWebSocket(
    coinList?.map((coin) => coin.symbol).slice(0, settings.count),
    settings?.usd_conversion_rate ?? 1
  );

  const search = (e: any) => {
    const value = e.target.value;
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
  if (!width.endsWith("%") && !width.endsWith("px")) {
    width += "px";
  }

  return (
    <div className="ucwp-crypto-date-change-table" style={{ width: width }}>
      <div className="ucwp-crypto-date-change-table-main">
        <input
          type="text"
          className="ucwp-crypto-date-change-table-main-search ucwp-crypto-search-input"
          placeholder={`${settings.search_placeholder}`}
          onChange={search}
        />
        <table className={`ucwp-crypto-date-change-table-main-table`}>
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
            {coinList.slice(0, settings.count ?? 10).map((_coin, index) => {
              const coin = { ..._coin, ...data[_coin.symbol.toUpperCase()] };
              return (
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
                      arrowSize={12}
                      percentage={roundToSignificantFigures(
                        coin.price_change_percentage_24h ?? 0,
                        4
                      )}
                    />
                  </td>
                  <td>
                    <PricePercentage
                      arrowSize={12}
                      percentage={roundToSignificantFigures(
                        coin.price_change_percentage_7d_in_currency ?? 0,
                        4
                      )}
                    />
                  </td>
                  <td>
                    <PricePercentage
                      arrowSize={12}
                      percentage={roundToSignificantFigures(
                        coin.price_change_percentage_30d_in_currency ?? 0,
                        4
                      )}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="ucwp-crypto-date-change-table-main-pagination">
          <button
            disabled={startCount === 0}
            onClick={() => setStartCount(startCount - (settings.count ?? 10))}
          >
            <ArrowLeft2 size="32" className="ucwp-crypto-date-change-table-main-pagination-button-arrow" />
          </button>
          <button
            disabled={coins.length === startCount + (settings.count ?? 10)}
            onClick={() => setStartCount(startCount + (settings.count ?? 10))}
          >
            <ArrowRight2 size="32" className="ucwp-crypto-date-change-table-main-pagination-button-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
});
