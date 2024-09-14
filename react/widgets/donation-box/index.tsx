import React, { useEffect, useState } from "react";
import ReactRender from "../../helper-components/react-wrapper";
import "@/styles/sass/donation-box.scss";
import { copyToClipboard } from "../../helper/helper";
import { Copy } from "iconsax-react";

const CryptoPayment = ({ coin }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }   
  }, [copied]);

  const handleCopyAddress = () => {
    copyToClipboard(coin.address);
    setCopied(true);
  };

  return (
    <div className={`ucwp-db-platform-crypto-selected `}>
      <div className="ucwp-db-platform-crypto-selected-qr-cnt">
        <img src={coin.qr_code} alt="QR Code" className="" />
      </div>
      <div className="ucwp-db-platform-crypto-selected-form-cnt">
        <div className="ucwp-db-platform-crypto-selected-form-main">
          {/* header */}
          <div className="ucwp-db-platform-crypto-selected-form-header">
            Only send {coin.coin_name} ({coin.coin_symbol}) to this address
          </div>
          {/* info */}
          <div className="ucwp-db-platform-crypto-selected-form-info">
            Scan the QR Code or copy the address below into your wallet to send
            {` ${coin.coin_name}`}
          </div>
          {/* tag */}
          <div className="ucwp-db-platform-crypto-selected-form-tag">
            Tag: Buy us Coffee 🙂
          </div>
          {/* input */}
          <div className="ucwp-db-platform-crypto-selected-form-input">
            <input
              type="text" id="crypto-selected-form-input"
              value={coin.address}
              readOnly
              className="ucwp-db-platform-crypto-selected-form-input-text"
            />
            <button
              className="ucwp-db-platform-crypto-selected-form-input-btn"
              onClick={handleCopyAddress}
            >
              <Copy className="ucwp-db-platform-crypto-selected-form-input-copy-icon" />
            </button>
            <p
              className={`ucwp-db-platform-crypto-selected-form-input-copied`}>
              {copied? "Copied" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactRender(({ crypto_payments, metamask, settings }) => {
  const [cryptos, setCryptos] = useState(crypto_payments);
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0);

  const handleCryptoSelection = (index) => {
    setSelectedCryptoIndex(index);
  };

  return (
    <div className="ucwp-donation-box">
      <div className="ucwp-db-platform-selection-btn-cnt">
        {[
          ...crypto_payments,
          {
            coin_name: "MetaMask",
            coin_symbol: "",
            coin_image: "/assets/images/metamask.svg",
          },
        ]?.map((platform, index) => (
          <button
            key={index}
            className={`ucwp-db-platform-selection-btn ${
              selectedCryptoIndex == index
                ? "ucwp-db-platform-selection-btn-selected"
                : ""
            }`}
            onClick={() => handleCryptoSelection(index)}
          >
            <div className="ucwp-db-platform-selection-btn-img">
              <img
                src={platform.coin_image}
                alt={platform.coin_name}
                className="ucwp-db-platform-selection-btn-img-icon"
              />
            </div>
            <div className="ucwp-db-platform-selection-btn-text">
              {platform.coin_name} ({platform.coin_symbol})
            </div>
          </button>
        ))}
      </div>
      <div className="ucwp-db-platform-selected-cnt">
        {cryptos[selectedCryptoIndex] && (
          <CryptoPayment coin={cryptos[selectedCryptoIndex]} />
        )}
        {/* meta mask */}
        {selectedCryptoIndex >= crypto_payments.length && (
          <div className="ucwp-db-platform-metamask-selected">
            <div className="ucwp-db-platform-metamask-selected-qr-cnt">
              <img
                src={`https://www.bitcoinqrcodemaker.com/api/?style=ethereum&address=0x30FC622428e7221944C8eDB63244b533785BA540`}
                alt="QR Code"
                className=""
              />
            </div>
            <div className="ucwp-db-platform-metamask-selected-form-cnt">
              <div className="ucwp-db-platform-metamask-selected-form-main">
                {/* header */}
                <div className="ucwp-db-platform-metamask-selected-form-header">
                  Connect MetaMask wallet
                </div>
                {/* currency select */}
                <div className="ucwp-db-platform-metamask-selected-form-currency-select">
                  <select
                    name="currency"
                    id="currency"
                    className="ucwp-db-platform-metamask-selected-form-currency-select-select"
                  >
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="BNB">Binance Coin (BNB)</option>
                  </select>
                </div>
                {/* amount */}
                <div className="ucwp-db-platform-metamask-selected-form-amount">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="ucwp-db-platform-metamask-selected-form-amount-input"
                    placeholder="Amount"
                  />
                </div>
                {/* connect */}
                <div className="ucwp-db-platform-metamask-selected-form-connect">
                  <button className="ucwp-db-platform-metamask-selected-form-connect-btn">
                    Connect
                  </button>
                </div>
                {/* info */}
                <div className="ucwp-db-platform-metamask-selected-form-info">
                  Scan the QR Code or copy the address below into your wallet to send
                  Ethereum
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});