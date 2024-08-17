import React, { useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/donation-box-2.scss'
import { Copy } from "iconsax-react";
import { copyToClipboard } from "../../helper/helper";

ReactRender(({ crypto_payments, metamask, settings }) => {
  const [copied, setCopied] = useState<boolean | number>(false);

  const handleCopyAddress = (address, index) => {
    copyToClipboard(address);
    setCopied(index);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  return (
    <div className="ucwp-donation-box-2">
      {/* an array of card */}
      {crypto_payments.map((platform, index) => (
        <div className={`ucwp-db2-card`} key={index}>
          <div className="ucwp-db2-card-main">
            {/* info */}
            <div className="ucwp-db2-card-header">
              <div className="ucwp-db2-card-header-logo-holder">
                <img
                  src={platform.coin_image}
                  alt={`${platform.coin_name} logo`}
                  className="ucwp-db2-card-header-logo"
                />
              </div>
              <div className="ucwp-db2-card-header-info">
                Donate {platform.coin_name} ({platform.coin_symbol}) to this
                address
              </div>
            </div>
            {/* qrcode holder */}
            <div className="ucwp-db2-card-qrcode-holder">
              <img
                src={platform.qr_code}
                alt={`${platform.coin_name} QR code`}
                className="ucwp-db2-card-qrcode"
              />
            </div>
            {/* input and copy button */}
            <div className="ucwp-db2-card-input-holder">
              <input
                type="text"
                placeholder="Enter your wallet address"
                className="ucwp-db2-card-input"
                value={platform.address}
                readOnly
              />
              <button className="ucwp-db2-card-copy-btn" onClick={() => handleCopyAddress(platform.address, index)}>
                <Copy className="ucwp-db-platform-crypto-selected-form-input-copy-icon" />
              </button>
            </div>
            {/* additional info */}
            <div className="ucwp-db2-card-additional-info">
              <div>
                { copied === index ? 'Copied' : (<><span>Note:</span> {platform.additional_info ?? `Send ${platform.coin_name} to the address above`}</> )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
