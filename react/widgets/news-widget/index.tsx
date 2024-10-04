import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/news-widget.scss'
import Marquee from "react-fast-marquee";
import { NewsData, UCWPWidgetSetting } from "react/types";

ReactRender(
  ({ news, settings }: { news: NewsData[]; settings: UCWPWidgetSetting }) => {
    const parentWidth =
      typeof settings.parent_width === "number"
        ? `${settings.parent_width}px`
        : settings.parent_width;
    const animationDuration = (settings.speed || 3000) / (news?.length ?? 10);
    return (
      <Marquee
        className={`ucwp-news-widget ${settings.dark_mode ? "ucwp-news-widget-dark-mode" : ""}`}
        style={{ width: parentWidth, display: "flex", gap: "10px" }}
        pauseOnHover={true}
        speed={animationDuration}
      >
        <div className={`ucwp-news-widget-main`}>
          {news?.map((news) => {
            return (
              <div key={news.title} className="ucwp-news-widget-card">
                <a href={news.url} target="_blank" rel="noreferrer">
                  <div className="ucwp-news-widget-card-content">
                    <h3>{news.title}</h3>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </Marquee>
    );
  }
);
