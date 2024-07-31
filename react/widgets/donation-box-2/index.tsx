import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/donation-box-2.scss'
import { Copy } from "iconsax-react";

ReactRender(({ crypto_payments, metamask, settings }) => {
  return (
    <div className="ucp-donation-box-2">
      {/* an array of card */}
      {crypto_payments.map((platform, index) => (
        <div className={`ucp-db2-card`} key={index}>
          <div className="ucp-db2-card-main">
            {/* info */}
            <div className="ucp-db2-card-header">
              <div className="ucp-db2-card-header-logo-holder">
                <img
                  src={platform.coin_image}
                  alt={`${platform.coin_name} logo`}
                  className="ucp-db2-card-header-logo"
                />
              </div>
              <div className="ucp-db2-card-header-info">
                Donate {platform.coin_name} ({platform.coin_symbol}) to this
                address
              </div>
            </div>
            {/* qrcode holder */}
            <div className="ucp-db2-card-qrcode-holder">
              <img
                src={platform.qr_code}
                alt={`${platform.coin_name} QR code`}
                className="ucp-db2-card-qrcode"
              />
            </div>
            {/* input and copy button */}
            <div className="ucp-db2-card-input-holder">
              <input
                type="text"
                placeholder="Enter your wallet address"
                className="ucp-db2-card-input"
                value={platform.address}
                readOnly
              />
              <button className="ucp-db2-card-copy-btn">
                <Copy className="ucp-db-platform-crypto-selected-form-input-copy-icon" />
              </button>
            </div>
            {/* additional info */}
            <div className="ucp-db2-card-additional-info">
              <div>
                <span>Note:</span> {platform.additional_info}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
