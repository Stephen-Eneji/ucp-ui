import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/news-widget-2.scss'
import { NewsData, UCWPWidgetSetting } from "react/types";

ReactRender(({ news, settings }: { news: NewsData[]; settings: UCWPWidgetSetting }) => {
  const parentWidth =
    typeof settings.parent_width === "number"
      ? `${settings.parent_width}px`
      : settings.parent_width;
  return (
    <div className="ucwp-news-widget-2" style={{ width: parentWidth }}>
      <div className="ucwp-news-widget-2-content-holder">
        {news?.map((news) => {
          return (
            <div key={news.title} className="ucwp-news-widget-2-card">
              <div className="ucwp-news-widget-card-title-holder">
                <a href={news.url} target="_blank" rel="noreferrer">
                  <h3 className="ucwp-news-widget-card-title">{news.title}</h3>
                </a>
              </div>
              <div className="ucwp-news-widget-card-info-holder">
                <span className="ucwp-news-widget-card-tag-holder">
                  {news.tags.join(", ")}
                </span>
                <span className="ucwp-news-widget-card-date-holder">
                  {new Date(news.date).toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
              {/* content holder */}
              <div className="ucwp-news-widget-card-content-holder">
                {/* img holder cnt */}
                <div className="ucwp-news-widget-card-img-holder">
                  <img src={news.image} alt={news.title} />
                </div>
                {/*  content cnt show short description then read more */}
                <div className="ucwp-news-widget-card-content">
                  <p className="ucwp-news-widget-card-content-text">
                    {news.short_description}
                  </p>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ucwp-news-widget-card-content-read-more"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
})
