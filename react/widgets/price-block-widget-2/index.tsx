import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/price-block-widget-2.scss'
import { CoinData, GraphData } from "../../types";
import PricePercentage from "../../helper-components/PricePercentage";
import Graph from "../../helper-components/Graph";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { UCPAPIV1 } from "../../helper/api-helper";
import { roundToSignificantFigures } from "../../helper/helper";



Chart.register(CategoryScale);


function Card({ coin, no_of_days = 7, max_point_graph = 15, currency_symbol = "$" }) {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [graphLabels, setGraphLabels] = useState<string[]>([]);
  const [graphFetchCount, setGraphFetchCount] = useState(0);
  const graphColor =
    coin.price_change_percentage_24h > 0
      ? "rgba(75, 192, 192, 1)"
      : "rgba(255, 99, 132, 1)";

  const defaultDataSetSettings = {
    backgroundColor: "rgba(255, 99, 132, 0.2)",
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
    UCPAPIV1.fetchData<{ prices: [number, number][] }>("coin-chart-data", {
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
  }, [coin, graphFetchCount]);

  return (
    <div className="ucp-pbw-main-card">
      <div className="ucp-pdw-card-backdrop-holder">
        <div className="ucp-pdw-card-backdrop-img">
          <img src={coin.image} alt={coin.name} />
        </div>
      </div>
      <div className="ucp-pbw-main-content">
        <div className="ucp-pdw-coin-details-holder">
          <div className="ucp-pdw-coin-details-main">
            <div className="ucp-pdw-coin-details-first">
              <div className="ucp-pdw-coin-name">
                {coin.name}(
                <span className="ucp-pdw-coin-symbol">{coin.symbol}</span>)
              </div>
              {/* price */}
              <div className="ucp-pdw-coin-price">
                {currency_symbol}
                {coin.current_price}{" "}
                <span>
                  {" "}
                  <PricePercentage
                    percentage={coin.price_change_percentage_24h}
                    arrowSize={15}
                  />{" "}
                </span>{" "}
              </div>
            </div>
            <div className="ucp-pdw-coin-details-second"></div>
          </div>
        </div>
        <div className="ucp-pdw-coin-chart-holder">
          <Graph
            chartData={graphData}
            className="ucp-pbw-cc-chart"
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
  return (
    <div
      className="ucp-price-block-widget-2"
      style={{ width: settings.parent_width }}
    >
      <div className="ucp-pbw-2-main-body">
        {coins.slice(0, settings.count ?? 10).map((coin, index) => (
          <Card key={index} coin={coin} no_of_days={settings.no_of_days} currency_symbol={settings.currency_symbol} />
        ))}
      </div>
    </div>
  );
})