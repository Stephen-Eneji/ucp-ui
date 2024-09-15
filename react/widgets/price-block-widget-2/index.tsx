import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/price-block-widget-2.scss'
import { CoinData, GraphData } from "../../types";
import PricePercentage from "../../helper-components/PricePercentage";
import Graph from "../../helper-components/Graph";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { ucwpAPIV1 } from "../../helper/api-helper";
import { roundToSignificantFigures } from "../../helper/helper";
import useBinanceStreamTickerWebSocket from "../../helper-components/WebHooks/BinanceStreamTicker";



Chart.register(CategoryScale);


function Card({ coin, no_of_days = 7, max_point_graph = 15, currency_symbol = "$", dark_mode = false}) {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [graphLabels, setGraphLabels] = useState<string[]>([]);
  const [graphFetchCount, setGraphFetchCount] = useState(0);
  const graphColor =
    coin.price_change_percentage_24h > 0
      ? "rgba(75, 192, 192, 1)"
      : "rgba(255, 99, 132, 1)";

  const defaultDataSetSettings = {
    backgroundColor: coin.price_change_percentage_24h < 0 ? "rgba(255, 99, 132, 0.2)" : "rgba(75, 192, 192, 0.2)",
    borderColor: graphColor,
    borderWidth: 1,
    pointRadius: 6,
    pointHitRadius: 8,
    pointHoverRadius: 8,
    fill: {
      target: "origin",
      below: graphColor,
    },
  };

  const GraphOptions = {
    maintainAspectRatio: false,
  };

  useEffect(() => {
    console.log("useEffect called , no of days ==>", no_of_days);
    ucwpAPIV1.fetchData<{ prices: [number, number][] }>("coin-chart-data", {
      coin_id: coin.id,
      days: no_of_days,
    })
      .then((data) => {
        let newData: ([number, number] | null)[] = data?.prices?.map(
          (_price) => {
            const time = new Date(_price?.[0]);
            const date = new Date();
            date.setDate(date.getDate() - no_of_days);
            _price[1] = roundToSignificantFigures(_price[1], 3);
            if (time >= date) {
              return _price;
            }
            return null;
          }
        );
        // remove all duplicate price point and remove null values
        newData = newData
          ?.filter((price, index) => {
            if (!price) {
              return false;
            }
            return (
              newData.findIndex((_price) => _price?.[0] === price?.[0]) ===
              index
            );
          })
          .slice(0, max_point_graph);

        if (!newData) {
          throw new Error("No data found");
        }
        const prices = newData?.map((price) => price?.[1] || 0);
        const days_time = newData?.map((price) => {
          const time = new Date(price?.[0] ?? "");
          return time.toLocaleDateString();
        });
        // co0nsole.log prices
        setGraphData(() => {
          return [
            {
              id: coin.id,
              label: coin.name,
              data: prices,
            },
          ];
        });
        setGraphLabels(() => {
          return days_time;
        });
      })
      .catch((error) => {
        console.error(error, "error", graphFetchCount);
        if (graphFetchCount < 3) {
          // sleep for 4 seconds and try again
          setTimeout(
            () => {
              setGraphFetchCount((prev) => prev + 1);
            },
            4000 * (graphFetchCount + 1)
          );
        }
      });
  }, [ graphFetchCount]);

  return (
    <div className={`ucwp-pbw-main-card ${dark_mode ? 'ucwp-pbw-dark-mode' : ''}`}>
      <div className="ucwp-pdw-card-backdrop-holder">
        <div className="ucwp-pdw-card-backdrop-img">
          <img src={coin.image} alt={coin.name} />
        </div>
      </div>
      <div className="ucwp-pbw-main-content">
        <div className="ucwp-pdw-coin-details-holder">
          <div className="ucwp-pdw-coin-details-main">
            <div className="ucwp-pdw-coin-details-first">
              <div className="ucwp-pdw-coin-name">
                {coin.name}(
                <span className="ucwp-pdw-coin-symbol">{coin.symbol}</span>)
              </div>
              {/* price */}
              <div className="ucwp-pdw-coin-price">
                {currency_symbol}
                {coin.current_price}{" "}
                <span>
                  {" "}
                  <PricePercentage
                    percentage={coin.price_change_percentage_24h}
                    arrowSize={5}
                    styles={{ display: "inline" , fontWeight: "bold", fontSize: "0.3125rem"}}
                  />{" "}
                </span>{" "}
              </div>
            </div>
            <div className="ucwp-pdw-coin-details-second">
              <div className="ucwp-pdw-coin-volume">
                (24H Vol)
                <div>{coin.total_volume}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="ucwp-pdw-coin-chart-holder">
          <Graph
            chartData={graphData}
            className="ucwp-pbw-cc-chart"
            labels={graphLabels}
            defaultDataSetSettings={defaultDataSetSettings}
            options={GraphOptions}
          />
        </div>
      </div>
    </div>
  );
}

ReactRender<{ coins: CoinData[] }>(({ coins, settings }) => {
  const [coinList, _] = useState<CoinData[]>(coins ?? []); // Initialize with props
  const { connected, data, error } = useBinanceStreamTickerWebSocket(
    coinList?.map((coin) => coin.symbol).slice(0, settings.count),
    settings?.usd_conversion_rate ?? 1
  );
  return (
    <div
      className="ucwp-price-block-widget-2"
      style={{ width: settings.parent_width }}
    >
      <div className="ucwp-pbw-2-main-body">
        {coinList.slice(0, settings.count ?? 10).map((_coin, index) => {
          const coin = { ..._coin, ...data[_coin.symbol.toUpperCase()]};
          return (
          <Card
            key={index}
            coin={coin}
            no_of_days={settings.no_of_days}
            currency_symbol={settings.currency_symbol}
            dark_mode={
              settings.dark_mode == true || settings.dark_mode == "true"
            }
          />
        )})}
      </div>
    </div>
  );
})