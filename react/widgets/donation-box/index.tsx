import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/donation-box.scss';


ReactRender(() => {
  return (
    <div className="DonationForm">
    <button id="coins"><a href="#donatebitcoin">Donate Bitcoin</a></button>
    <button> <a href="#donatebitcoin">Donate USDT(ERC20)</a></button>
    <button><a href="#connect-metamask">Connect MetaMask wallet</a></button>

    <div className="donation-form-container">
      <div className="donation-form-header">
        <span id="dfh-span">
          <img src="https://img.icons8.com/?size=100&id=63192&format=png&color=000000" alt="btc-image" /> Bitcoin (BTC)
        </span>
        
        <span id="dfh-span">
          <img src="https://img.icons8.com/?size=100&id=DEDR1BLPBScO&format=png&color=000000" alt="Tether" /> Tether (USDT)
        </span>

        <span id="dfh-span">
          <img src="https://img.icons8.com/?size=100&id=Oi106YG9IoLv&format=png&color=000000" alt="Metamask" /> Metamask
        </span>

      </div>

      <div className="qr-code">
        <img src="#" alt="Will add QR Code soon" />
      </div>

      <div className="form">
        <p>Donate bitcoin to this address</p>
        <p>Scan the QR Code or copy the address below into your wallet to send bitcoin</p>
        <p className="tag">Tag: Donation for BTC</p>
        <input type="text" value="bc1qyqhp90ha9u82r4l0jk855y4c90vsyjqfcmj2zr" readOnly />
      </div>

      
  
    </div>
    </div>
  )
})
