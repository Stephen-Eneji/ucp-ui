import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/price-block-widget-2.scss'

function PriceBlockWidget() {
  return (
    <div className="ucp-price-block-widget-2">
          <span className="ucp-pbw-welcome-message">
             Hello I  am working  this is for card 2
          </span>
    </div>
  )
}

ReactRender(PriceBlockWidget)