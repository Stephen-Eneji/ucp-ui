// import React from "react";
// import ReactRender from "../../helper-components/react-wrapper";
// import '@/styles/sass/donation-box.scss';


// ReactRender(() => {
//   return (
//     <div className="DonationForm">
//     <button id="coins"><a href="#donatebitcoin">Donate Bitcoin</a></button>
//     <button> <a href="#donatebitcoin">Donate USDT(ERC20)</a></button>
//     <button><a href="#connect-metamask">Connect MetaMask wallet</a></button>

//     <div className="donation-form-container">
//       <div className="donation-form-header">
//         <span id="dfh-span">
//           <img src="https://img.icons8.com/?size=100&id=63192&format=png&color=000000" alt="btc-image" /> Bitcoin (BTC)
//         </span>
        
//         <span id="dfh-span">
//           <img src="https://img.icons8.com/?size=100&id=DEDR1BLPBScO&format=png&color=000000" alt="Tether" /> Tether (USDT)
//         </span>

//         <span id="dfh-span">
//           <img src="https://img.icons8.com/?size=100&id=Oi106YG9IoLv&format=png&color=000000" alt="Metamask" /> Metamask
//         </span>

//       </div>

//       <div className="qr-code">
//         <img src="#" alt="Will add QR Code soon" />
//       </div>

//       <div className="form">
//         <p>Donate bitcoin to this address</p>
//         <p>Scan the QR Code or copy the address below into your wallet to send bitcoin</p>
//         <p className="tag">Tag: Donation for BTC</p>
//         <input type="text" value="bc1qyqhp90ha9u82r4l0jk855y4c90vsyjqfcmj2zr" readOnly />
//       </div>

      
  
//     </div>
//     </div>
//   )
// })



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
    <div className={`ucp-db-platform-crypto-selected `}>
      <div className="ucp-db-platform-crypto-selected-qr-cnt">
        <img src={coin.qr_code} alt="QR Code" className="" />
      </div>
      <div className="ucp-db-platform-crypto-selected-form-cnt">
        <div className="ucp-db-platform-crypto-selected-form-main">
          {/* header */}
          <div className="ucp-db-platform-crypto-selected-form-header">
            Donate {coin.coin_name} ({coin.coin_symbol}) to this address
          </div>
          {/* info */}
          <div className="ucp-db-platform-crypto-selected-form-info">
            Scan the QR Code or copy the address below into your wallet to send
            {` ${coin.coin_name}`}
          </div>
          {/* tag */}
          <div className="ucp-db-platform-crypto-selected-form-tag">
            Tag: Donation for {coin.coin_symbol}
          </div>
          {/* input */}
          <div className="ucp-db-platform-crypto-selected-form-input">
            <input
              type="text"
              value={coin.address}
              readOnly
              className="ucp-db-platform-crypto-selected-form-input-text"
            />
            <button
              className="ucp-db-platform-crypto-selected-form-input-btn"
              onClick={handleCopyAddress}
            >
              <Copy className="ucp-db-platform-crypto-selected-form-input-copy-icon" />
            </button>
            <p
              className={`ucp-db-platform-crypto-selected-form-input-copied`}>
              {copied? "Copied" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactRender(({ crypto_payments, payment_platforms, settings }) => {
  const [cryptos, setCryptos] = useState(crypto_payments);
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0);

  const handleCryptoSelection = (index) => {
    setSelectedCryptoIndex(index);
  };

  return (
    <div className="ucp-donation-box">
      <div className="ucp-db-platform-selection-btn-cnt">
        {crypto_payments?.map((platform, index) => (
          <button
            key={index}
            className={`ucp-db-platform-selection-btn ${
              selectedCryptoIndex == index
                ? "ucp-db-platform-selection-btn-selected"
                : ""
            }`}
            onClick={() => handleCryptoSelection(index)}
          >
            <div className="ucp-db-platform-selection-btn-img">
              <img
                src={platform.coin_image}
                alt={platform.coin_name}
                className="ucp-db-platform-selection-btn-img-icon"
              />
            </div>
            <div className="ucp-db-platform-selection-btn-text">
              {platform.coin_name} ({platform.coin_symbol})
            </div>
          </button>
        ))}
      </div>
      <div className="ucp-db-platform-selected-cnt">
        <CryptoPayment coin={cryptos[selectedCryptoIndex]} />
      </div>
    </div>
  );
});