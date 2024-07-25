import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/price-block-widget.scss'

function PriceBlockWidget() {
  return (
    <div className="ucp-price-block-widget">
          <span className="ucp-pbw-welcome-message">
             Hello I  am working
          </span>
    </div>
  )
}

ReactRender(PriceBlockWidget)