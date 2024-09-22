import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/accordion-widget.scss'
import { UCWPWidgetSetting, CoinData, GraphData } from "../../types";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { ArrowDown2 } from "iconsax-react";
import { abbreviateNumber, roundToSignificantFigures } from "../../helper/helper";
import { ucwpAPIV1 } from "../../helper/api-helper";
import Graph from "../../helper-components/Graph";
import PricePercentage from "../../helper-components/PricePercentage";
import useBinanceStreamTickerWebSocket from "../../helper-components/WebHooks/BinanceStreamTicker";
Chart.register(CategoryScale);


function CoinCard({
  coin,
  settings,
  max_point_graph = 15,
  uuid,
}: {
  coin: CoinData;
  settings: UCWPWidgetSetting;
  max_point_graph?: number;
  uuid: number;
}) {
  const { no_of_days = 7} = settings;

  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [graphLabels, setGraphLabels] = useState<string[]>([]);
  const [graphFetchCount, setGraphFetchCount] = useState(0);
  const graphColor =
    coin.price_change_percentage_24h > 0
      ? "rgba(75, 192, 192, 1)"
      : "rgba(255, 99, 132, 1)";

  const defaultDataSetSettings = {
    backgroundColor:
      coin.price_change_percentage_24h < 0
        ? "rgba(255, 99, 132, 0.2)"
        : "rgba(75, 192, 192, 0.2)",
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
    ucwpAPIV1
      .fetchData<{ prices: [number, number][] }>("coin-chart-data", {
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
  }, [graphFetchCount]);

  return (
    <AccordionItem className={`ucwp-accordion-item ${settings.dark_mode ? 'ucwp-accordion-dark-mode' : ''}`} uuid={uuid}>
      <AccordionItemHeading className="ucwp-accordion-item-heading">
        <AccordionItemButton className="ucwp-accordion-item-button">
          <div className="accordion-backdrop-wrapper">
            <img src={coin.image} alt={coin.name} />
          </div>
          <div className="accordion-title-wrapper">
            <h2>
              {coin.name}({coin.symbol.toUpperCase()})
            </h2>
          </div>
          <div className="accordion-right-side">
            <div className="accordion-coin-price">
              <span>
                {settings.currency_symbol}
                {abbreviateNumber(coin.current_price, 10e5, true)}
              </span>
            </div>
            <div className="accordion-item-icon">
              <ArrowDown2 />
            </div>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="ucwp-accordion-item-panel">
        <div className="ucwp-accordion-item-panel-main">
          <div className="ucwp-accordion-item-panel-content">
            <span>
              <PricePercentage
                percentage={coin.price_change_percentage_24h}
                styles={{}}
              />
            </span>
          </div>
          <div className="ucwp-accordion-item-panel-graph">
            <Graph
              chartData={graphData}
              className="ucwp-accordion-item-panel-graph"
              labels={graphLabels}
              defaultDataSetSettings={defaultDataSetSettings}
              options={GraphOptions}
            />
          </div>
        </div>
      </AccordionItemPanel>
    </AccordionItem>
  );
}

ReactRender(({ coins, settings }: { coins: CoinData[], settings: UCWPWidgetSetting }) => {
  const [coinList, _] = useState<CoinData[]>(coins ?? []); // Initialize with props
  const { connected, data, error } = useBinanceStreamTickerWebSocket(
    coinList?.map((coin) => coin.symbol).slice(0, settings.count),
    settings?.usd_conversion_rate ?? 1
  );
  return (
    <div className="ucwp-accordion-widget">
      <Accordion
        style={{ width: settings.parent_width }}
        className="ucwp-accordion"
        allowZeroExpanded={true}
      >
        {coinList?.slice(0, settings.count).map((_coin, index) => {
          const coin = { ..._coin ,...data[_coin.symbol.toUpperCase()] };
          return (
            <CoinCard
              key={index}
              coin={coin}
              settings={settings}
              uuid={index}
            />
          );
        })}
      </Accordion>
    </div>
  );
})

